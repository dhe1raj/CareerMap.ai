
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { UserData } from "@/hooks/use-user-data";

interface RoadmapSummary {
  id: string;
  title: string;
  skills: string[];
  tools: string[];
  resources: { label: string; url?: string }[];
}

export function useDashboardRoadmap(userData: UserData, onUpdateField: (path: string, value: any) => void) {
  const [progress, setProgress] = useState(userData.career.progress);
  const [latestRoadmap, setLatestRoadmap] = useState<RoadmapSummary | null>(null);
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(true);
  const { user } = useAuth();
  
  // Get progress from the roadmaps and fetch the latest roadmap data
  useEffect(() => {
    const fetchProgress = async () => {
      // First try to get progress from Supabase if the user is logged in
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_roadmaps')
            .select('*, user_roadmap_steps(*)')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });
          
          if (error) {
            console.error("Error fetching roadmaps from Supabase:", error);
            fallbackToLocalStorage();
          } else if (data && data.length > 0) {
            // Calculate combined progress from all roadmaps
            const averageProgress = data.reduce((sum: number, roadmap: any) => {
              if (roadmap.user_roadmap_steps && roadmap.user_roadmap_steps.length > 0) {
                const completed = roadmap.user_roadmap_steps.filter((step: any) => step.completed).length;
                return sum + (completed / roadmap.user_roadmap_steps.length * 100);
              }
              return sum;
            }, 0) / data.length;
            
            const roundedProgress = Math.round(averageProgress);
            setProgress(roundedProgress);
            onUpdateField('career.progress', roundedProgress);
            
            // Fetch the most recent roadmap's detailed data
            if (data[0]) {
              fetchLatestRoadmapDetails(data[0].id);
            }
          } else {
            fallbackToLocalStorage();
          }
        } catch (error) {
          console.error("Failed to fetch roadmaps progress:", error);
          fallbackToLocalStorage();
        } finally {
          setIsLoadingRoadmap(false);
        }
      } else {
        // If not logged in, fall back to localStorage
        fallbackToLocalStorage();
        setIsLoadingRoadmap(false);
      }
    };
    
    const fetchLatestRoadmapDetails = async (roadmapId: string) => {
      try {
        // Fetch skills
        const { data: skills, error: skillsError } = await supabase
          .from('roadmap_skills')
          .select('label')
          .eq('roadmap_id', roadmapId);
          
        if (skillsError) throw skillsError;
        
        // Fetch tools
        const { data: tools, error: toolsError } = await supabase
          .from('roadmap_tools')
          .select('label')
          .eq('roadmap_id', roadmapId);
          
        if (toolsError) throw toolsError;
        
        // Fetch resources
        const { data: resources, error: resourcesError } = await supabase
          .from('roadmap_resources')
          .select('label, url')
          .eq('roadmap_id', roadmapId);
          
        if (resourcesError) throw resourcesError;
        
        // Fetch the roadmap title
        const { data: roadmap, error: roadmapError } = await supabase
          .from('user_roadmaps')
          .select('title')
          .eq('id', roadmapId)
          .single();
          
        if (roadmapError) throw roadmapError;
        
        setLatestRoadmap({
          id: roadmapId,
          title: roadmap.title,
          skills: skills.map((s: any) => s.label),
          tools: tools.map((t: any) => t.label),
          resources: resources.map((r: any) => ({ label: r.label, url: r.url }))
        });
      } catch (error) {
        console.error("Error fetching latest roadmap details:", error);
      }
    };
    
    // Fallback to localStorage if Supabase fails or user is not logged in
    const fallbackToLocalStorage = () => {
      // Load progress data from localStorage
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          if (parsedData.userRoadmaps && Array.isArray(parsedData.userRoadmaps)) {
            // Calculate combined progress from all roadmaps
            if (parsedData.userRoadmaps.length > 0) {
              const averageProgress = parsedData.userRoadmaps.reduce((sum: number, roadmap: any) => {
                if (roadmap.steps && roadmap.steps.length > 0) {
                  const completed = roadmap.steps.filter((step: any) => step.completed).length;
                  return sum + (completed / roadmap.steps.length * 100);
                }
                return sum;
              }, 0) / parsedData.userRoadmaps.length;
              
              setProgress(Math.round(averageProgress));
              onUpdateField('career.progress', Math.round(averageProgress));
              
              // Set latest roadmap from local storage (simplified)
              const latestRoadmap = parsedData.userRoadmaps[0];
              if (latestRoadmap) {
                // Extract skills, tools, resources from the steps if available
                const skills: string[] = [];
                const tools: string[] = [];
                const resources: {label: string, url?: string}[] = [];
                
                latestRoadmap.steps.forEach((step: any) => {
                  const label = step.label.toLowerCase();
                  if (label.includes('skill')) skills.push(step.label);
                  else if (label.includes('tool')) tools.push(step.label);
                  else if (label.includes('resource') || label.includes('http')) {
                    let url;
                    const urlMatch = step.label.match(/\((https?:\/\/[^\s)]+)\)/);
                    if (urlMatch) url = urlMatch[1];
                    resources.push({ label: step.label, url });
                  }
                });
                
                setLatestRoadmap({
                  id: latestRoadmap.id,
                  title: latestRoadmap.title,
                  skills,
                  tools,
                  resources
                });
              }
            } else {
              setProgress(userData.career.progress);
            }
          } else if (parsedData.userRoadmap) {
            // Handle single roadmap case
            if (parsedData.userRoadmap.steps && parsedData.userRoadmap.steps.length > 0) {
              const completed = parsedData.userRoadmap.steps.filter((step: any) => step.completed).length;
              const roadmapProgress = Math.round((completed / parsedData.userRoadmap.steps.length) * 100);
              
              setProgress(roadmapProgress);
              onUpdateField('career.progress', roadmapProgress);
            }
          }
        } catch (error) {
          console.error("Failed to parse saved roadmaps:", error);
        }
      }
    };
    
    fetchProgress();
    
    // Set up Supabase realtime subscription for user_roadmaps changes
    if (user) {
      const channel = supabase
        .channel('roadmap-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_roadmap_steps',
          },
          () => {
            // When steps change, refetch the progress data
            fetchProgress();
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userData, onUpdateField, user]);
  
  return {
    progress,
    latestRoadmap,
    isLoadingRoadmap
  };
}
