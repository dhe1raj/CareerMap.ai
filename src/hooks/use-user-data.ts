
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

// Define types for our user data
export interface UserProfile {
  fullName: string;
  email: string;
}

export interface CareerData {
  progress: number;
  roadmap: string | null;
  suggestions: string[];
}

export interface ResumeData {
  fileURL: string | null;
  aiSummary: string | null;
}

export interface ChatData {
  latestThreadId: string | null;
}

export interface UserData {
  profile: UserProfile;
  career: CareerData;
  resume: ResumeData;
  chat: ChatData;
}

// Initial state
const initialUserData: UserData = {
  profile: {
    fullName: '',
    email: '',
  },
  career: {
    progress: 0,
    roadmap: null,
    suggestions: [],
  },
  resume: {
    fileURL: null,
    aiSummary: null,
  },
  chat: {
    latestThreadId: null,
  },
};

export function useUserData() {
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Function to fetch user data from localStorage (simulating backend)
  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
      }
      
      // Get user info from auth context if available
      const userProfileStr = localStorage.getItem('userProfile');
      if (userProfileStr) {
        try {
          const userProfile = JSON.parse(userProfileStr);
          if (userProfile && userProfile.profile) {
            setUserData(prev => ({
              ...prev,
              profile: {
                ...prev.profile,
                fullName: userProfile.profile.roleStatus || '',
                email: userProfile.profile.email || '',
              }
            }));
          }
        } catch (error) {
          console.error('Error parsing user profile:', error);
        }
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
  }, [toast]);

  // Function to save a specific field
  const saveField = useCallback(<T extends keyof UserData>(
    path: string,
    value: any
  ): void => {
    const pathParts = path.split('.');
    if (pathParts.length !== 2) {
      console.error('Invalid field path', path);
      return;
    }

    const [section, field] = pathParts as [keyof UserData, string];
    
    setUserData(prev => {
      const newData = { 
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      };
      
      // Save to localStorage
      localStorage.setItem('userData', JSON.stringify(newData));
      return newData;
    });
  }, []);

  // Function to listen for changes (simulated)
  const listenForChanges = useCallback(() => {
    // In a real app, this would listen to a database or websocket
    // For now, we'll just re-fetch when localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userData') {
        fetchUserData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchUserData]);

  // Initialize data on mount
  useEffect(() => {
    fetchUserData();
    const cleanup = listenForChanges();
    return cleanup;
  }, [fetchUserData, listenForChanges]);

  return {
    userData,
    isLoading,
    fetchUserData,
    saveField
  };
}
