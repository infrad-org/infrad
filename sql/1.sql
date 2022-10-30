CREATE EXTENSION IF NOT EXISTS postgis;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE EXTENSION IF NOT EXISTS pg_hashids;

CREATE TABLE IF NOT EXISTS points (
  id BIGSERIAL,
  hashid TEXT NOT NULL,
  loc GEOMETRY(POINT, 4326) NOT NULL,
  DATA jsonb NOT NULL DEFAULT '{}'
);

CREATE OR REPLACE FUNCTION points_pre_insert() RETURNS TRIGGER AS $$
  BEGIN
  	NEW.hashid := id_encode(NEW.id, '#fietsgeluk', 10);
  	RETURN NEW;
  END
$$ LANGUAGE plpgsql;

CREATE TRIGGER points_pre_insert BEFORE INSERT ON points FOR EACH ROW EXECUTE PROCEDURE points_pre_insert();

CREATE OR REPLACE FUNCTION create_point(long float, lat float) RETURNS TEXT AS $$
	INSERT
	INTO
	points (loc)
VALUES (ST_MakePoint(long, lat))
RETURNING hashid;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION custom_query(query TEXT, params text) RETURNS SETOF json AS $$
    BEGIN
	    EXECUTE format('prepare query (json) AS WITH tmp as (%s) select row_to_json(tmp.*) from tmp', query);
	    RETURN QUERY EXECUTE format('execute query(%L)', params);
	    DEALLOCATE query;
    END
    $$ LANGUAGE plpgsql;

