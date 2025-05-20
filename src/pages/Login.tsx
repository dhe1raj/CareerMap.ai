
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      toast({
        title: "Login successful",
        description: "Welcome back to CareerMap!",
      });
    } catch (error: any) {
      // Error is handled in the signIn function
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      await signInWithGoogle();
      // Redirect happens automatically via OAuth
    } catch (error) {
      setIsLoading(false);
      // Error is handled in the signInWithGoogle function
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#1C1C1C" }}>
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-md w-full shadow-lg" style={{ backgroundColor: "#F2F2F5" }}>
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/d2d8e0ba-043a-43ca-89a4-25cc3de159b4.png" 
                alt="CareerMap Logo" 
                className="h-16 w-auto"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-center" style={{ color: "#1C1C1C" }}>
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center" style={{ color: "#999999" }}>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" style={{ color: "#1C1C1C" }}>Email</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <Mail size={18} />
                  </span>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                    style={{ 
                      backgroundColor: "#E9E6F0", 
                      borderColor: "#9F68F0",
                      color: "#1C1C1C" 
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" style={{ color: "#1C1C1C" }}>Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm hover:underline"
                    style={{ color: "#9F68F0" }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <Lock size={18} />
                  </span>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10"
                    style={{ 
                      backgroundColor: "#E9E6F0", 
                      borderColor: "#9F68F0",
                      color: "#1C1C1C" 
                    }}
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
                style={{ 
                  backgroundColor: "#9F68F0", 
                  color: "#FFFFFF" 
                }}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" style={{ backgroundColor: "#999999" }} />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span style={{ backgroundColor: "#F2F2F5", color: "#999999", padding: "0 10px" }}>
                  Or continue with
                </span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              style={{ 
                backgroundColor: "white",
                borderColor: "#E9E6F0",
                color: "#1C1C1C" 
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-5 h-5 mr-2"
              >
                <path
                  fill="#EA4335"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#4285F4"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#34A853"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 text-center pb-6">
            <div className="text-sm" style={{ color: "#999999" }}>
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="hover:underline"
                style={{ color: "#9F68F0" }}
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
