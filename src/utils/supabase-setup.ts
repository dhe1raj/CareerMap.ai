
import { supabase } from "@/integrations/supabase/client";

export async function setupRoadmapTables() {
  try {
    // Check if roadmap_resources table exists
    const { data: resourcesExists, error: resourcesCheckError } = await supabase
      .from('roadmap_resources')
      .select('id')
      .limit(1);
    
    if (resourcesCheckError && resourcesCheckError.code === '42P01') {
      // Table doesn't exist, create it using the function
      const { error } = await supabase.rpc('create_roadmap_resources_table');
      if (error) throw error;
      console.log("Created roadmap_resources table");
    }
    
    // Check if roadmap_skills table exists
    const { data: skillsExists, error: skillsCheckError } = await supabase
      .from('roadmap_skills')
      .select('id')
      .limit(1);
    
    if (skillsCheckError && skillsCheckError.code === '42P01') {
      // Create the roadmap_skills table
      const { error } = await supabase.rpc('create_roadmap_skills_table');
      if (error) throw error;
      console.log("Created roadmap_skills table");
    }
    
    // Check if roadmap_tools table exists
    const { data: toolsExists, error: toolsCheckError } = await supabase
      .from('roadmap_tools')
      .select('id')
      .limit(1);
    
    if (toolsCheckError && toolsCheckError.code === '42P01') {
      // Create the roadmap_tools table
      const { error } = await supabase.rpc('create_roadmap_tools_table');
      if (error) throw error;
      console.log("Created roadmap_tools table");
    }
    
    // Check if roadmap_timeline table exists
    const { data: timelineExists, error: timelineCheckError } = await supabase
      .from('roadmap_timeline')
      .select('id')
      .limit(1);
    
    if (timelineCheckError && timelineCheckError.code === '42P01') {
      // Create the roadmap_timeline table
      const { error } = await supabase.rpc('create_roadmap_timeline_table');
      if (error) throw error;
      console.log("Created roadmap_timeline table");
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error setting up roadmap tables:", error);
    return { success: false, error };
  }
}

export default setupRoadmapTables;
