
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

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

// Type to represent section and item structure from the database
interface RoadmapSection {
  title: string;
  items: Array<{ id: string; label: string; }>;
}

/**
 * Helper functions for working with Supabase
 */
export const supabaseRpc = {
  // Get user roadmap progress
  getUserRoadmapProgress: async (userId: string): Promise<SupabaseRoadmapProgress[]> => {
    const { data, error } = await supabase
      .from('users_roadmap_progress')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data as unknown as SupabaseRoadmapProgress[];
  },
  
  // Get progress for a specific roadmap
  getRoadmapProgress: async (roadmapId: string, userId: string): Promise<SupabaseRoadmapProgress | null> => {
    const { data, error } = await supabase
      .from('users_roadmap_progress')
      .select('*')
      .eq('roadmap_id', roadmapId)
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned" which is OK
    return data as unknown as SupabaseRoadmapProgress | null;
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
    let progress = await supabaseRpc.getRoadmapProgress(roadmapId, userId);
      
    if (!progress) {
      // If no progress record exists, initialize one
      await supabaseRpc.initializeRoadmapProgress(roadmapId, userId);
      progress = await supabaseRpc.getRoadmapProgress(roadmapId, userId);
      
      if (!progress) {
        throw new Error("Failed to initialize roadmap progress");
      }
    }
    
    // Get the roadmap to calculate total items
    const { data: roadmap, error: roadmapError } = await supabase
      .from('roadmaps')
      .select('*')
      .eq('id', roadmapId)
      .single();
      
    if (roadmapError) throw roadmapError;
    
    // Update the completed items
    let completedItems = progress.completed_items || [];
    
    if (completed && !completedItems.includes(itemId)) {
      completedItems.push(itemId);
    } else if (!completed && completedItems.includes(itemId)) {
      completedItems = completedItems.filter(item => item !== itemId);
    }
    
    // Calculate progress percentage
    let totalItems = 0;
    try {
      if (roadmap.sections) {
        // Parse the JSON data safely
        let parsedSections: RoadmapSection[] = [];
        
        if (typeof roadmap.sections === 'string') {
          // If it's a JSON string, parse it
          try {
            parsedSections = JSON.parse(roadmap.sections) as RoadmapSection[];
          } catch (e) {
            console.warn('Failed to parse roadmap sections JSON string');
          }
        } else if (Array.isArray(roadmap.sections)) {
          // If it's already an array, map it to ensure type safety
          parsedSections = (roadmap.sections as unknown[]).map(section => {
            // Safely convert the Json type to RoadmapSection
            if (typeof section === 'object' && section !== null) {
              const sectionObj = section as Record<string, unknown>;
              return {
                title: String(sectionObj.title || ''),
                items: Array.isArray(sectionObj.items) 
                  ? sectionObj.items.map(item => {
                      const itemObj = item as Record<string, unknown>;
                      return {
                        id: String(itemObj.id || ''),
                        label: String(itemObj.label || '')
                      };
                    })
                  : []
              };
            }
            return { title: '', items: [] };
          });
        } else if (typeof roadmap.sections === 'object' && roadmap.sections !== null) {
          // If it's some other object, try to convert it
          const section = roadmap.sections as Record<string, unknown>;
          parsedSections = [{
            title: String(section.title || ''),
            items: Array.isArray(section.items) 
              ? section.items.map(item => {
                  const itemObj = item as Record<string, unknown>;
                  return {
                    id: String(itemObj.id || ''),
                    label: String(itemObj.label || '')
                  };
                })
              : []
          }];
        }
        
        // Count items from all sections
        for (const section of parsedSections) {
          if (section && Array.isArray(section.items)) {
            totalItems += section.items.length;
          }
        }
      }
    } catch (e) {
      console.warn('Could not calculate total items from roadmap data', e);
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
