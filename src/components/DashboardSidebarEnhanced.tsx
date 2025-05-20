
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  BookOpen,
  FileText,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  User,
} from "lucide-react";

export default function DashboardSidebarEnhanced() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Navigation items including the new account settings link
  const navItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
    { name: "Career Chat", icon: <MessageSquare size={20} />, path: "/career-chat" },
    { name: "Resume Analysis", icon: <FileText size={20} />, path: "/resume-analysis" },
    { name: "Career Matches", icon: <BarChart3 size={20} />, path: "/career-matches" },
    { name: "Roadmap", icon: <BookOpen size={20} />, path: "/roadmap" },
    { name: "Profile Settings", icon: <User size={20} />, path: "/profile-settings" },
    { name: "Account Settings", icon: <Settings size={20} />, path: "/account-settings" },
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  return (
    <div className="h-screen p-4 bg-gradient-to-b from-cyber-deeper via-brand-900 to-cyber-dark border-r border-white/10">
      <div className="flex items-center justify-center mb-8 pt-4">
        <img 
          src="/lovable-uploads/d2d8e0ba-043a-43ca-89a4-25cc3de159b4.png" 
          alt="CareerMap Logo"
          className="h-8"
        />
      </div>
      
      <div className="space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.name}
            variant={location.pathname === item.path ? "secondary" : "ghost"}
            className={`w-full justify-start ${
              location.pathname === item.path
                ? "bg-white/10 backdrop-blur-md border border-white/10"
                : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            <div className="flex items-center">
              <span className="mr-3">{item.icon}</span>
              <span>{item.name}</span>
            </div>
          </Button>
        ))}
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 px-4">
        <Button
          variant="outline"
          className="w-full justify-start hover:bg-white/10 hover:text-red-400 hover:border-red-400/50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}
