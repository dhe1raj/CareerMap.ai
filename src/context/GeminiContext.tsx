
import { createContext, useContext, useState, ReactNode } from 'react';

interface GeminiContextType {
  geminiClient: any | null;
  isGeminiConfigured: boolean;
  apiKey: string | null;
  modelName: string;
  setGeminiClient: (client: any) => void;
  setApiKey: (key: string) => void;
  setModelName: (model: string) => void;
}

const GeminiContext = createContext<GeminiContextType>({
  geminiClient: null,
  isGeminiConfigured: false,
  apiKey: null,
  modelName: 'gemini-2.0-flash',
  setGeminiClient: () => {},
  setApiKey: () => {},
  setModelName: () => {}
});

export const GeminiProvider = ({ children }: { children: ReactNode }) => {
  const [geminiClient, setGeminiClient] = useState<any | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [modelName, setModelName] = useState<string>('gemini-2.0-flash');

  return (
    <GeminiContext.Provider value={{
      geminiClient,
      isGeminiConfigured: !!geminiClient,
      apiKey,
      modelName,
      setGeminiClient,
      setApiKey,
      setModelName
    }}>
      {children}
    </GeminiContext.Provider>
  );
};

// Export both names for compatibility
export const useGemini = () => useContext(GeminiContext);
export const useGeminiContext = () => useContext(GeminiContext);
