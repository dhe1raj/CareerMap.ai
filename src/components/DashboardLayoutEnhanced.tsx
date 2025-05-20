
import { ReactNode, useEffect } from "react";
import DashboardSidebarEnhanced from "./DashboardSidebarEnhanced";
import { Toaster } from "./ui/toaster";
import { useLocation } from "react-router-dom";

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
          {children}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
