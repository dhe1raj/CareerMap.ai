
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useGemini } from "@/context/GeminiContext";

export interface CareerMatch {
  role: string;
  description: string;
  matchPercentage: number;
  skills: string[];
}

export function useGeminiCareer() {
  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState<CareerMatch[]>([]);
  const { toast } = useToast();
  const { geminiClient, apiKey } = useGemini();

  const generateCareerMatches = async (
    skills: string[],
    interests: string[], 
    education: string
  ) => {
    if (!apiKey || !geminiClient) {
      toast({
        title: "API Key Required",
        description: "Please add a Gemini API key in settings to use this feature.",
        variant: "destructive"
      });
      return [];
    }
    
    setIsLoading(true);
    
    try {
      // Implementation using geminiClient would go here
      // For now, returning mock data
      const mockMatches: CareerMatch[] = [
        {
          role: "Frontend Developer",
          description: "Focuses on user interfaces and experience",
          matchPercentage: 87,
          skills: ["HTML", "CSS", "JavaScript", "React"]
        },
        {
          role: "Data Analyst",
          description: "Works with data to extract insights",
          matchPercentage: 75,
          skills: ["SQL", "Python", "Data Visualization", "Statistics"]
        }
      ];
      
      setMatches(mockMatches);
      return mockMatches;
    } catch (error) {
      console.error("Error generating career matches:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate career matches. Please try again.",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    matches,
    generateCareerMatches
  };
}
