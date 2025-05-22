
import React, { ReactNode } from "react";
import { DashboardSidebarUpdated } from "./DashboardSidebarUpdated";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayoutUpdated: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <DashboardSidebarUpdated />
      
      {/* Mobile Sidebar Menu */}
      <div className="sm:hidden fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-30 bg-gray-900/80 backdrop-blur-md border-b border-white/10">
        <div className="text-xl font-bold text-gradient flex items-center">
          <span className="text-2xl mr-2">🗺️</span>
          CareerMap
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition">
              <Menu />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0 bg-gray-900/95 border-white/10">
            <DashboardSidebarUpdated />
          </SheetContent>
        </Sheet>
      </div>
      
      <main className="sm:ml-64 min-h-screen pt-16 sm:pt-0">
        <div className="container mx-auto p-4 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayoutUpdated;
