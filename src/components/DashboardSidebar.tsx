import {
  Home,
  FileSearch,
  Palette,
  Target,
  LineChart,
  BookOpen,
  MessageSquare,
  Settings,
  LucideIcon,
  Sparkles
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
  disabled?: boolean;
  beta?: boolean;
}

export default function DashboardSidebar() {
  const { user, signOut } = useAuth();
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        if (user) {
          const { data, error } = await supabase
            .storage
            .from('avatars')
            .getPublicUrl(`avatars/${user.id}`);
          
          if (error) {
            console.error("Error fetching profile URL:", error);
            toast.error("Failed to load profile image");
          } else {
            setProfileUrl(data.publicUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);
  
  const navigation: NavItem[] = [
    { label: "Dashboard", icon: Home, path: "/dashboard" },
    { label: "Resume Analysis", icon: FileSearch, path: "/dashboard/resume" },
    { label: "Career Designer", icon: Palette, path: "/career-designer" },
    { label: "Career Matches", icon: Target, path: "/career-matches" },
    { label: "Career Progress", icon: LineChart, path: "/career-progress" },
    { label: "Career Resources", icon: BookOpen, path: "/career-resources" },
    { label: "Career AI Chat", icon: MessageSquare, path: "/career-chat" },
    { label: "GenZ Career Decider", icon: Sparkles, path: "/genz-career-decider", beta: true },
  ];

  return (
    <div className="flex flex-col h-full bg-background border-r border-border py-4">
      <div className="px-4 mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 w-full justify-start px-2">
              <Avatar className="h-8 w-8">
                {isLoading ? (
                  <Skeleton className="h-8 w-8 rounded-full" />
                ) : profileUrl ? (
                  <AvatarImage src={profileUrl} alt="Profile" />
                ) : (
                  <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col text-left">
                <span className="font-semibold">{user?.email}</span>
                <span className="text-muted-foreground text-sm">View profile</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end" forceMount>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex-1">
        <nav className="grid items-start px-4 text-sm">
          {navigation.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground ${
                  isActive ? "bg-secondary text-foreground font-medium" : ""
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.beta && (
                <Badge variant="secondary" className="ml-auto">
                  Beta
                </Badge>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="mt-auto px-4">
        <a
          href="https://lovable.dev"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
          Settings
        </a>
      </div>
    </div>
  );
}
