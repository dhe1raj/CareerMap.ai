
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useGeminiContext } from '@/context/GeminiContext';
import { UserData } from './use-user-data';

export function useGeminiCareer() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { apiKey } = useGeminiContext();
  
  const callGemini = useCallback(async (
    prompt: string,
    retryCount = 0,
    maxRetries = 2
  ): Promise<string | null> => {
    if (!apiKey) {
      toast({
        title: 'API Key Missing',
        description: 'Please add your Gemini API key in settings.',
        variant: 'destructive'
      });
      return null;
    }
    
    try {
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
      
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      
      if (retryCount < maxRetries) {
        toast({
          title: "AI busy, retrying...",
          description: `Attempt ${retryCount + 1} of ${maxRetries + 1}...`,
        });
        
        // Retry after a 2-second delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        return callGemini(prompt, retryCount + 1, maxRetries);
      } else {
        toast({
          title: "Error",
          description: "Failed to generate data after multiple attempts.",
          variant: "destructive"
        });
        return null;
      }
    }
  }, [apiKey, toast]);

  // Generate career suggestions based on user profile
  const generateSuggestions = useCallback(async (userData: UserData): Promise<string[]> => {
    setIsProcessing(true);
    
    try {
      const prompt = `User profile: ${JSON.stringify(userData.profile)}
Current progress: ${userData.career.progress}.
Return three best-fit career roles in an array, no prose.`;
      
      const result = await callGemini(prompt);
      
      if (!result) return [];
      
      // Parse the array from text response
      try {
        // First try to parse it as a direct JSON array
        let parsedResult: string[];
        
        if (result.trim().startsWith('[') && result.trim().endsWith(']')) {
          parsedResult = JSON.parse(result);
        } else {
          // Try to extract array if embedded in markdown or text
          const match = result.match(/\[(.*)\]/s);
          if (match && match[1]) {
            parsedResult = JSON.parse(`[${match[1]}]`);
          } else {
            // Fallback: split by lines and clean up
            parsedResult = result.split('\n')
              .map(line => line.replace(/^\d+\.\s*|^-\s*|^•\s*|"/g, '').trim())
              .filter(line => line.length > 0)
              .slice(0, 3);
          }
        }
        
        return parsedResult.slice(0, 3); // Ensure only 3 suggestions
      } catch (error) {
        console.error("Error parsing suggestions:", error);
        // Fallback: Just take the first three lines
        return result.split('\n')
          .map(line => line.replace(/^\d+\.\s*|^-\s*|^•\s*|"/g, '').trim())
          .filter(line => line.length > 0)
          .slice(0, 3);
      }
    } catch (error) {
      console.error("Error generating suggestions:", error);
      return [];
    } finally {
      setIsProcessing(false);
    }
  }, [callGemini]);

  // Analyze resume text and generate summary and skills
  const analyzeResume = useCallback(async (resumeText: string): Promise<{summary: string, suggestions: string[]}> => {
    setIsProcessing(true);
    
    try {
      const prompt = `You are a professional resume analyzer. Provide a concise, 120-word summary of this resume, followed by identifying the top 3 career roles that would be a good fit based on the resume. Format your response as: 
SUMMARY: [your 120-word summary]
ROLES: ["Role 1", "Role 2", "Role 3"]

Resume text:
${resumeText}`;
      
      const result = await callGemini(prompt);
      
      if (!result) return { summary: '', suggestions: [] };
      
      // Parse the response to extract summary and roles
      const summaryMatch = result.match(/SUMMARY:\s*([\s\S]*?)(?=ROLES:|$)/i);
      const rolesMatch = result.match(/ROLES:\s*(\[[\s\S]*?\])/i);
      
      let summary = '';
      let suggestions: string[] = [];
      
      if (summaryMatch && summaryMatch[1]) {
        summary = summaryMatch[1].trim();
      }
      
      if (rolesMatch && rolesMatch[1]) {
        try {
          suggestions = JSON.parse(rolesMatch[1]);
        } catch (error) {
          console.error("Error parsing roles:", error);
          // Extract any role-like text
          suggestions = rolesMatch[1]
            .split('\n')
            .map(line => line.replace(/^\d+\.\s*|^-\s*|^•\s*|"|^\[|^\]/g, '').trim())
            .filter(line => line.length > 0)
            .slice(0, 3);
        }
      }
      
      return { summary, suggestions };
    } catch (error) {
      console.error("Error analyzing resume:", error);
      return { summary: '', suggestions: [] };
    } finally {
      setIsProcessing(false);
    }
  }, [callGemini]);

  return {
    isProcessing,
    generateSuggestions,
    analyzeResume
  };
}
