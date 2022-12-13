CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS points (
  id BIGSERIAL,
  hashid TEXT PRIMARY KEY,
  location GEOMETRY(POINT, 4326) NOT NULL,
  description TEXT NOT NULL,
  photo TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS whatsapp_conv_status (
  phone_number_id TEXT PRIMARY KEY,
  pending_location GEOMETRY(POINT, 4326),
  pending_description TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)

CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_timestamp_points
BEFORE UPDATE ON points
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at_timestamp();

CREATE TRIGGER set_updated_at_whatsapp_conv_status
BEFORE UPDATE ON whatsapp_conv_status
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at_timestamp();

CREATE OR REPLACE FUNCTION add_hashid() RETURNS TRIGGER AS $$
  BEGIN
  	NEW.hashid := hashids.encode(NEW.id, '#fietsgeluk', 10);
  	RETURN NEW;
  END
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_hashid_points
BEFORE INSERT ON points
FOR EACH ROW
EXECUTE PROCEDURE add_hashid();

CREATE OR REPLACE FUNCTION update_whatsapp_conv(jsondata jsonb) RETURNS jsonb AS $$
  DECLARE
  	new_conv_status whatsapp_conv_status;
    curr_phone_number_id TEXT NOT null = jsondata->>'phone_number_id';
  	result jsonb;
  BEGIN
    INSERT INTO whatsapp_conv_status (phone_number_id, pending_description, pending_location) VALUES (
		curr_phone_number_id,
		COALESCE(jsondata->>'description', ''),
		ST_GeomFromGeoJSON(jsondata->>'location')
	) ON CONFLICT (phone_number_id)
		DO UPDATE
	  	SET
	  		pending_description = COALESCE(jsondata->>'description', whatsapp_conv_status.pending_description),
	  		pending_location = COALESCE(ST_GeomFromGeoJSON(jsondata->>'location'), whatsapp_conv_status.pending_location)
	  	RETURNING * INTO new_conv_status;
	IF new_conv_status.pending_description != '' AND new_conv_status.pending_location IS NOT NULL THEN 
		INSERT INTO points (location, description) VALUES (
			new_conv_status.pending_location, new_conv_status.pending_description)
			RETURNING to_json(points.*) INTO RESULT;
		DELETE FROM whatsapp_conv_status WHERE phone_number_id = curr_phone_number_id;
		RETURN RESULT;
	END IF;
  	RETURN to_json(new_conv_status);
  END
$$ LANGUAGE plpgsql;

--DROP FUNCTION update_whatsapp_conv(jsonb);
 
--SELECT update_whatsapp_conv('{"phone_number_id": "test", "location": { "type": "Point", "coordinates": [31.0, 10.0] }}'::jsonb);
--
--SELECT update_whatsapp_conv('{"phone_number_id": "test", "description": "test" }'::jsonb);

--DELETE FROM whatsapp_conv_status;