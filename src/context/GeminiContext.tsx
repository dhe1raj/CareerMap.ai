
import { createContext, useContext, useState, ReactNode } from 'react';

interface GeminiContextType {
  geminiClient: any | null;
  isGeminiConfigured: boolean;
  setGeminiClient: (client: any) => void;
}

const GeminiContext = createContext<GeminiContextType>({
  geminiClient: null,
  isGeminiConfigured: false,
  setGeminiClient: () => {}
});

export const GeminiProvider = ({ children }: { children: ReactNode }) => {
  const [geminiClient, setGeminiClient] = useState<any | null>(null);

  return (
    <GeminiContext.Provider value={{
      geminiClient,
      isGeminiConfigured: !!geminiClient,
      setGeminiClient
    }}>
      {children}
    </GeminiContext.Provider>
  );
};

export const useGemini = () => useContext(GeminiContext);
