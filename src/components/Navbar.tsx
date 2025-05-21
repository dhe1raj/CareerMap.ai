
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
          <Link to="/" className="flex items-center space-x-2" aria-label="CareerMap Home">
            <img 
              src="/lovable-uploads/6dada9e0-7c2b-4be1-8795-cb8580fec628.png" 
              alt="CareerMap Logo" 
              className="h-8" 
              loading="eager" 
              width="32" 
              height="32" 
            />
            <span className="text-xl font-bold">CareerMap</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Home
          </Link>
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
                    aria-label="User menu"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage 
                        src={profile?.avatar_url}
                        alt={profile?.full_name || user.email || "User profile"} 
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
              <Button variant="ghost" asChild>
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
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>CareerMap</SheetTitle>
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
                        alt={profile?.full_name || user.email || "User profile"} 
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
                  <Button variant="outline" asChild>
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
