
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { RoadmapStep } from '@/data/roadmapTemplates';

// Additional types for roadmap personalization
export interface GeminiRoadmapStep {
  order: number;
  label: string;
  estTime: string;
}

export function useGeminiRoadmap() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const personalizeRoadmap = async (
    apiKey: string,
    userProfile: any,
    templateId: string,
    baseSteps: RoadmapStep[]
  ): Promise<GeminiRoadmapStep[] | null> => {
    setIsLoading(true);
    
    try {
      const prompt = `You are an AI career coach. Based on this user's profile:
${JSON.stringify(userProfile, null, 2)}

I want you to personalize this roadmap template for ${templateId}:
${JSON.stringify(baseSteps, null, 2)}

1. Review the existing steps
2. Add up to 3 additional steps that would be specifically valuable for this user based on their profile
3. Reorder steps if necessary for better learning progression
4. Return ONLY a JSON array of steps in this exact format (no explanation, just the array):
[
  { "order": 1, "label": "Step description here", "estTime": "X weeks" },
  ...more steps...
]`;

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.candidates || 
          !data.candidates[0] || 
          !data.candidates[0].content || 
          !data.candidates[0].content.parts || 
          !data.candidates[0].content.parts[0].text) {
        throw new Error("Invalid response format from Gemini API");
      }
      
      const responseText = data.candidates[0].content.parts[0].text;
      
      // Try to parse the JSON response
      try {
        // Find JSON array in the response
        const match = responseText.match(/\[\s*\{.*\}\s*\]/s);
        if (match) {
          const jsonStr = match[0];
          const steps = JSON.parse(jsonStr) as GeminiRoadmapStep[];
          return steps;
        } else {
          throw new Error("Could not find JSON array in response");
        }
      } catch (parseError) {
        console.error("Error parsing Gemini response:", parseError);
        throw new Error("Failed to parse personalized roadmap");
      }
    } catch (error) {
      console.error("Error personalizing roadmap:", error);
      toast({
        title: "Personalization Failed",
        description: "Could not personalize your roadmap. Using standard template instead.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    personalizeRoadmap,
    isLoading
  };
}
