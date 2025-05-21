
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface GeminiRoadmapStep {
  order: number;
  label: string;
  estTime: string;
}

export interface GeminiRoadmapResponse {
  steps: GeminiRoadmapStep[];
}

export const useGeminiRoadmap = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const personalizeRoadmap = useCallback(async (
    apiKey: string,
    profile: any,
    templateId: string,
    templateSteps: any[]
  ): Promise<GeminiRoadmapStep[] | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const prompt = `
        You are a career advisor AI. I need you to personalize a career roadmap for a user based on their profile.
        
        USER PROFILE:
        ${JSON.stringify(profile, null, 2)}
        
        TEMPLATE ROADMAP ID: ${templateId}
        
        TEMPLATE STEPS:
        ${JSON.stringify(templateSteps, null, 2)}
        
        Please analyze the user profile and the template roadmap, then:
        1. Add up to 3 additional personalized steps that would benefit this specific user
        2. Optionally reorder steps if it makes sense for this user's background and goals
        
        RESPOND ONLY with a JSON array of steps with the following format:
        [
          {
            "order": 1,
            "label": "Step description",
            "estTime": "Time estimate (e.g. '2 weeks')"
          }
        ]
      `;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to personalize roadmap');
      }
      
      const data = await response.json();
      const generatedText = data.candidates[0]?.content?.parts[0]?.text;
      
      if (!generatedText) {
        throw new Error('No response from AI');
      }
      
      // Extract JSON from the response
      try {
        const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error('No JSON found in response');
        
        const parsedSteps = JSON.parse(jsonMatch[0]) as GeminiRoadmapStep[];
        return parsedSteps;
      } catch (jsonError) {
        console.error('Error parsing AI response:', jsonError);
        throw new Error('Failed to parse AI response');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error(`AI Personalization failed: ${errorMessage}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return {
    personalizeRoadmap,
    isLoading,
    error
  };
};
