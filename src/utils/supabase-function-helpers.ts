
import { supabase } from "@/integrations/supabase/client";

// Helper functions for working with Supabase RPC functions
export const roadmapProgressFunctions = {
  // Get user progress for all roadmaps
  getUserRoadmapProgress: async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('get_user_roadmap_progress', {
        user_id_param: userId
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error getting user roadmap progress:', error);
      return { data: null, error };
    }
  },
  
  // Get progress for a specific roadmap
  getRoadmapProgress: async (roadmapId: string, userId: string) => {
    try {
      const { data, error } = await supabase.rpc('get_roadmap_progress', {
        roadmap_id_param: roadmapId,
        user_id_param: userId
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error getting roadmap progress:', error);
      return { data: null, error };
    }
  },
  
  // Initialize progress tracking for a new roadmap
  initializeRoadmapProgress: async (roadmapId: string, userId: string) => {
    try {
      const { data, error } = await supabase.rpc('initialize_roadmap_progress', {
        roadmap_id_param: roadmapId,
        user_id_param: userId
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error initializing roadmap progress:', error);
      return { data: null, error };
    }
  },
  
  // Update roadmap item completion status
  updateRoadmapItemStatus: async (roadmapId: string, userId: string, itemId: string, completed: boolean) => {
    try {
      const { data, error } = await supabase.rpc('update_roadmap_item_status', {
        roadmap_id_param: roadmapId,
        user_id_param: userId,
        item_id_param: itemId,
        completed_param: completed
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating roadmap item status:', error);
      return { data: null, error };
    }
  },
  
  // Reset progress for a roadmap
  resetRoadmapProgress: async (roadmapId: string, userId: string) => {
    try {
      const { data, error } = await supabase.rpc('reset_roadmap_progress', {
        roadmap_id_param: roadmapId,
        user_id_param: userId
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error resetting roadmap progress:', error);
      return { data: null, error };
    }
  }
};

// Alternative implementation using direct table queries when RPC functions are not available
export const roadmapProgressHelpers = {
  // Get progress for all user roadmaps (fallback implementation)
  getUserProgress: async (userId: string) => {
    try {
      // Try to query directly if the table exists and permissions are set
      const { data, error } = await supabase
        .from('user_roadmap_progress')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error getting user progress:', error);
      return { data: [], error };
    }
  },
  
  // Update item completion status (fallback implementation)
  updateItemStatus: async (roadmapId: string, userId: string, itemId: string, completed: boolean) => {
    try {
      // First, get the current progress record
      const { data: progressData, error: getError } = await supabase
        .from('user_roadmap_progress')
        .select('*')
        .eq('roadmap_id', roadmapId)
        .eq('user_id', userId)
        .maybeSingle();
        
      if (getError) throw getError;
      
      if (!progressData) {
        // Create new progress record if none exists
        const { error: insertError } = await supabase
          .from('user_roadmap_progress')
          .insert({
            roadmap_id: roadmapId,
            user_id: userId,
            completed_items: completed ? [itemId] : [],
            progress_pct: 0 // Will calculate this in a subsequent step
          });
          
        if (insertError) throw insertError;
        
        return { success: true, error: null };
      }
      
      // Update existing progress record
      let completedItems = progressData.completed_items || [];
      
      if (completed && !completedItems.includes(itemId)) {
        completedItems.push(itemId);
      } else if (!completed) {
        completedItems = completedItems.filter(id => id !== itemId);
      }
      
      const { error: updateError } = await supabase
        .from('user_roadmap_progress')
        .update({
          completed_items: completedItems
        })
        .eq('id', progressData.id);
        
      if (updateError) throw updateError;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Error updating item status:', error);
      return { success: false, error };
    }
  }
};
