
import { useToast } from "@/hooks/use-toast";

interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
  }>;
  promptFeedback?: any;
}

interface GeminiRequestBody {
  contents: Array<{
    parts: Array<{
      text: string;
    }>;
  }>;
}

export async function askGemini(promptText: string, apiKey: string, modelName: string = "gemini-2.0-flash"): Promise<string> {
  try {
    const requestBody: GeminiRequestBody = {
      contents: [
        {
          parts: [
            {
              text: promptText,
            },
          ],
        },
      ],
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${errorText}`);
    }

    const data: GeminiResponse = await response.json();

    // Check if we have a valid response with text content
    if (
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content?.parts &&
      data.candidates[0].content.parts.length > 0
    ) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("No valid response from Gemini API");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

// Custom hook to use Gemini API
export function useGemini() {
  const { toast } = useToast();
  
  const callGemini = async (
    promptText: string, 
    apiKey: string, 
    modelName: string = "gemini-2.0-flash"
  ): Promise<string | null> => {
    try {
      const response = await askGemini(promptText, apiKey, modelName);
      return response;
    } catch (error) {
      console.error("Error in useGemini:", error);
      toast({
        title: "API Error",
        description: `Failed to get response from Gemini: ${(error as Error).message}`,
        variant: "destructive"
      });
      return null;
    }
  };
  
  return { callGemini };
}
