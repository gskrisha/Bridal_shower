-- Create messages table for Supabase
-- Run this in Supabase SQL editor or via psql
CREATE TABLE IF NOT EXISTS public.messages (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  message text NOT NULL,
  photo text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Optional index
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages (created_at DESC);
