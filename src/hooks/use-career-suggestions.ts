
import { useEffect } from "react";
import { useGeminiCareer } from "@/hooks/use-gemini-career";
import { UserData } from "@/hooks/use-user-data";

export function useCareerSuggestions(
  userData: UserData, 
  isLoadingSuggestions: boolean = false,
  onUpdateField: (path: string, value: any) => void
) {
  const { generateSuggestions, isProcessing } = useGeminiCareer();
  
  useEffect(() => {
    // Generate suggestions if none exist
    const fetchSuggestions = async () => {
      if (userData.career.suggestions.length === 0 && !isProcessing && !isLoadingSuggestions) {
        const suggestions = await generateSuggestions(userData);
        if (suggestions.length > 0) {
          onUpdateField('career.suggestions', suggestions);
        }
      }
    };
    
    fetchSuggestions();
  }, [userData, generateSuggestions, onUpdateField, isProcessing, isLoadingSuggestions]);
  
  return {
    suggestions: userData.career.suggestions,
    isProcessingSuggestions: isProcessing || isLoadingSuggestions
  };
}
