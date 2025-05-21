
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useGemini } from '@/context/GeminiContext';
import { Roadmap, RoadmapFormData } from '@/types/roadmap';

export function useGenerateRoadmap() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState<Roadmap | null>(null);
  const { toast } = useToast();
  const { geminiClient } = useGemini();

  const generateRoadmap = async (formData: RoadmapFormData): Promise<Roadmap | null> => {
    if (!geminiClient) {
      toast({
        title: 'API Key Missing',
        description: 'Please add your Gemini API key in settings to use this feature.',
        variant: 'destructive'
      });
      return null;
    }

    setIsGenerating(true);
    try {
      const systemPrompt = `
You are a career roadmap expert. Your task is to generate a detailed roadmap for a specific role or skill.
Structure the roadmap with clear sections (like basics, tools, projects, advanced) and list key skills.
Each item should include a helpful tooltip and a resource link.
Output ONLY properly formatted JSON with the following structure:
{
  "title": "Title of the Roadmap",
  "type": "role" or "skill",
  "sections": [
    {
      "title": "Section Name",
      "items": [
        {
          "label": "Name of skill or tool",
          "tooltip": "Short description or tip",
          "link": "URL to helpful resource"
        }
      ]
    }
  ]
}
`;

      const userPrompt = `
Generate a structured roadmap for a ${formData.role} role for a ${formData.studentType}.
${formData.studentType === 'student' && formData.collegeTier ? `College tier: ${formData.collegeTier}` : ''}
${formData.studentType === 'student' && formData.degree ? `Degree: ${formData.degree}` : ''}
${formData.knownSkills ? `Known skills: ${formData.knownSkills}` : ''}
Learning preference: ${formData.learningPreference}

Create a comprehensive step-by-step roadmap with at least 4 sections (Basics, Tools, Projects, Advanced) and at least 5 items per section.
Provide helpful tooltips and relevant resource links for each item.
Make sure the roadmap is specific and actionable.
`;

      // Mock implementation for API response during development
      try {
        let responseText;
        
        if (geminiClient.generateContent) {
          const response = await geminiClient.generateContent([systemPrompt, userPrompt]);
          responseText = response.response.text();
        } else {
          // Fallback mock response for testing
          responseText = JSON.stringify({
            title: `${formData.role} Roadmap`,
            type: "role",
            sections: [
              {
                title: "Fundamentals",
                items: [
                  {
                    label: "Sample Skill 1",
                    tooltip: "Description of skill 1",
                    link: "https://example.com/skill1"
                  }
                ]
              }
            ]
          });
        }
        
        // Extract JSON from response if needed
        const jsonMatch = responseText.match(/```json([\s\S]*?)```/) || 
                          responseText.match(/```([\s\S]*?)```/) || 
                          [null, responseText];
        
        let jsonStr = jsonMatch[1] || responseText;
        
        // Clean up any leading/trailing non-JSON content
        jsonStr = jsonStr.trim();
        if (jsonStr.indexOf('{') > 0) {
          jsonStr = jsonStr.substring(jsonStr.indexOf('{'));
        }
        
        const parsedRoadmap = JSON.parse(jsonStr) as Roadmap;
        setGeneratedRoadmap(parsedRoadmap);
        
        toast({
          title: 'Roadmap Generated',
          description: 'Your AI roadmap has been successfully created.',
        });
        
        return parsedRoadmap;
      } catch (error: any) {
        console.error('Error generating roadmap:', error);
        toast({
          title: 'Generation Failed',
          description: 'Failed to generate roadmap. Please try again.',
          variant: 'destructive'
        });
        return null;
      }
    } catch (error: any) {
      console.error('Error generating roadmap:', error);
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate roadmap. Please try again.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const resetGeneratedRoadmap = () => {
    setGeneratedRoadmap(null);
  };

  return {
    isGenerating,
    generatedRoadmap,
    generateRoadmap,
    resetGeneratedRoadmap
  };
}
