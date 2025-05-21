
import { createContext, useContext, useState, ReactNode } from "react";

interface GeminiContextType {
  apiKey: string;
  modelName: string;
  setApiKey: (key: string) => void;
  setModelName: (model: string) => void;
}

// Default API key provided by the developer
const DEFAULT_API_KEY = "AIzaSyDyQdvgf5_-VztpZIdyhRNiTFE94o2fSf4";

const GeminiContext = createContext<GeminiContextType | undefined>(undefined);

export function GeminiProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState<string>(localStorage.getItem("gemini_api_key") || DEFAULT_API_KEY);
  const [modelName, setModelName] = useState<string>(localStorage.getItem("gemini_model_name") || "gemini-2.0-flash");

  const handleSetApiKey = (key: string) => {
    localStorage.setItem("gemini_api_key", key);
    setApiKey(key);
  };

  const handleSetModelName = (model: string) => {
    localStorage.setItem("gemini_model_name", model);
    setModelName(model);
  };

  return (
    <GeminiContext.Provider 
      value={{ 
        apiKey, 
        modelName, 
        setApiKey: handleSetApiKey,
        setModelName: handleSetModelName 
      }}
    >
      {children}
    </GeminiContext.Provider>
  );
}

export function useGeminiContext() {
  const context = useContext(GeminiContext);
  if (context === undefined) {
    throw new Error("useGeminiContext must be used within a GeminiProvider");
  }
  return context;
}
