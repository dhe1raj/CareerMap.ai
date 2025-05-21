
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Roadmap, RoadmapProgress, RoadmapItem } from '@/types/roadmap';

// Define interfaces for Supabase table data shape
interface SupabaseRoadmap {
  id: string;
  title: string;
  description?: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
  role_id?: string;
  type?: 'role' | 'skill' | 'course';
  sections?: RoadmapSection[];
  is_public?: boolean;
}

// Define the expected database structure for roadmap sections
interface RoadmapSection {
  title: string;
  items: RoadmapItem[];
  collapsed?: boolean;
}

interface SupabaseRoadmapProgress {
  id: string;
  roadmap_id: string;
  user_id: string;
  progress_pct: number;
  completed_items: string[];
  started_at: string;
  updated_at: string;
}

export function useRoadmaps() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [userProgress, setUserProgress] = useState<RoadmapProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Transform Supabase roadmap to application roadmap
  const transformRoadmap = (dbRoadmap: SupabaseRoadmap): Roadmap => {
    return {
      id: dbRoadmap.id,
      title: dbRoadmap.title,
      type: dbRoadmap.type || 'role', // Default type if not present
      sections: dbRoadmap.sections || [],
      created_at: dbRoadmap.created_at,
      user_id: dbRoadmap.user_id,
      is_public: dbRoadmap.is_public || false,
      description: dbRoadmap.description
    };
  };

  // Fetch all roadmaps accessible to the user (own + public)
  const fetchRoadmaps = useCallback(async () => {
    if (!user) {
      setRoadmaps([]);
      setUserProgress([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Fetch roadmaps - using the correct table name
      const { data: roadmapsData, error: roadmapsError } = await supabase
        .from('roadmaps')
        .select('*')
        .or(`user_id.eq.${user.id},is_public.eq.true`);

      if (roadmapsError) {
        throw roadmapsError;
      }

      // Transform database results into our expected type format
      const transformedRoadmaps: Roadmap[] = (roadmapsData || []).map((roadmap: SupabaseRoadmap) => 
        transformRoadmap(roadmap)
      );

      // Check if user_roadmap_progress table exists and fetch progress data
      let progressData: SupabaseRoadmapProgress[] = [];
      
      try {
        // Instead of directly querying the user_roadmap_progress table,
        // we'll check if the table exists first or use a different approach
        const { data: userProgressData, error: progressError } = await supabase
          .rpc('get_user_roadmap_progress', { user_id_param: user.id });
          
        if (!progressError && userProgressData) {
          progressData = userProgressData as SupabaseRoadmapProgress[];
        }
      } catch (e) {
        console.warn('User roadmap progress might not be available yet', e);
      }

      // Transform progress data into our expected type format
      const typedProgress: RoadmapProgress[] = (progressData || []).map((item) => ({
        id: item.id,
        roadmap_id: item.roadmap_id,
        user_id: item.user_id,
        progress_pct: item.progress_pct || 0,
        completed_items: item.completed_items || [],
        started_at: item.started_at,
        updated_at: item.updated_at
      }));

      setRoadmaps(transformedRoadmaps);
      setUserProgress(typedProgress);
    } catch (error: any) {
      console.error('Error fetching roadmaps:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to load roadmaps',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  // Get a single roadmap by ID
  const getRoadmap = useCallback(async (roadmapId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('id', roadmapId)
        .single();

      if (error) {
        throw error;
      }

      const roadmapData = data as SupabaseRoadmap;
      // Transform the data to match our Roadmap type
      const roadmap = transformRoadmap(roadmapData);

      // Fetch progress for this roadmap if user is logged in
      let progress = null;
      if (user) {
        try {
          // Use RPC function instead of direct query
          const { data: progressData, error: progressError } = await supabase
            .rpc('get_roadmap_progress', {
              roadmap_id_param: roadmapId,
              user_id_param: user.id
            });

          if (!progressError && progressData) {
            progress = {
              id: progressData.id,
              roadmap_id: progressData.roadmap_id,
              user_id: progressData.user_id,
              progress_pct: progressData.progress_pct || 0,
              completed_items: progressData.completed_items || [],
              started_at: progressData.started_at,
              updated_at: progressData.updated_at
            };
          }
        } catch (e) {
          console.warn('User roadmap progress might not be available yet', e);
        }
      }

      setSelectedRoadmap(roadmap);

      // If we have progress data, mark completed items
      if (progress && roadmap) {
        const completedItemIds = progress.completed_items as string[];
        
        // Update the roadmap sections with completed status
        const updatedSections = roadmap.sections.map(section => ({
          ...section,
          items: section.items.map(item => ({
            ...item,
            completed: completedItemIds.includes(item.id || '')
          }))
        }));

        const updatedRoadmap = {
          ...roadmap,
          sections: updatedSections
        };

        setSelectedRoadmap(updatedRoadmap);

        return {
          roadmap: updatedRoadmap,
          progress
        };
      }

      return { roadmap, progress };
    } catch (error: any) {
      console.error('Error fetching roadmap:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to load the roadmap',
        variant: 'destructive'
      });
      return { roadmap: null, progress: null };
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  // Create a new roadmap
  const createRoadmap = useCallback(async (roadmap: Roadmap) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a roadmap',
        variant: 'destructive'
      });
      return null;
    }

    try {
      // Add IDs to all items for tracking purposes
      const roadmapWithIds = {
        ...roadmap,
        user_id: user.id,
        sections: roadmap.sections.map(section => ({
          ...section,
          items: section.items.map(item => ({
            ...item,
            id: item.id || crypto.randomUUID()
          }))
        }))
      };

      // Create the roadmap in the database
      const { data, error } = await supabase
        .from('roadmaps')
        .insert({
          title: roadmapWithIds.title,
          user_id: roadmapWithIds.user_id,
          description: roadmapWithIds.description,
          type: roadmapWithIds.type,
          sections: roadmapWithIds.sections,
          is_public: roadmapWithIds.is_public || false
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Transform the response data to match our Roadmap type
      const createdRoadmap = transformRoadmap(data as SupabaseRoadmap);

      // Initialize progress tracking for this roadmap using RPC
      try {
        await supabase
          .rpc('initialize_roadmap_progress', {
            roadmap_id_param: data.id,
            user_id_param: user.id
          });
      } catch (e) {
        console.warn('Failed to initialize roadmap progress', e);
      }

      toast({
        title: 'Success',
        description: 'Roadmap created successfully',
      });

      // Refresh the roadmaps list
      fetchRoadmaps();
      return createdRoadmap;
    } catch (error: any) {
      console.error('Error creating roadmap:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to create roadmap',
        variant: 'destructive'
      });
      return null;
    }
  }, [user, toast, fetchRoadmaps]);

  // Update roadmap item completion status
  const updateItemStatus = useCallback(async (
    roadmapId: string, 
    itemId: string, 
    completed: boolean
  ) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to track progress',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Use an RPC function to update item status
      const { error } = await supabase
        .rpc('update_roadmap_item_status', {
          roadmap_id_param: roadmapId,
          user_id_param: user.id,
          item_id_param: itemId,
          completed_param: completed
        });
        
      if (error) {
        throw error;
      }
      
      // Update local state if the selected roadmap is the one being updated
      if (selectedRoadmap && selectedRoadmap.id === roadmapId) {
        const updatedSections = selectedRoadmap.sections.map(section => ({
          ...section,
          items: section.items.map(item => {
            if (item.id === itemId) {
              return { ...item, completed };
            }
            return item;
          })
        }));
        
        setSelectedRoadmap({
          ...selectedRoadmap,
          sections: updatedSections
        });
      }
      
      // Refresh the progress data
      fetchRoadmaps();
      
    } catch (error: any) {
      console.error('Error updating item status:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to update progress',
        variant: 'destructive'
      });
    }
  }, [user, toast, selectedRoadmap, fetchRoadmaps]);

  // Reset progress for a roadmap
  const resetProgress = useCallback(async (roadmapId: string) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to reset progress',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Use an RPC function to reset progress
      const { error } = await supabase
        .rpc('reset_roadmap_progress', {
          roadmap_id_param: roadmapId,
          user_id_param: user.id
        });
        
      if (error) {
        throw error;
      }

      // Update local state if the selected roadmap is the one being reset
      if (selectedRoadmap && selectedRoadmap.id === roadmapId) {
        const updatedSections = selectedRoadmap.sections.map(section => ({
          ...section,
          items: section.items.map(item => ({ ...item, completed: false }))
        }));
        
        setSelectedRoadmap({
          ...selectedRoadmap,
          sections: updatedSections
        });
      }

      // Refresh roadmaps to update progress
      fetchRoadmaps();

      toast({
        title: 'Success',
        description: 'Progress reset successfully',
      });
    } catch (error: any) {
      console.error('Error resetting progress:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to reset progress',
        variant: 'destructive'
      });
    }
  }, [user, toast, selectedRoadmap, fetchRoadmaps]);

  // Delete a roadmap
  const deleteRoadmap = useCallback(async (roadmapId: string) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to delete a roadmap',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('roadmaps')
        .delete()
        .eq('id', roadmapId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: 'Roadmap deleted successfully',
      });

      // Refresh the roadmaps list
      fetchRoadmaps();
    } catch (error: any) {
      console.error('Error deleting roadmap:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to delete roadmap',
        variant: 'destructive'
      });
    }
  }, [user, toast, fetchRoadmaps]);

  // Toggle public status of a roadmap
  const toggleRoadmapPublic = useCallback(async (roadmapId: string, isPublic: boolean) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to update a roadmap',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('roadmaps')
        .update({ is_public: isPublic })
        .eq('id', roadmapId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: `Roadmap is now ${isPublic ? 'public' : 'private'}`,
      });

      // Update local state if the selected roadmap is the one being updated
      if (selectedRoadmap && selectedRoadmap.id === roadmapId) {
        setSelectedRoadmap({
          ...selectedRoadmap,
          is_public: isPublic
        });
      }

      // Refresh the roadmaps list
      fetchRoadmaps();
    } catch (error: any) {
      console.error('Error updating roadmap visibility:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to update roadmap visibility',
        variant: 'destructive'
      });
    }
  }, [user, toast, fetchRoadmaps, selectedRoadmap]);

  // Initialize roadmaps on mount
  useEffect(() => {
    fetchRoadmaps();
  }, [fetchRoadmaps]);

  return {
    roadmaps,
    userProgress,
    isLoading,
    selectedRoadmap,
    fetchRoadmaps,
    getRoadmap,
    createRoadmap,
    updateItemStatus,
    resetProgress,
    deleteRoadmap,
    toggleRoadmapPublic
  };
}
