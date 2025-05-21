
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Roadmap, RoadmapProgress, RoadmapItem } from '@/types/roadmap';

// Define interfaces for Supabase table data shape
interface SupabaseRoadmap {
  id: string;
  title: string;
  type: 'role' | 'skill' | 'course';
  sections: RoadmapSection[];
  created_at: string;
  user_id: string;
  is_public: boolean;
  description?: string;
  updated_at?: string;
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
      const typedRoadmaps: Roadmap[] = roadmapsData?.map((item: any) => ({
        id: item.id,
        title: item.title,
        type: item.type || 'role', // Default type if not present
        sections: item.sections || [],
        created_at: item.created_at,
        user_id: item.user_id,
        is_public: item.is_public || false,
        description: item.description
      })) || [];

      // Use custom query to get progress since the table may not exist yet in the schema
      // We can create it later if needed
      let progressData: any[] = [];
      try {
        const { data, error } = await supabase
          .from('user_roadmap_progress')
          .select('*')
          .eq('user_id', user.id);
          
        if (!error) {
          progressData = data || [];
        }
      } catch (e) {
        console.warn('User roadmap progress table may not exist yet', e);
      }

      // Transform progress data into our expected type format
      const typedProgress: RoadmapProgress[] = progressData?.map((item: any) => ({
        id: item.id,
        roadmap_id: item.roadmap_id,
        user_id: item.user_id,
        progress_pct: item.progress_pct || 0,
        completed_items: item.completed_items || [],
        started_at: item.started_at,
        updated_at: item.updated_at
      })) || [];

      setRoadmaps(typedRoadmaps);
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

      // Transform the data to match our Roadmap type
      const roadmap: Roadmap = {
        id: data.id,
        title: data.title,
        type: data.type || 'role', // Default type if not present
        sections: data.sections || [],
        created_at: data.created_at,
        user_id: data.user_id,
        is_public: data.is_public || false,
        description: data.description
      };

      // Fetch progress for this roadmap if user is logged in
      let progress = null;
      if (user) {
        try {
          const { data: progressData, error: progressError } = await supabase
            .from('user_roadmap_progress')
            .select('*')
            .eq('roadmap_id', roadmapId)
            .eq('user_id', user.id)
            .maybeSingle(); // Using maybeSingle instead of single to avoid errors if no record is found

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
          console.warn('User roadmap progress table may not exist yet', e);
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
          type: roadmapWithIds.type,
          sections: roadmapWithIds.sections,
          user_id: roadmapWithIds.user_id,
          is_public: roadmapWithIds.is_public || false,
          description: roadmapWithIds.description
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Transform the response data to match our Roadmap type
      const createdRoadmap: Roadmap = {
        id: data.id,
        title: data.title,
        type: data.type,
        sections: data.sections,
        created_at: data.created_at,
        user_id: data.user_id,
        is_public: data.is_public,
        description: data.description
      };

      // Initialize progress tracking for this roadmap
      try {
        await supabase
          .from('user_roadmap_progress')
          .insert({
            roadmap_id: data.id,
            user_id: user.id,
            progress_pct: 0,
            completed_items: []
          });
      } catch (e) {
        console.warn('User roadmap progress table may not exist yet', e);
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
      // Get the current roadmap
      const { data: roadmapData, error: roadmapError } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('id', roadmapId)
        .single();

      if (roadmapError) {
        throw roadmapError;
      }

      let existingProgress;
      
      try {
        const { data, error } = await supabase
          .from('user_roadmap_progress')
          .select('*')
          .eq('roadmap_id', roadmapId)
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (!error) {
          existingProgress = data;
        }
      } catch (e) {
        console.warn('User roadmap progress table may not exist yet', e);
      }

      const roadmap = roadmapData;
      const sections = roadmap.sections || [];
      
      // Calculate total items count
      let totalItems = 0;
      sections.forEach((section: any) => {
        totalItems += section.items.length;
      });
      
      // Update completed items list
      let completedItems: string[] = existingProgress ? 
        (existingProgress.completed_items as string[] || []) : [];
      
      if (completed) {
        if (!completedItems.includes(itemId)) {
          completedItems.push(itemId);
        }
      } else {
        completedItems = completedItems.filter(id => id !== itemId);
      }
      
      // Calculate new progress percentage
      const progressPct = totalItems > 0 ? 
        (completedItems.length / totalItems) * 100 : 0;
      
      // Update or insert progress record
      try {
        if (existingProgress) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('user_roadmap_progress')
            .update({
              completed_items: completedItems,
              progress_pct: progressPct
            })
            .eq('id', existingProgress.id);
            
          if (updateError) {
            throw updateError;
          }
        } else {
          // Create new record
          const { error: insertError } = await supabase
            .from('user_roadmap_progress')
            .insert({
              roadmap_id: roadmapId,
              user_id: user.id,
              completed_items: completedItems,
              progress_pct: progressPct
            });
            
          if (insertError) {
            throw insertError;
          }
        }
      } catch (e) {
        console.warn('User roadmap progress table operation failed', e);
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
      
      // Return the updated progress
      return {
        completed_items: completedItems,
        progress_pct: progressPct
      };
    } catch (error: any) {
      console.error('Error updating item status:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to update progress',
        variant: 'destructive'
      });
    }
  }, [user, toast, selectedRoadmap]);

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
      // Check if progress record exists
      let progressExists = false;
      try {
        const { data, error } = await supabase
          .from('user_roadmap_progress')
          .select('id')
          .eq('roadmap_id', roadmapId)
          .eq('user_id', user.id)
          .maybeSingle();
          
        progressExists = !error && data !== null;
      } catch (e) {
        console.warn('User roadmap progress table may not exist yet', e);
      }
      
      if (progressExists) {
        const { error } = await supabase
          .from('user_roadmap_progress')
          .update({
            completed_items: [],
            progress_pct: 0
          })
          .eq('roadmap_id', roadmapId)
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }
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
  }, [user, toast, selectedRoadmap]);

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

      // Progress will be automatically deleted due to CASCADE constraint

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
