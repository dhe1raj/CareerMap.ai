
/* Custom RPC Functions for Career matches and resources */

-- Insert a match
CREATE OR REPLACE FUNCTION public.insert_match(
  role_param TEXT,
  short_desc_param TEXT,
  icon_param TEXT,
  match_pct_param INTEGER,
  bullets_param JSONB
) RETURNS VOID
LANGUAGE SQL
AS $$
  INSERT INTO public.matches (role, short_desc, icon, match_pct, bullets)
  VALUES (role_param, short_desc_param, icon_param, match_pct_param, bullets_param);
$$;

-- Insert a user match
CREATE OR REPLACE FUNCTION public.insert_user_match(
  user_id_param UUID,
  match_id_param UUID
) RETURNS VOID
LANGUAGE SQL
AS $$
  INSERT INTO public.user_matches (user_id, match_id)
  VALUES (user_id_param, match_id_param)
  ON CONFLICT (user_id, match_id) DO NOTHING;
$$;

-- Get all resources
CREATE OR REPLACE FUNCTION public.get_all_resources()
RETURNS SETOF public.resources
LANGUAGE SQL
AS $$
  SELECT * FROM public.resources;
$$;

-- Get user resource progress
CREATE OR REPLACE FUNCTION public.get_user_resource_progress(user_id_param UUID)
RETURNS SETOF public.user_resource_progress
LANGUAGE SQL
AS $$
  SELECT * FROM public.user_resource_progress WHERE user_id = user_id_param;
$$;

-- Insert a resource
CREATE OR REPLACE FUNCTION public.insert_resource(
  type_param TEXT,
  title_param TEXT,
  url_param TEXT,
  thumbnail_param TEXT,
  skill_tag_param TEXT,
  description_param TEXT
) RETURNS VOID
LANGUAGE SQL
AS $$
  INSERT INTO public.resources (type, title, url, thumbnail, skill_tag, description)
  VALUES (type_param, title_param, url_param, thumbnail_param, skill_tag_param, description_param);
$$;

-- Upsert user resource progress
CREATE OR REPLACE FUNCTION public.upsert_user_resource_progress(
  user_id_param UUID,
  resource_id_param UUID,
  completed_param BOOLEAN,
  completed_at_param TIMESTAMPTZ
) RETURNS VOID
LANGUAGE SQL
AS $$
  INSERT INTO public.user_resource_progress (user_id, resource_id, completed, completed_at)
  VALUES (user_id_param, resource_id_param, completed_param, completed_at_param)
  ON CONFLICT (user_id, resource_id) 
  DO UPDATE SET
    completed = completed_param,
    completed_at = completed_at_param;
$$;
