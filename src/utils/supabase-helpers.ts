
import { supabase } from "@/integrations/supabase/client";

// Type definitions for custom tables not in the generated types
export interface RoadmapResource {
  id: string;
  roadmap_id: string;
  label: string;
  url: string | null;
  completed: boolean;
  created_at: string;
}

export interface RoadmapSkill {
  id: string;
  roadmap_id: string;
  label: string;
  completed: boolean;
  created_at: string;
}

export interface RoadmapTool {
  id: string;
  roadmap_id: string;
  label: string;
  completed: boolean;
  created_at: string;
}

export interface RoadmapTimeline {
  id: string;
  roadmap_id: string;
  step: string;
  order_number: number;
  completed: boolean;
  created_at: string;
}

// Helper functions to work with custom tables
export const supabaseCustom = {
  // Resources
  resources: {
    select: () => supabase.from('roadmap_resources'),
    insert: (data: Omit<RoadmapResource, 'id' | 'created_at'> | Omit<RoadmapResource, 'id' | 'created_at'>[]) => 
      supabase.from('roadmap_resources').insert(data),
    update: (data: Partial<RoadmapResource>) => 
      supabase.from('roadmap_resources').update(data),
    delete: () => supabase.from('roadmap_resources').delete(),
    getByRoadmapId: (roadmapId: string) => 
      supabase.from('roadmap_resources').select('*').eq('roadmap_id', roadmapId)
  },
  
  // Skills
  skills: {
    select: () => supabase.from('roadmap_skills'),
    insert: (data: Omit<RoadmapSkill, 'id' | 'created_at'> | Omit<RoadmapSkill, 'id' | 'created_at'>[]) => 
      supabase.from('roadmap_skills').insert(data),
    update: (data: Partial<RoadmapSkill>) => 
      supabase.from('roadmap_skills').update(data),
    delete: () => supabase.from('roadmap_skills').delete(),
    getByRoadmapId: (roadmapId: string) => 
      supabase.from('roadmap_skills').select('*').eq('roadmap_id', roadmapId)
  },
  
  // Tools
  tools: {
    select: () => supabase.from('roadmap_tools'),
    insert: (data: Omit<RoadmapTool, 'id' | 'created_at'> | Omit<RoadmapTool, 'id' | 'created_at'>[]) => 
      supabase.from('roadmap_tools').insert(data),
    update: (data: Partial<RoadmapTool>) => 
      supabase.from('roadmap_tools').update(data),
    delete: () => supabase.from('roadmap_tools').delete(),
    getByRoadmapId: (roadmapId: string) => 
      supabase.from('roadmap_tools').select('*').eq('roadmap_id', roadmapId)
  },
  
  // Timeline
  timeline: {
    select: () => supabase.from('roadmap_timeline'),
    insert: (data: Omit<RoadmapTimeline, 'id' | 'created_at'> | Omit<RoadmapTimeline, 'id' | 'created_at'>[]) => 
      supabase.from('roadmap_timeline').insert(data),
    update: (data: Partial<RoadmapTimeline>) => 
      supabase.from('roadmap_timeline').update(data),
    delete: () => supabase.from('roadmap_timeline').delete(),
    getByRoadmapId: (roadmapId: string) => 
      supabase.from('roadmap_timeline').select('*').eq('roadmap_id', roadmapId)
  }
};
