create role anon nologin;
GRANT infrad TO anon;

CREATE OR REPLACE FUNCTION reset_db() RETURNS void AS $$
--	DELETE FROM users
$$ LANGUAGE SQL;
