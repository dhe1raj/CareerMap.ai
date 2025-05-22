
-- Create the user_roadmap_progress table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roadmap_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  progress_pct NUMERIC NOT NULL DEFAULT 0,
  completed_items TEXT[] NOT NULL DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(roadmap_id, user_id)
);

-- Enable RLS
ALTER TABLE public.user_roadmap_progress ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view only their own progress
CREATE POLICY IF NOT EXISTS "Users can view their own progress"
ON public.user_roadmap_progress
FOR SELECT
USING (auth.uid() = user_id);

-- Create policy to allow users to update only their own progress
CREATE POLICY IF NOT EXISTS "Users can update their own progress"
ON public.user_roadmap_progress
FOR UPDATE
USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own progress
CREATE POLICY IF NOT EXISTS "Users can insert their own progress"
ON public.user_roadmap_progress
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create RPC function to get user roadmap progress
CREATE OR REPLACE FUNCTION public.get_user_roadmap_progress(user_id_param UUID)
RETURNS SETOF public.user_roadmap_progress AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.user_roadmap_progress
  WHERE user_id = user_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RPC function to get progress for a specific roadmap
CREATE OR REPLACE FUNCTION public.get_roadmap_progress(
  roadmap_id_param UUID,
  user_id_param UUID
)
RETURNS public.user_roadmap_progress AS $$
DECLARE
  result public.user_roadmap_progress;
BEGIN
  SELECT * INTO result
  FROM public.user_roadmap_progress
  WHERE roadmap_id = roadmap_id_param AND user_id = user_id_param;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RPC function to initialize progress tracking for a new roadmap
CREATE OR REPLACE FUNCTION public.initialize_roadmap_progress(
  roadmap_id_param UUID,
  user_id_param UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO public.user_roadmap_progress (roadmap_id, user_id, progress_pct, completed_items)
  VALUES (roadmap_id_param, user_id_param, 0, '{}')
  ON CONFLICT (roadmap_id, user_id) DO NOTHING;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RPC function to update roadmap item completion status
CREATE OR REPLACE FUNCTION public.update_roadmap_item_status(
  roadmap_id_param UUID,
  user_id_param UUID,
  item_id_param TEXT,
  completed_param BOOLEAN
)
RETURNS BOOLEAN AS $$
DECLARE
  roadmap_data JSON;
  progress_record public.user_roadmap_progress;
  total_items INTEGER := 0;
  completed_items TEXT[] := '{}';
  new_progress_pct NUMERIC;
BEGIN
  -- Get roadmap data to calculate total items
  SELECT sections INTO roadmap_data
  FROM public.roadmaps
  WHERE id = roadmap_id_param;
  
  -- Get current progress record or create if not exists
  SELECT * INTO progress_record
  FROM public.user_roadmap_progress
  WHERE roadmap_id = roadmap_id_param AND user_id = user_id_param;
  
  IF progress_record IS NULL THEN
    INSERT INTO public.user_roadmap_progress (roadmap_id, user_id, progress_pct, completed_items)
    VALUES (roadmap_id_param, user_id_param, 0, '{}')
    RETURNING * INTO progress_record;
  END IF;
  
  -- Update completed items array
  completed_items := progress_record.completed_items;
  
  IF completed_param THEN
    -- Add item if not already present
    IF NOT (item_id_param = ANY(completed_items)) THEN
      completed_items := array_append(completed_items, item_id_param);
    END IF;
  ELSE
    -- Remove item if present
    IF (item_id_param = ANY(completed_items)) THEN
      completed_items := array_remove(completed_items, item_id_param);
    END IF;
  END IF;
  
  -- Calculate total items across all sections
  SELECT COALESCE(SUM(jsonb_array_length(section->'items')), 0) INTO total_items
  FROM jsonb_array_elements(roadmap_data::jsonb) section;
  
  -- Calculate new progress percentage
  IF total_items > 0 THEN
    new_progress_pct := (array_length(completed_items, 1) * 100.0 / total_items);
  ELSE
    new_progress_pct := 0;
  END IF;
  
  -- Update progress record
  UPDATE public.user_roadmap_progress
  SET 
    completed_items = completed_items,
    progress_pct = new_progress_pct,
    updated_at = now()
  WHERE id = progress_record.id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RPC function to reset roadmap progress
CREATE OR REPLACE FUNCTION public.reset_roadmap_progress(
  roadmap_id_param UUID,
  user_id_param UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.user_roadmap_progress
  SET 
    completed_items = '{}',
    progress_pct = 0,
    updated_at = now()
  WHERE roadmap_id = roadmap_id_param AND user_id = user_id_param;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
