
import { useState, useCallback } from 'react';
import { geminiGenerate } from '@/lib/gemini';
import { CareerMatch } from '@/components/career/CareerMatchCard';

export function useGeminiCareer() {
  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState<CareerMatch[]>([]);

  const generateCareerMatches = useCallback(async (skills: string[], interests: string[], education: string): Promise<CareerMatch[]> => {
    setIsLoading(true);
    
    try {
      // Format input for the prompt
      const skillsText = skills.length > 0 ? `Skills: ${skills.join(', ')}` : '';
      const interestsText = interests.length > 0 ? `Interests: ${interests.join(', ')}` : '';
      const educationText = education ? `Education: ${education}` : '';
      
      // Prepare prompt for Gemini
      const prompt = `
      I need personalized career recommendations based on the following information:
      
      ${skillsText}
      ${interestsText}
      ${educationText}
      
      Please suggest 6 career paths that match this profile. For each career, provide:
      1. Job title
      2. A brief description (1-2 sentences)
      3. A match percentage (between 60% and 95%)
      4. 3 bullet points highlighting key aspects of this career
      
      Return the response as a JSON array of objects with the following structure:
      [
        {
          "role": "Career Title",
          "short_desc": "Brief description of the career",
          "match_pct": 85,
          "bullets": ["Bullet point 1", "Bullet point 2", "Bullet point 3"]
        },
        // more career objects
      ]
      
      Only provide the JSON with no additional text.
      `;
      
      // Get response from Gemini
      const response = await geminiGenerate(prompt);
      
      // Extract JSON from the response (response might contain markdown code blocks)
      const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || 
                         response.match(/\[([\s\S]*)\]/);
      
      let parsedData: CareerMatch[] = [];
      
      if (jsonMatch && jsonMatch[1]) {
        // Try to parse the extracted JSON
        try {
          parsedData = JSON.parse(`[${jsonMatch[1]}]`.replace(/^\[+|\]+$/g, '[').replace(/\]\[/g, ',') + ']');
        } catch (error) {
          console.error("Error parsing JSON from Gemini response:", error);
          throw new Error("Failed to parse career matches data");
        }
      } else {
        // If no JSON found in code blocks, try parsing the whole response
        try {
          parsedData = JSON.parse(response);
        } catch (error) {
          console.error("Error parsing raw response as JSON:", error);
          throw new Error("Failed to parse career matches data");
        }
      }
      
      // Validate the data structure
      const validatedData = parsedData.map(item => ({
        role: item.role || "Unknown Career",
        short_desc: item.short_desc || "No description available",
        icon: item.icon || undefined,
        match_pct: typeof item.match_pct === 'number' ? item.match_pct : 75,
        bullets: Array.isArray(item.bullets) ? item.bullets : ["No details available"]
      }));
      
      setMatches(validatedData);
      return validatedData;
    } catch (error) {
      console.error("Error generating career matches:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateSuggestions = useCallback(async (userInput: string): Promise<CareerMatch[]> => {
    setIsLoading(true);
    
    try {
      // Prepare prompt for Gemini
      const prompt = `
      Based on this career-related query or description from a user:
      "${userInput}"
      
      Please suggest 4-6 career paths that might be relevant. For each career, provide:
      1. Job title
      2. A brief description (1-2 sentences)
      3. A match percentage (between 60% and 95%)
      4. 3 bullet points highlighting key aspects of this career
      
      Return the response as a JSON array of objects with the following structure:
      [
        {
          "role": "Career Title",
          "short_desc": "Brief description of the career",
          "match_pct": 85,
          "bullets": ["Bullet point 1", "Bullet point 2", "Bullet point 3"]
        },
        // more career objects
      ]
      
      Only provide the JSON with no additional text.
      `;
      
      // Get response from Gemini
      const response = await geminiGenerate(prompt);
      
      // Extract JSON from the response
      const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || 
                         response.match(/\[([\s\S]*)\]/);
      
      let parsedData: CareerMatch[] = [];
      
      if (jsonMatch && jsonMatch[1]) {
        try {
          parsedData = JSON.parse(`[${jsonMatch[1]}]`.replace(/^\[+|\]+$/g, '[').replace(/\]\[/g, ',') + ']');
        } catch (error) {
          console.error("Error parsing JSON from Gemini response:", error);
          throw new Error("Failed to parse career matches data");
        }
      } else {
        try {
          parsedData = JSON.parse(response);
        } catch (error) {
          console.error("Error parsing raw response as JSON:", error);
          throw new Error("Failed to parse career matches data");
        }
      }
      
      // Validate the data structure
      const validatedData = parsedData.map(item => ({
        role: item.role || "Unknown Career",
        short_desc: item.short_desc || "No description available",
        icon: item.icon || undefined,
        match_pct: typeof item.match_pct === 'number' ? item.match_pct : 75,
        bullets: Array.isArray(item.bullets) ? item.bullets : ["No details available"]
      }));
      
      setMatches(validatedData);
      return validatedData;
    } catch (error) {
      console.error("Error generating career suggestions:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeResume = useCallback(async (resumeText: string) => {
    setIsLoading(true);
    
    try {
      // Prepare prompt for Gemini
      const prompt = `
      Analyze this resume text and provide insights:
      
      ${resumeText}
      
      Please return a JSON object with the following structure:
      {
        "skills": ["skill1", "skill2", ...],
        "experience_level": "entry_level|mid_level|senior_level",
        "education_level": "high_school|associates|bachelors|masters|phd|none",
        "career_matches": [
          {
            "role": "Career Title",
            "short_desc": "Brief description of why this matches their background",
            "match_pct": 85,
            "bullets": ["Reason 1", "Reason 2", "Reason 3"]
          },
          // more career matches
        ],
        "improvement_suggestions": ["suggestion1", "suggestion2", ...]
      }
      
      Only provide the JSON with no additional text.
      `;
      
      // Get response from Gemini
      const response = await geminiGenerate(prompt);
      
      // Extract JSON from the response
      const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || 
                         response.match(/\{([\s\S]*)\}/);
      
      let parsedData;
      
      if (jsonMatch && jsonMatch[1]) {
        try {
          parsedData = JSON.parse(`{${jsonMatch[1]}}`.replace(/^\{+|\}+$/g, '{').replace(/\}\{/g, ',') + '}');
        } catch (error) {
          console.error("Error parsing JSON from Gemini response:", error);
          throw new Error("Failed to parse resume analysis data");
        }
      } else {
        try {
          parsedData = JSON.parse(response);
        } catch (error) {
          console.error("Error parsing raw response as JSON:", error);
          throw new Error("Failed to parse resume analysis data");
        }
      }
      
      // Update career matches state if present in the response
      if (parsedData.career_matches && Array.isArray(parsedData.career_matches)) {
        const validatedMatches = parsedData.career_matches.map((item: any) => ({
          role: item.role || "Unknown Career",
          short_desc: item.short_desc || "No description available",
          icon: item.icon || undefined,
          match_pct: typeof item.match_pct === 'number' ? item.match_pct : 75,
          bullets: Array.isArray(item.bullets) ? item.bullets : ["No details available"]
        }));
        
        setMatches(validatedMatches);
      }
      
      return parsedData;
    } catch (error) {
      console.error("Error analyzing resume:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    matches,
    generateCareerMatches,
    generateSuggestions,
    analyzeResume
  };
}
