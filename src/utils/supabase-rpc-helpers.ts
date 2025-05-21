
import { supabase } from "@/integrations/supabase/client";
import { RoadmapProgress } from "@/types/roadmap";

// Type to represent the RoadmapProgress structure expected from the database
export interface SupabaseRoadmapProgress {
  id: string;
  roadmap_id: string;
  user_id: string;
  progress_pct: number;
  completed_items: string[];
  started_at: string;
  updated_at: string;
}

/**
 * Helper functions for calling RPC functions directly
 */
export const supabaseRpc = {
  // Get user roadmap progress
  getUserRoadmapProgress: async (userId: string) => {
    const { data, error } = await supabase.rpc('get_user_roadmap_progress', {
      user_id_param: userId
    });
    
    if (error) throw error;
    return data as SupabaseRoadmapProgress[];
  },
  
  // Get progress for a specific roadmap
  getRoadmapProgress: async (roadmapId: string, userId: string) => {
    const { data, error } = await supabase.rpc('get_roadmap_progress', {
      roadmap_id_param: roadmapId,
      user_id_param: userId
    });
    
    if (error) throw error;
    return data as SupabaseRoadmapProgress | null;
  },
  
  // Initialize roadmap progress
  initializeRoadmapProgress: async (roadmapId: string, userId: string) => {
    const { data, error } = await supabase.rpc('initialize_roadmap_progress', {
      roadmap_id_param: roadmapId,
      user_id_param: userId
    });
    
    if (error) throw error;
    return data;
  },
  
  // Update roadmap item status
  updateRoadmapItemStatus: async (
    roadmapId: string, 
    userId: string, 
    itemId: string, 
    completed: boolean
  ) => {
    const { data, error } = await supabase.rpc('update_roadmap_item_status', {
      roadmap_id_param: roadmapId,
      user_id_param: userId,
      item_id_param: itemId,
      completed_param: completed
    });
    
    if (error) throw error;
    return data;
  },
  
  // Reset roadmap progress
  resetRoadmapProgress: async (roadmapId: string, userId: string) => {
    const { data, error } = await supabase.rpc('reset_roadmap_progress', {
      roadmap_id_param: roadmapId,
      user_id_param: userId
    });
    
    if (error) throw error;
    return data;
  }
};
