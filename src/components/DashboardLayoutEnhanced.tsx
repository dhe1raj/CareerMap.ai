
import { ReactNode } from "react";
import DashboardSidebarEnhanced from "./DashboardSidebarEnhanced";
import { Toaster } from "./ui/toaster";

interface DashboardLayoutEnhancedProps {
  children: ReactNode;
}

export default function DashboardLayoutEnhanced({ children }: DashboardLayoutEnhancedProps) {
  console.log("Rendering DashboardLayoutEnhanced");
  
  return (
    <div className="min-h-screen flex">
      <div className="w-64 flex-shrink-0">
        <DashboardSidebarEnhanced />
      </div>
      <div className="flex-grow bg-gradient-to-b from-cyber-deeper via-brand-900 to-cyber-dark p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
