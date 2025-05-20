
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { roadmapTemplates, RoadmapTemplate, RoadmapStep } from '@/data/roadmapTemplates';
import { useGemini } from '@/lib/gemini';
import { GeneratedRoadmap } from '@/components/career/CareerDesignWizard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface UserRoadmap extends RoadmapTemplate {
  lastUpdated: string;
  category?: string;
  icon?: string;
}

interface UseRoadmapReturn {
  userRoadmap: UserRoadmap | null;
  loadingRoadmap: boolean;
  roadmapProgress: number;
  selectRoadmap: (templateId: string, userProfile?: any) => Promise<void>;
  updateRoadmapStep: (stepOrder: number, completed: boolean) => void;
  resetRoadmap: () => void;
  personalizeWithAI: (userProfile: any) => Promise<boolean>;
  saveCustomRoadmap?: (customRoadmap: GeneratedRoadmap) => Promise<void>;
}

export function useRoadmap(apiKey: string): UseRoadmapReturn {
  const [userRoadmap, setUserRoadmap] = useState<UserRoadmap | null>(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState<boolean>(false);
  const [roadmapProgress, setRoadmapProgress] = useState<number>(0);
  const { toast } = useToast();
  const { callGemini } = useGemini();
  const { user } = useAuth();

  // Calculate progress whenever roadmap changes
  useEffect(() => {
    if (!userRoadmap || userRoadmap.steps.length === 0) {
      setRoadmapProgress(0);
      return;
    }

    const completedSteps = userRoadmap.steps.filter(step => step.completed).length;
    const progressPercentage = Math.round((completedSteps / userRoadmap.steps.length) * 100);
    setRoadmapProgress(progressPercentage);
  }, [userRoadmap]);

  // Load existing roadmap from localStorage on mount
  useEffect(() => {
    const savedRoadmap = localStorage.getItem('userRoadmap');
    if (savedRoadmap) {
      try {
        const parsedRoadmap = JSON.parse(savedRoadmap);
        setUserRoadmap(parsedRoadmap);
      } catch (error) {
        console.error('Failed to parse saved roadmap:', error);
      }
    }
  }, []);

  // Save roadmap to localStorage whenever it changes
  useEffect(() => {
    if (userRoadmap) {
      localStorage.setItem('userRoadmap', JSON.stringify(userRoadmap));
    }
  }, [userRoadmap]);

  // Save roadmap to the database
  const saveRoadmapToDatabase = useCallback(async (roadmap: UserRoadmap) => {
    if (!user) return;

    try {
      // First, create the roadmap entry
      const { data: roadmapData, error: roadmapError } = await supabase
        .from('user_roadmaps')
        .insert({
          user_id: user.id,
          title: roadmap.title,
          category: roadmap.category || 'custom',
          icon: roadmap.icon || 'sparkles',
          is_custom: true
        })
        .select('id')
        .single();

      if (roadmapError) {
        throw new Error(`Failed to save roadmap: ${roadmapError.message}`);
      }

      if (!roadmapData) {
        throw new Error('Failed to retrieve the created roadmap ID');
      }

      // Then, insert all steps for this roadmap
      const stepsToInsert = roadmap.steps.map((step, index) => ({
        roadmap_id: roadmapData.id,
        label: step.label,
        order_number: step.order,
        completed: step.completed || false,
        est_time: step.estTime
      }));

      const { error: stepsError } = await supabase
        .from('user_roadmap_steps')
        .insert(stepsToInsert);

      if (stepsError) {
        throw new Error(`Failed to save roadmap steps: ${stepsError.message}`);
      }

      return roadmapData.id;
    } catch (error) {
      console.error('Error saving roadmap to database:', error);
      throw error;
    }
  }, [user]);

  // Load roadmap from database
  const loadRoadmapFromDatabase = useCallback(async (roadmapId: string) => {
    if (!user) return null;

    try {
      // First, get the roadmap details
      const { data: roadmapData, error: roadmapError } = await supabase
        .from('user_roadmaps')
        .select('*')
        .eq('id', roadmapId)
        .single();

      if (roadmapError) {
        throw new Error(`Failed to load roadmap: ${roadmapError.message}`);
      }

      // Then, get all steps for this roadmap
      const { data: stepsData, error: stepsError } = await supabase
        .from('user_roadmap_steps')
        .select('*')
        .eq('roadmap_id', roadmapId)
        .order('order_number', { ascending: true });

      if (stepsError) {
        throw new Error(`Failed to load roadmap steps: ${stepsError.message}`);
      }

      // Transform to our UserRoadmap format
      const formattedRoadmap: UserRoadmap = {
        id: roadmapData.id,
        title: roadmapData.title,
        category: roadmapData.category,
        icon: roadmapData.icon,
        steps: stepsData.map(step => ({
          order: step.order_number,
          label: step.label,
          estTime: step.est_time || '',
          completed: step.completed
        })),
        lastUpdated: roadmapData.updated_at
      };

      return formattedRoadmap;
    } catch (error) {
      console.error('Error loading roadmap from database:', error);
      return null;
    }
  }, [user]);

  const selectRoadmap = useCallback(async (templateId: string, userProfile?: any) => {
    setLoadingRoadmap(true);

    try {
      const template = roadmapTemplates.find(t => t.id === templateId);
      
      if (!template) {
        throw new Error(`Roadmap template with ID ${templateId} not found`);
      }
      
      // Create a new user roadmap from the template
      const newRoadmap: UserRoadmap = {
        ...template,
        steps: template.steps.map(step => ({ ...step, completed: false })),
        lastUpdated: new Date().toISOString(),
        category: template.id.includes('data') ? 'data' : 
                 template.id.includes('web') ? 'web' : 
                 template.id.includes('mobile') ? 'mobile' : 'general',
        icon: 'sparkles'
      };
      
      setUserRoadmap(newRoadmap);
      
      // If user is authenticated, save to database
      if (user) {
        await saveRoadmapToDatabase(newRoadmap);
      }
      
      toast({
        title: "Roadmap Selected",
        description: `${template.title} roadmap has been selected.`,
      });
      
      return;
    } catch (error) {
      console.error('Error selecting roadmap:', error);
      toast({
        title: "Error",
        description: `Failed to select roadmap: ${(error as Error).message}`,
        variant: "destructive"
      });
    } finally {
      setLoadingRoadmap(false);
    }
  }, [toast, user, saveRoadmapToDatabase]);

  const updateRoadmapStep = useCallback((stepOrder: number, completed: boolean) => {
    if (!userRoadmap) return;

    setUserRoadmap(prev => {
      if (!prev) return null;

      const updatedSteps = prev.steps.map(step => 
        step.order === stepOrder ? { ...step, completed } : step
      );

      return {
        ...prev,
        steps: updatedSteps,
        lastUpdated: new Date().toISOString()
      };
    });
  }, [userRoadmap]);

  const resetRoadmap = useCallback(() => {
    if (!userRoadmap) return;

    const resetSteps = userRoadmap.steps.map(step => ({ ...step, completed: false }));
    
    setUserRoadmap({
      ...userRoadmap,
      steps: resetSteps,
      lastUpdated: new Date().toISOString()
    });

    toast({
      title: "Roadmap Reset",
      description: "All progress has been reset."
    });
  }, [userRoadmap, toast]);

  const personalizeWithAI = useCallback(async (userProfile: any): Promise<boolean> => {
    if (!userRoadmap || !apiKey) return false;
    
    setLoadingRoadmap(true);
    
    try {
      const promptText = `
I have a career roadmap for ${userRoadmap.title} with the following steps:
${userRoadmap.steps.map(s => `${s.order}. ${s.label} (${s.estTime})`).join('\n')}

Here is my profile:
${JSON.stringify(userProfile, null, 2)}

Based on my profile, please provide 2-3 additional steps that would be valuable for my specific situation.
Format the response as a JSON array of steps with this structure:
[
  { "order": number, "label": "step description", "estTime": "time estimate" }
]

Only include the JSON array in your response, nothing else.
`;

      const aiResponse = await callGemini(promptText, apiKey);
      
      if (!aiResponse) {
        throw new Error("Failed to get AI response");
      }

      // Extract JSON from the response
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("Could not extract JSON from AI response");
      }

      // Parse the JSON array
      const additionalSteps = JSON.parse(jsonMatch[0]) as RoadmapStep[];
      
      if (!Array.isArray(additionalSteps) || additionalSteps.length === 0) {
        throw new Error("Invalid or empty steps from AI");
      }
      
      // Assign correct order to new steps
      const maxOrder = Math.max(...userRoadmap.steps.map(s => s.order));
      const newSteps = additionalSteps.map((step, index) => ({
        ...step,
        order: maxOrder + index + 1,
        completed: false
      }));
      
      // Add the new steps to the roadmap
      setUserRoadmap(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          steps: [...prev.steps, ...newSteps],
          lastUpdated: new Date().toISOString()
        };
      });
      
      toast({
        title: "Roadmap Personalized",
        description: `Added ${newSteps.length} custom steps to your roadmap.`
      });
      
      return true;
    } catch (error) {
      console.error('Error personalizing roadmap with AI:', error);
      toast({
        title: "Personalization Failed",
        description: `Could not personalize roadmap: ${(error as Error).message}`,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoadingRoadmap(false);
    }
  }, [userRoadmap, apiKey, callGemini, toast]);

  // Function to save a custom roadmap
  const saveCustomRoadmap = useCallback(async (customRoadmap: GeneratedRoadmap): Promise<void> => {
    setLoadingRoadmap(true);
    
    try {
      // Convert the generated roadmap to the UserRoadmap format
      const newRoadmap: UserRoadmap = {
        id: `custom-${Date.now()}`,
        title: customRoadmap.title,
        category: 'custom', 
        icon: 'sparkles',
        steps: customRoadmap.steps.map(step => ({
          ...step,
          completed: step.completed || false
        })),
        lastUpdated: new Date().toISOString()
      };
      
      setUserRoadmap(newRoadmap);
      
      // If user is authenticated, save to database
      if (user) {
        await saveRoadmapToDatabase(newRoadmap);
      }
      
      toast({
        title: "Custom Roadmap Created",
        description: "Your personalized career roadmap has been created.",
      });
    } catch (error) {
      console.error('Error saving custom roadmap:', error);
      toast({
        title: "Error",
        description: `Failed to save custom roadmap: ${(error as Error).message}`,
        variant: "destructive"
      });
    } finally {
      setLoadingRoadmap(false);
    }
  }, [toast, user, saveRoadmapToDatabase]);

  return {
    userRoadmap,
    loadingRoadmap,
    roadmapProgress,
    selectRoadmap,
    updateRoadmapStep,
    resetRoadmap,
    personalizeWithAI,
    saveCustomRoadmap
  };
}
