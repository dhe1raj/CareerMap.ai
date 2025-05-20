
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export function SidebarUserProfile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut, user, profile } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Logout failed",
        description: "There was an issue logging you out.",
        variant: "destructive"
      });
    }
  };

  // Get user initials for avatar fallback
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "User"} />
          <AvatarFallback>{getInitials(profile?.full_name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-sm">{profile?.full_name || user?.email?.split('@')[0] || 'User'}</p>
          <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleLogout}
        title="Logout"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </Button>
    </div>
  );
}
