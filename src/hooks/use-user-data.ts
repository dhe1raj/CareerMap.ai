
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { RoadmapStep, RoadmapTemplate } from '@/data/roadmapTemplates';

// Define types for our user data
export interface UserProfile {
  fullName: string;
  email: string;
  username?: string;
  bio?: string;
  user_role?: string;
  interests?: string[];
  isPublic?: boolean;
  enableNotifications?: boolean;
  avatarUrl?: string;
  age?: number;
  status?: 'Student' | 'Working' | 'Experienced' | 'Intern';
  degree?: string;
  stream?: string;
  goal?: 'job' | 'switch' | 'promotion' | 'startup';
}

export interface CareerData {
  progress: number;
  roadmap: string | null;
  suggestions: string[];
}

export interface ResumeData {
  fileURL: string | null;
  aiSummary: string | null;
  rawText?: string | null;
}

export interface ChatData {
  latestThreadId: string | null;
}

export interface UserRoadmap {
  id: string;
  title: string;
  steps: RoadmapStep[];
  lastUpdated: string;
}

export interface UserData {
  profile: UserProfile;
  career: CareerData;
  resume: ResumeData;
  chat: ChatData;
  userRoadmap?: UserRoadmap | null;
}

// Initial state
const initialUserData: UserData = {
  profile: {
    fullName: '',
    email: '',
    username: '',
    bio: '',
    user_role: '',
    interests: [],
    isPublic: false,
    enableNotifications: true,
    avatarUrl: null,
  },
  career: {
    progress: 0,
    roadmap: null,
    suggestions: [],
  },
  resume: {
    fileURL: null,
    aiSummary: null,
    rawText: null,
  },
  chat: {
    latestThreadId: null,
  },
  userRoadmap: null,
};

export function useUserData() {
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Function to fetch user data from Supabase
  const fetchUserData = useCallback(async () => {
    if (!user) {
      setUserData(initialUserData);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Fetch profile data from Supabase
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your profile data',
          variant: 'destructive'
        });
        return;
      }

      // Type assertion to handle the potentially missing properties
      // This is necessary because the TypeScript types don't match the actual database schema yet
      // The database now has these fields, but the TypeScript types don't reflect that
      setUserData(prev => ({
        ...prev,
        profile: {
          fullName: profile.full_name || '',
          email: profile.email || '',
          username: (profile as any).username || '',
          bio: (profile as any).bio || '',
          user_role: (profile as any).user_role || '',
          interests: (profile as any).interests || [],
          isPublic: (profile as any).is_public || false,
          enableNotifications: (profile as any).enable_notifications !== false, // default to true
          avatarUrl: profile.avatar_url || null,
          age: (profile as any).age || undefined,
          status: (profile as any).status || undefined,
          degree: (profile as any).degree || '',
          stream: (profile as any).stream || '',
          goal: (profile as any).goal || undefined,
        }
      }));

      // Get other user data from localStorage for now (we'll migrate these later)
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData(prev => ({
          ...prev,
          career: parsedData.career || prev.career,
          resume: parsedData.resume || prev.resume,
          chat: parsedData.chat || prev.chat,
          userRoadmap: parsedData.userRoadmap || null,
        }));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your profile data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  // Calculate career progress based on completed roadmap steps
  const calculateProgress = useCallback((userRoadmap: UserRoadmap | null) => {
    if (!userRoadmap || !userRoadmap.steps || userRoadmap.steps.length === 0) {
      return 0;
    }
    
    const completedSteps = userRoadmap.steps.filter(step => step.completed).length;
    return Math.round((completedSteps / userRoadmap.steps.length) * 100);
  }, []);

  // Function to save a specific field to Supabase
  const saveField = useCallback(async <T extends keyof UserData>(
    path: string,
    value: any
  ): Promise<void> => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to update your profile',
        variant: 'destructive'
      });
      return;
    }

    const pathParts = path.split('.');
    if (pathParts.length < 2) {
      console.error('Invalid field path', path);
      return;
    }

    const [section, field, subField] = pathParts as [keyof UserData, string, string?];
    
    // Special case for userRoadmap.steps to handle toggling step completion
    if (section === 'userRoadmap' && field === 'steps' && subField) {
      const stepIndex = parseInt(subField);
      if (!isNaN(stepIndex) && userData.userRoadmap && Array.isArray(userData.userRoadmap.steps)) {
        const updatedSteps = [...userData.userRoadmap.steps];
        updatedSteps[stepIndex] = { ...updatedSteps[stepIndex], ...value };
        
        const updatedRoadmap = {
          ...userData.userRoadmap,
          steps: updatedSteps,
          lastUpdated: new Date().toISOString()
        };
        
        setUserData(prev => ({
          ...prev,
          userRoadmap: updatedRoadmap,
          career: {
            ...prev.career,
            progress: calculateProgress(updatedRoadmap)
          }
        }));
        
        // Save to localStorage for now
        const storedData = localStorage.getItem('userData') || '{}';
        const parsedData = JSON.parse(storedData);
        localStorage.setItem('userData', JSON.stringify({
          ...parsedData,
          userRoadmap: updatedRoadmap,
          career: {
            ...parsedData.career,
            progress: calculateProgress(updatedRoadmap)
          }
        }));
        
        return;
      }
    } else if (section === 'userRoadmap' && field === 'reset') {
      // Handle roadmap reset
      if (userData.userRoadmap) {
        const resetSteps = userData.userRoadmap.steps.map(step => ({
          ...step,
          completed: false
        }));
        
        const updatedRoadmap = {
          ...userData.userRoadmap,
          steps: resetSteps,
          lastUpdated: new Date().toISOString()
        };
        
        setUserData(prev => ({
          ...prev,
          userRoadmap: updatedRoadmap,
          career: {
            ...prev.career,
            progress: 0
          }
        }));
        
        // Save to localStorage for now
        const storedData = localStorage.getItem('userData') || '{}';
        const parsedData = JSON.parse(storedData);
        localStorage.setItem('userData', JSON.stringify({
          ...parsedData,
          userRoadmap: updatedRoadmap,
          career: {
            ...parsedData.career,
            progress: 0
          }
        }));
        
        toast({
          title: 'Roadmap Reset',
          description: 'Your progress has been reset successfully',
        });
        
        return;
      }
    } else if (section === 'userRoadmap' && !field) {
      // Handle setting the entire roadmap
      setUserData(prev => ({
        ...prev,
        userRoadmap: value,
        career: {
          ...prev.career,
          progress: calculateProgress(value)
        }
      }));
      
      // Save to localStorage for now
      const storedData = localStorage.getItem('userData') || '{}';
      const parsedData = JSON.parse(storedData);
      localStorage.setItem('userData', JSON.stringify({
        ...parsedData,
        userRoadmap: value,
        career: {
          ...parsedData.career,
          progress: calculateProgress(value)
        }
      }));
      
      return;
    }
    
    setUserData(prev => {
      const newData = { 
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      };
      return newData;
    });

    try {
      if (section === 'profile') {
        // Map our profile fields to Supabase profile fields
        let profileUpdate: Record<string, any> = {};

        // Map field names to database column names
        switch (field) {
          case 'fullName':
            profileUpdate = { full_name: value };
            break;
          case 'avatarUrl':
            profileUpdate = { avatar_url: value };
            break;
          case 'isPublic':
            profileUpdate = { is_public: value };
            break;
          case 'enableNotifications':
            profileUpdate = { enable_notifications: value };
            break;
          case 'age':
            profileUpdate = { age: value };
            break;
          case 'status':
            profileUpdate = { status: value };
            break;
          case 'degree':
            profileUpdate = { degree: value };
            break;
          case 'stream':
            profileUpdate = { stream: value };
            break;
          case 'goal':
            profileUpdate = { goal: value };
            break;
          default:
            // For fields that have the same name in our app and database
            profileUpdate = { [field]: value };
        }

        // Save to Supabase
        const { error } = await supabase
          .from('profiles')
          .update(profileUpdate)
          .eq('id', user.id);

        if (error) {
          console.error('Error updating profile in Supabase:', error);
          toast({
            title: 'Error',
            description: 'Failed to save profile changes',
            variant: 'destructive'
          });
        }
      } else {
        // For non-profile data, save to localStorage for now
        const storedData = localStorage.getItem('userData') || '{}';
        const parsedData = JSON.parse(storedData);
        const updatedData = {
          ...parsedData,
          [section]: {
            ...parsedData[section],
            [field]: value
          }
        };
        localStorage.setItem('userData', JSON.stringify(updatedData));
      }
    } catch (error) {
      console.error('Error saving field:', error);
      toast({
        title: 'Error',
        description: 'Failed to save changes',
        variant: 'destructive'
      });
    }
  }, [user, toast, userData.userRoadmap, calculateProgress]);

  // Initialize data on mount
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    userData,
    isLoading,
    fetchUserData,
    saveField
  };
}
