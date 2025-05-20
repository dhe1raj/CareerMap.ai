
import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebarEnhanced from "@/components/DashboardSidebarEnhanced";

interface DashboardLayoutEnhancedProps {
  children: ReactNode;
}

export default function DashboardLayoutEnhanced({ children }: DashboardLayoutEnhancedProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-cyber-deeper via-brand-900 to-cyber-dark">
        {/* Glassmorphism background elements */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-brand-400/10 blur-[100px] animate-pulse-glow"></div>
          <div className="absolute bottom-20 right-1/4 w-72 h-72 rounded-full bg-brand-500/10 blur-[80px] animate-pulse-glow"></div>
          <div className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full bg-brand-600/5 blur-[120px] animate-pulse-glow"></div>
          
          {/* Subtle grid overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTMwIDYwVjBtMzAgMzBIMCIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        </div>
        
        <DashboardSidebarEnhanced />
        <div className="flex-1">
          <div className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-8">
              <SidebarTrigger className="bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-md rounded-md p-2 transition-all hover:shadow-[0_0_10px_rgba(168,85,247,0.3)]" />
            </div>
            <main>{children}</main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
