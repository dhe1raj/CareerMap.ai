import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/9ae4cbff-f439-40be-949e-407cd109074b.png" 
              alt="CareerForge Logo" 
              className="h-20 w-auto transition-transform hover:scale-110" 
            />
            <span className="text-xl font-bold">CareerForge</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Features
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            About
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage 
                        src={profile?.avatar_url}
                        alt={profile?.full_name || user.email} 
                      />
                      <AvatarFallback>
                        {profile?.full_name ? getInitials(profile.full_name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{profile?.full_name || "User"}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/career-designer">Career Designer</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/genz-career-decider">Gen Z Career Decider</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/career-chat">Career Chat</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/resume-analysis">Resume Analysis</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button asChild>
                <Link to="/auth">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/auth?tab=signup">Sign up</Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile navigation */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>CareerForge</SheetTitle>
              <SheetDescription>
                Navigate to different sections of the app.
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col space-y-4 py-4">
              <Link
                to="/features"
                className="text-sm font-medium hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              {user ? (
                <>
                  <div className="flex items-center py-2">
                    <Avatar className="h-9 w-9 mr-2">
                      <AvatarImage 
                        src={profile?.avatar_url}
                        alt={profile?.full_name || user.email} 
                      />
                      <AvatarFallback>
                        {profile?.full_name ? getInitials(profile.full_name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{profile?.full_name || "User"}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <hr />
                  <Link
                    to="/dashboard"
                    className="text-sm font-medium hover:underline"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/career-designer"
                    className="text-sm font-medium hover:underline"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Career Designer
                  </Link>
                  <Link
                    to="/genz-career-decider"
                    className="text-sm font-medium hover:underline"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Gen Z Career Decider
                  </Link>
                  <Link
                    to="/career-chat"
                    className="text-sm font-medium hover:underline"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Career Chat
                  </Link>
                  <Link
                    to="/resume-analysis"
                    className="text-sm font-medium hover:underline"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Resume Analysis
                  </Link>
                  <Link
                    to="/settings"
                    className="text-sm font-medium hover:underline"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <hr />
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button asChild>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link to="/auth?tab=signup" onClick={() => setIsMenuOpen(false)}>
                      Sign up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
