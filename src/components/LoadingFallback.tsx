
import React, { useEffect, useState } from "react";

interface LoadingFallbackProps {
  timeout?: number;
  message?: string;
}

export function LoadingFallback({ 
  timeout = 2000,
  message = "Loading..."
}: LoadingFallbackProps) {
  const [isTimedOut, setIsTimedOut] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimedOut(true);
    }, timeout);
    
    return () => clearTimeout(timer);
  }, [timeout]);
  
  if (isTimedOut) {
    return (
      <div className="p-4 bg-amber-900/20 border border-amber-500/50 rounded-lg text-white">
        <p className="font-medium">Component failed to load within {timeout/1000} seconds</p>
        <p className="text-sm opacity-70 mt-1">Please refresh the page or contact support if the issue persists.</p>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
      <span className="ml-3 text-white">{message}</span>
    </div>
  );
}
