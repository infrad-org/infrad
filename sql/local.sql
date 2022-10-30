create role anon nologin;
GRANT infrad TO anon;

CREATE OR REPLACE FUNCTION reset_db() RETURNS void AS $$
--	DELETE FROM users
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION public.pgrst_watch() RETURNS event_trigger
  LANGUAGE plpgsql
  AS $$
BEGIN
  NOTIFY pgrst, 'reload schema';
END;
$$;

-- This event trigger will fire after every ddl_command_end event
CREATE EVENT TRIGGER pgrst_watch
  ON ddl_command_end
  EXECUTE PROCEDURE public.pgrst_watch();