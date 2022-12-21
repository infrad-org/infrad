-- up migration

CREATE TABLE whatsapp_webhook_messages (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  data JSONB
);
