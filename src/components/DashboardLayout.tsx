
import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-brand-900 to-black">
        {/* Glassmorphism background elements */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-brand-400/20 blur-[100px]"></div>
          <div className="absolute bottom-20 right-1/4 w-72 h-72 rounded-full bg-brand-500/10 blur-[80px]"></div>
        </div>
        
        <DashboardSidebar />
        <div className="flex-1">
          <div className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-8">
              <SidebarTrigger />
            </div>
            <main>{children}</main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
