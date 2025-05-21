
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
    const { data, error } = await supabase
      .from('users_roadmap_progress')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data as SupabaseRoadmapProgress[];
  },
  
  // Get progress for a specific roadmap
  getRoadmapProgress: async (roadmapId: string, userId: string) => {
    const { data, error } = await supabase
      .from('users_roadmap_progress')
      .select('*')
      .eq('roadmap_id', roadmapId)
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned" which is OK
    return data as SupabaseRoadmapProgress | null;
  },
  
  // Initialize roadmap progress
  initializeRoadmapProgress: async (roadmapId: string, userId: string) => {
    const { data, error } = await supabase
      .from('users_roadmap_progress')
      .insert({
        roadmap_id: roadmapId,
        user_id: userId,
        progress_pct: 0,
        completed_items: []
      })
      .select()
      .single();
    
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
    // First get the current progress
    const { data: currentProgress, error: fetchError } = await supabase
      .from('users_roadmap_progress')
      .select('*')
      .eq('roadmap_id', roadmapId)
      .eq('user_id', userId)
      .single();
      
    if (fetchError) {
      // If no progress record exists, initialize one
      if (fetchError.code === 'PGRST116') { // No rows found
        return await supabaseRpc.initializeRoadmapProgress(roadmapId, userId);
      }
      throw fetchError;
    }
    
    // Get the roadmap to calculate total items
    const { data: roadmap, error: roadmapError } = await supabase
      .from('roadmaps')
      .select('*')
      .eq('id', roadmapId)
      .single();
      
    if (roadmapError) throw roadmapError;
    
    // Update the completed items
    let completedItems = currentProgress.completed_items || [];
    
    if (completed && !completedItems.includes(itemId)) {
      completedItems.push(itemId);
    } else if (!completed && completedItems.includes(itemId)) {
      completedItems = completedItems.filter(item => item !== itemId);
    }
    
    // Calculate progress percentage
    // This is a simplified calculation - we should get the total number of items
    // from the roadmap sections in a real implementation
    let totalItems = 0;
    try {
      if (roadmap.sections) {
        for (const section of roadmap.sections) {
          totalItems += section.items.length;
        }
      }
    } catch (e) {
      console.warn('Could not calculate total items from roadmap data');
      totalItems = 10; // Default fallback
    }
    
    const progressPct = totalItems > 0 ? (completedItems.length / totalItems) * 100 : 0;
    
    // Update the progress record
    const { data, error } = await supabase
      .from('users_roadmap_progress')
      .update({
        completed_items: completedItems,
        progress_pct: progressPct,
        updated_at: new Date().toISOString()
      })
      .eq('roadmap_id', roadmapId)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Reset roadmap progress
  resetRoadmapProgress: async (roadmapId: string, userId: string) => {
    const { data, error } = await supabase
      .from('users_roadmap_progress')
      .update({
        completed_items: [],
        progress_pct: 0,
        updated_at: new Date().toISOString()
      })
      .eq('roadmap_id', roadmapId)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
