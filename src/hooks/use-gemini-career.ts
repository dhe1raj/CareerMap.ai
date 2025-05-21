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
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 2048,
          }
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
  
  // Generate GenZ career roadmap
  const generateGenZRoadmap = useCallback(async (role: string): Promise<any> => {
    setIsProcessing(true);
    
    try {
      const prompt = `Generate a detailed roadmap in JSON format for a GenZ student in 1st year CSE at GITAM University who wants to become a ${role}. 
Divide into sections like basics, tools, projects. Include tooltip and one resource link per item.
Format your response as a structured JSON like this exact format without any explanation or markdown:
{
  "title": "${role}",
  "sections": [
    {
      "title": "Basics",
      "items": [
        {
          "label": "Python",
          "tooltip": "Learn syntax and loops",
          "link": "https://..."
        }
      ]
    }
  ]
}`;

      const result = await callGemini(prompt);
      
      if (!result) return null;
      
      // Parse the JSON response
      try {
        // Find JSON object in response
        const match = result.match(/\{[\s\S]*\}/);
        if (match) {
          const jsonStr = match[0];
          const roadmap = JSON.parse(jsonStr);
          return roadmap;
        } else {
          throw new Error("Could not find JSON object in response");
        }
      } catch (parseError) {
        console.error("Error parsing GenZ roadmap:", parseError);
        throw new Error("Failed to generate career roadmap");
      }
    } catch (error) {
      console.error("Error generating GenZ roadmap:", error);
      toast({
        title: "Failed to Generate Roadmap",
        description: "There was an error creating your career roadmap. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [callGemini, toast]);

  // Generate career roadmap based on selected career path
  const generateCareerRoadmap = useCallback(async (careerPath: string, userInterests: string[]): Promise<any> => {
    setIsProcessing(true);
    
    try {
      const prompt = `Create a detailed career roadmap for someone interested in becoming a ${careerPath}.
Their main interests are: ${userInterests.join(', ')}.

Format your response as a detailed JSON object with the following structure (with no explanation, just the JSON):
{
  "title": "${careerPath} Career Path",
  "overview": "A concise overview of this career path...",
  "salary": {
    "entry": "Entry-level salary range",
    "mid": "Mid-level salary range",
    "senior": "Senior-level salary range"
  },
  "workLifeBalance": {
    "stress": "Low/Medium/High",
    "workHours": "Typical work hours",
    "flexibility": "Description of flexibility"
  },
  "growthPotential": "Description of growth potential and advancement",
  "steps": [
    {
      "title": "Step 1 Title",
      "description": "Description of this step",
      "items": ["Item 1", "Item 2", "Item 3"],
      "timeframe": "Estimated timeframe"
    },
    ... more steps (5-7 total)
  ],
  "recommendedCompanies": ["Company 1", "Company 2", "Company 3", "Company 4", "Company 5"],
  "jobPlatforms": ["Platform 1", "Platform 2", "Platform 3"]
}`;
      
      const result = await callGemini(prompt);
      
      if (!result) return null;
      
      // Parse the JSON response
      try {
        // Find JSON object in response
        const match = result.match(/\{[\s\S]*\}/);
        if (match) {
          const jsonStr = match[0];
          const roadmap = JSON.parse(jsonStr);
          
          // Store in localStorage for now (will move to database later)
          localStorage.setItem("careerRoadmap", JSON.stringify(roadmap));
          
          return roadmap;
        } else {
          throw new Error("Could not find JSON object in response");
        }
      } catch (parseError) {
        console.error("Error parsing career roadmap:", parseError);
        throw new Error("Failed to generate career roadmap");
      }
    } catch (error) {
      console.error("Error generating career roadmap:", error);
      toast({
        title: "Failed to Generate Roadmap",
        description: "There was an error creating your career roadmap. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [callGemini, toast]);

  // Generate learning resources for a career path
  const generateLearningResources = useCallback(async (careerPath: string, skills: string[]): Promise<any> => {
    setIsProcessing(true);
    
    try {
      const prompt = `Generate a comprehensive list of learning resources for someone pursuing a career as a ${careerPath}.
They want to focus on developing these skills: ${skills.join(', ')}.

Format your response as a JSON array with the following structure (no explanation, just the JSON):
[
  {
    "title": "Resource title",
    "description": "Brief description of what this resource offers",
    "type": "course/book/tool/video/article",
    "skillCategory": "frontend/backend/design/ai/data/soft/other",
    "url": "https://example.com/resource",
    "skillName": "Specific skill this resource helps develop"
  },
  ... more resources (at least 15 total)
]`;
      
      const result = await callGemini(prompt);
      
      if (!result) return null;
      
      // Parse the JSON response
      try {
        // Find JSON array in response
        const match = result.match(/\[[\s\S]*\]/);
        if (match) {
          const jsonStr = match[0];
          const resources = JSON.parse(jsonStr);
          
          return resources;
        } else {
          throw new Error("Could not find JSON array in response");
        }
      } catch (parseError) {
        console.error("Error parsing learning resources:", parseError);
        throw new Error("Failed to generate learning resources");
      }
    } catch (error) {
      console.error("Error generating learning resources:", error);
      toast({
        title: "Failed to Generate Resources",
        description: "There was an error creating your learning resources. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [callGemini, toast]);

  return {
    isProcessing,
    generateSuggestions,
    analyzeResume,
    generateCareerRoadmap,
    generateLearningResources,
    generateGenZRoadmap
  };
}
