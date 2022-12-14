-- down migration
DROP TABLE points;

DROP TABLE whatsapp_conv_status;

DROP FUNCTION set_updated_at_timestamp;

DROP FUNCTION add_hashid;

DROP FUNCTION update_whatsapp_conv;