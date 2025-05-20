
import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Lock, User } from "lucide-react";

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const { user, signIn, signUp, signInWithGoogle } = useAuth();
  const location = useLocation();
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Signup form state
  const [fullName, setFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Set active tab based on URL query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab === "login" || tab === "signup") {
      setActiveTab(tab);
    }
  }, [location]);

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(loginEmail, loginPassword);
    } catch (error) {
      // Error is handled in the signIn function
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signUp(signupEmail, signupPassword, fullName);
      toast({
        title: "Account created",
        description: "Welcome to CareerMap! Please verify your email to continue.",
      });
      setActiveTab("login");
    } catch (error) {
      // Error is handled in the signUp function
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4" style={{ backgroundColor: "#E9E6F0" }}>
              <TabsTrigger 
                value="login" 
                style={{ 
                  color: activeTab === "login" ? "#FFFFFF" : "#999999",
                  backgroundColor: activeTab === "login" ? "#9F68F0" : "transparent" 
                }}
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                style={{ 
                  color: activeTab === "signup" ? "#FFFFFF" : "#999999",
                  backgroundColor: activeTab === "signup" ? "#9F68F0" : "transparent" 
                }}
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <CardHeader className="pb-2">
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
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
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
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
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
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <Lock size={18} />
                      </span>
                      <Input
                        id="password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
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
                
                <div className="relative my-6">
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
                  Sign in with Google
                </Button>
              </CardContent>
              <CardFooter className="flex justify-center pb-6">
                <div className="text-sm" style={{ color: "#999999" }}>
                  Don't have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => setActiveTab("signup")}
                    style={{ color: "#9F68F0" }}
                  >
                    Sign up
                  </Button>
                </div>
              </CardFooter>
            </TabsContent>
            
            <TabsContent value="signup">
              <CardHeader className="pb-2">
                <div className="flex justify-center mb-4">
                  <img 
                    src="/lovable-uploads/d2d8e0ba-043a-43ca-89a4-25cc3de159b4.png"
                    alt="CareerMap Logo" 
                    className="h-16 w-auto"
                  />
                </div>
                <CardTitle className="text-2xl font-bold text-center" style={{ color: "#1C1C1C" }}>
                  Create Account
                </CardTitle>
                <CardDescription className="text-center" style={{ color: "#999999" }}>
                  Enter your information to get started with CareerMap
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" style={{ color: "#1C1C1C" }}>Full Name</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <User size={18} />
                      </span>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
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
                    <Label htmlFor="signupEmail" style={{ color: "#1C1C1C" }}>Email</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <Mail size={18} />
                      </span>
                      <Input
                        id="signupEmail"
                        placeholder="name@example.com"
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
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
                    <Label htmlFor="signupPassword" style={{ color: "#1C1C1C" }}>Password</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <Lock size={18} />
                      </span>
                      <Input
                        id="signupPassword"
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        className="pl-10"
                        style={{ 
                          backgroundColor: "#E9E6F0", 
                          borderColor: "#9F68F0",
                          color: "#1C1C1C" 
                        }}
                      />
                    </div>
                    <p className="text-xs" style={{ color: "#999999" }}>
                      Must be at least 8 characters long
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" style={{ color: "#1C1C1C" }}>Confirm Password</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <Lock size={18} />
                      </span>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </Button>
                </form>
                
                <div className="relative my-6">
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
                  Sign up with Google
                </Button>
              </CardContent>
              <CardFooter className="flex justify-center pb-6">
                <div className="text-sm" style={{ color: "#999999" }}>
                  Already have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => setActiveTab("login")}
                    style={{ color: "#9F68F0" }}
                  >
                    Log in
                  </Button>
                </div>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
