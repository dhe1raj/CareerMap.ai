
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  LineChart, Database, FileText, 
  Brain, LayoutDashboard, UserCog, 
  Book, BarChart3, LogOut, FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function DashboardSidebarUpdated() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const isActive = (path: string) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") return true;
    if (path !== "/dashboard" && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  
  const menuItems = [
    { 
      path: "/dashboard", 
      icon: <LayoutDashboard className="w-5 h-5" />, 
      label: "Dashboard" 
    },
    { 
      path: "/career-designer", 
      icon: <Brain className="w-5 h-5" />, 
      label: "Career Designer" 
    },
    { 
      path: "/career-matches", 
      icon: <Database className="w-5 h-5" />, 
      label: "Match Results" 
    },
    { 
      path: "/resume-analysis", 
      icon: <FileText className="w-5 h-5" />, 
      label: "Resume Analysis" 
    },
    { 
      path: "/roadmap", 
      icon: <LineChart className="w-5 h-5" />, 
      label: "Roadmap" 
    },
    { 
      path: "/career-progress", 
      icon: <BarChart3 className="w-5 h-5" />, 
      label: "Career Progress" 
    },
    { 
      path: "/career-resources", 
      icon: <Book className="w-5 h-5" />, 
      label: "Resources" 
    }
  ];
  
  return (
    <div className="h-screen fixed left-0 top-0 z-20 w-64 bg-gray-900/80 backdrop-blur-md overflow-auto hidden sm:block glass-morphism border-0 border-r border-white/10">
      <div className="p-4">
        <div 
          className="text-xl font-bold mb-4 text-white flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          <span className="text-3xl">🗺️</span>
          <span className="text-gradient">CareerMap</span>
        </div>
        
        <div className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "default" : "ghost"}
              className={`w-full justify-start ${
                isActive(item.path) 
                  ? "bg-white/10 hover:bg-white/20" 
                  : "hover:bg-white/5"
              }`}
              onClick={() => navigate(item.path)}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Button>
          ))}
        </div>
        
        <Separator className="my-4 bg-white/10" />
        
        <div className="flex flex-col gap-1">
          <Button
            variant={isActive("/settings") ? "default" : "ghost"}
            className={`w-full justify-start ${
              isActive("/settings") 
                ? "bg-white/10 hover:bg-white/20" 
                : "hover:bg-white/5"
            }`}
            onClick={() => navigate("/settings")}
          >
            <UserCog className="mr-2 h-5 w-5" />
            Settings
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-white/5 text-red-400 hover:text-red-300"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
