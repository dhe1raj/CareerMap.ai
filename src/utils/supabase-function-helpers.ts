
import { supabase } from "@/integrations/supabase/client";
import { supabaseRpc } from "./supabase-rpc-helpers";

// Helper functions to work with custom tables
export const supabaseCustom = {
  // Resources
  resources: {
    select: () => supabase.from('roadmap_resources'),
    insert: (data: any | any[]) => {
      if (Array.isArray(data)) {
        return supabase.from('roadmap_resources').insert(data);
      } else {
        return supabase.from('roadmap_resources').insert([data]);
      }
    },
    update: (data: any) => 
      supabase.from('roadmap_resources').update(data),
    delete: () => supabase.from('roadmap_resources').delete(),
    getByRoadmapId: (roadmapId: string) => 
      supabase.from('roadmap_resources').select('*').eq('roadmap_id', roadmapId)
  },
  
  // Skills
  skills: {
    select: () => supabase.from('roadmap_skills'),
    insert: (data: any | any[]) => {
      if (Array.isArray(data)) {
        return supabase.from('roadmap_skills').insert(data);
      } else {
        return supabase.from('roadmap_skills').insert([data]);
      }
    },
    update: (data: any) => 
      supabase.from('roadmap_skills').update(data),
    delete: () => supabase.from('roadmap_skills').delete(),
    getByRoadmapId: (roadmapId: string) => 
      supabase.from('roadmap_skills').select('*').eq('roadmap_id', roadmapId)
  },
  
  // Tools
  tools: {
    select: () => supabase.from('roadmap_tools'),
    insert: (data: any | any[]) => {
      if (Array.isArray(data)) {
        return supabase.from('roadmap_tools').insert(data);
      } else {
        return supabase.from('roadmap_tools').insert([data]);
      }
    },
    update: (data: any) => 
      supabase.from('roadmap_tools').update(data),
    delete: () => supabase.from('roadmap_tools').delete(),
    getByRoadmapId: (roadmapId: string) => 
      supabase.from('roadmap_tools').select('*').eq('roadmap_id', roadmapId)
  },
  
  // Timeline
  timeline: {
    select: () => supabase.from('roadmap_timeline'),
    insert: (data: any | any[]) => {
      if (Array.isArray(data)) {
        return supabase.from('roadmap_timeline').insert(data);
      } else {
        return supabase.from('roadmap_timeline').insert([data]);
      }
    },
    update: (data: any) => 
      supabase.from('roadmap_timeline').update(data),
    delete: () => supabase.from('roadmap_timeline').delete(),
    getByRoadmapId: (roadmapId: string) => 
      supabase.from('roadmap_timeline').select('*').eq('roadmap_id', roadmapId)
  },
  
  // Delegate progress functions to our RPC helpers
  progress: {
    getUserProgress: supabaseRpc.getUserRoadmapProgress,
    getRoadmapProgress: supabaseRpc.getRoadmapProgress,
    initializeProgress: supabaseRpc.initializeRoadmapProgress,
    updateItemStatus: supabaseRpc.updateRoadmapItemStatus,
    resetProgress: supabaseRpc.resetRoadmapProgress
  }
};
