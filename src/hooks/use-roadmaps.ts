
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Roadmap, RoadmapProgress, RoadmapItem } from '@/types/roadmap';
import { supabaseRpc, SupabaseRoadmapProgress } from '@/utils/supabase-rpc-helpers';

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

      // Transform database results to proper Roadmap type
      const transformedRoadmaps: Roadmap[] = (roadmapsData || []).map((roadmap) => {
        return {
          id: roadmap.id,
          title: roadmap.title,
          type: roadmap.type || 'role', // Default value
          sections: roadmap.sections || [], // Default empty array
          created_at: roadmap.created_at,
          user_id: roadmap.user_id,
          is_public: roadmap.is_public || false, // Default value
          description: roadmap.description
        };
      });

      // Fetch progress data using our helper
      let progressData: SupabaseRoadmapProgress[] = [];
      try {
        progressData = await supabaseRpc.getUserRoadmapProgress(user.id);
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

      // Create a roadmap with default values for missing fields
      const roadmap: Roadmap = {
        id: data.id,
        title: data.title,
        type: data.type || 'role', // Default value
        sections: data.sections || [], // Default empty array
        created_at: data.created_at,
        user_id: data.user_id,
        is_public: data.is_public || false, // Default value
        description: data.description
      };

      // Fetch progress for this roadmap if user is logged in
      let progress: RoadmapProgress | null = null;
      if (user) {
        try {
          // Use our helper
          const progressData = await supabaseRpc.getRoadmapProgress(roadmapId, user.id);
          
          if (progressData) {
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

      // Create the roadmap in the database - only including valid fields
      const { data, error } = await supabase
        .from('roadmaps')
        .insert({
          title: roadmapWithIds.title,
          user_id: roadmapWithIds.user_id,
          description: roadmapWithIds.description,
          role_id: null, // Use null when not provided
          sections: roadmapWithIds.sections, // Include sections in the insert
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Create a roadmap with the returned data plus default values
      const createdRoadmap: Roadmap = {
        id: data.id,
        title: data.title,
        type: 'role', // Default value
        sections: roadmapWithIds.sections, // Use the sections from input
        created_at: data.created_at,
        user_id: data.user_id,
        is_public: false, // Default value
        description: data.description
      };

      // Initialize progress tracking for this roadmap
      try {
        await supabaseRpc.initializeRoadmapProgress(data.id, user.id);
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
      // Use our helper
      const result = await supabaseRpc.updateRoadmapItemStatus(roadmapId, user.id, itemId, completed);
      
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
      
      return result;
    } catch (error: any) {
      console.error('Error updating item status:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to update progress',
        variant: 'destructive'
      });
      return null;
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
      // Use our helper
      await supabaseRpc.resetRoadmapProgress(roadmapId, user.id);

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
      // Update the roadmap with is_public field
      const { error } = await supabase
        .from('roadmaps')
        .update({ 
          is_public: isPublic
        })
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
