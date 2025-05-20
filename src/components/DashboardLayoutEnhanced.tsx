
import { ReactNode, useEffect } from "react";
import DashboardSidebarEnhanced from "./DashboardSidebarEnhanced";
import { Toaster } from "./ui/toaster";
import { useLocation } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface DashboardLayoutEnhancedProps {
  children: ReactNode;
}

export default function DashboardLayoutEnhanced({ children }: DashboardLayoutEnhancedProps) {
  const location = useLocation();
  
  useEffect(() => {
    console.log("Rendering DashboardLayoutEnhanced for path:", location.pathname);
  }, [location.pathname]);
  
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-cyber-deeper via-brand-900 to-cyber-dark">
      <div className="w-64 flex-shrink-0">
        <DashboardSidebarEnhanced />
      </div>
      <div className="flex-grow p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <ErrorBoundary fallback={<div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-white">
            Something went wrong with this component. Please try again or contact support.
          </div>}>
            {children}
          </ErrorBoundary>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
