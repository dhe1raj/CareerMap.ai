
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useUserData } from "@/hooks/use-user-data";
import { toast } from "sonner";

export function useRoadmaps() {
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [isRoadmapsLoading, setIsRoadmapsLoading] = useState(true);
  const { user } = useAuth();
  const { fetchUserData } = useUserData();
  
  const fetchRoadmaps = async () => {
    setIsRoadmapsLoading(true);
    
    if (user) {
      try {
        // Fetch all user roadmaps with their steps
        const { data, error } = await supabase
          .from('user_roadmaps')
          .select('*, user_roadmap_steps(*)')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching roadmaps from Supabase:", error);
          loadFromLocalStorage();
        } else if (data && data.length > 0) {
          // Transform the data to match our expected format
          const formattedRoadmaps = data.map(roadmap => ({
            id: roadmap.id,
            title: roadmap.title,
            lastUpdated: roadmap.updated_at,
            category: roadmap.category,
            steps: roadmap.user_roadmap_steps.map((step: any) => ({
              order: step.order_number,
              label: step.label,
              estTime: step.est_time,
              completed: step.completed
            }))
          }));
          
          setRoadmaps(formattedRoadmaps);
        } else {
          loadFromLocalStorage();
        }
      } catch (error) {
        console.error("Failed to fetch roadmaps:", error);
        loadFromLocalStorage();
      } finally {
        setIsRoadmapsLoading(false);
      }
    } else {
      // If not logged in, fall back to localStorage
      loadFromLocalStorage();
      setIsRoadmapsLoading(false);
    }
  };
  
  // Fallback to localStorage if Supabase fails or user is not logged in
  const loadFromLocalStorage = () => {
    // Get saved roadmaps from localStorage for now
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData.userRoadmaps && Array.isArray(parsedData.userRoadmaps)) {
          setRoadmaps(parsedData.userRoadmaps);
        } else if (parsedData.userRoadmap) {
          // Handle single roadmap case
          setRoadmaps([parsedData.userRoadmap]);
        }
      } catch (error) {
        console.error("Failed to parse saved roadmaps:", error);
      }
    }
  };
  
  const handleProgressUpdate = (roadmapId: string, progress: number) => {
    // Update local state if needed
    setRoadmaps(prevRoadmaps => 
      prevRoadmaps.map(roadmap => 
        roadmap.id === roadmapId 
          ? { ...roadmap, progress: progress }
          : roadmap
      )
    );
    
    // Refresh user data to update dashboard
    fetchUserData();
  };
  
  const handleDeleteRoadmap = async (id: string) => {
    if (user) {
      try {
        // Delete related data first
        await Promise.all([
          supabase.from('roadmap_resources').delete().eq('roadmap_id', id),
          supabase.from('roadmap_skills').delete().eq('roadmap_id', id),
          supabase.from('roadmap_tools').delete().eq('roadmap_id', id),
          supabase.from('roadmap_timeline').delete().eq('roadmap_id', id),
          supabase.from('user_roadmap_steps').delete().eq('roadmap_id', id)
        ]);
        
        // Then delete the main roadmap
        const { error } = await supabase
          .from('user_roadmaps')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        // Update local state
        setRoadmaps(prevRoadmaps => prevRoadmaps.filter(roadmap => roadmap.id !== id));
        toast.success("Roadmap deleted");
        
        // Refresh user data to update dashboard
        fetchUserData();
      } catch (error) {
        console.error("Error deleting roadmap:", error);
        toast.error("Failed to delete roadmap");
      }
    } else {
      // Fallback to localStorage for non-logged in users
      const updatedRoadmaps = roadmaps.filter(roadmap => roadmap.id !== id);
      setRoadmaps(updatedRoadmaps);
      
      // Update localStorage
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          parsedData.userRoadmaps = updatedRoadmaps;
          localStorage.setItem('userData', JSON.stringify(parsedData));
          toast.success("Roadmap deleted");
          
          // Refresh user data to update dashboard
          fetchUserData();
        } catch (error) {
          console.error("Failed to update localStorage:", error);
          toast.error("Failed to delete roadmap");
        }
      }
    }
  };
  
  useEffect(() => {
    fetchRoadmaps();
    
    // Set up realtime subscription for roadmap updates
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
            // When steps change, refetch the roadmaps
            fetchRoadmaps();
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);
  
  return {
    roadmaps,
    isRoadmapsLoading,
    handleProgressUpdate,
    handleDeleteRoadmap,
    fetchRoadmaps
  };
}
