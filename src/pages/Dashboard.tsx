import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import OnboardingWizard from "@/components/OnboardingWizard";

// Check if this is the first login
const isFirstLogin = () => {
  const visited = localStorage.getItem('hasVisitedBefore');
  if (!visited) {
    localStorage.setItem('hasVisitedBefore', 'true');
    return true;
  }
  return false;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(isFirstLogin());
  
  const handleOnboardingComplete = (profile) => {
    setShowOnboarding(false);
    // Navigate to career designer with the profile
    navigate('/career-designer', { state: { profile } });
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {user?.email || 'User'}
            </p>
          </div>
          
          <Button onClick={() => setShowOnboarding(true)} variant="outline">
            Edit Profile
          </Button>
        </div>

        {/* Dashboard content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="glass-morphism card-hover">
            <CardHeader>
              <CardTitle>Design Your Career</CardTitle>
              <CardDescription>
                Get personalized career guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">
                Answer a few questions about your skills and goals to get AI-powered career recommendations.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => navigate("/career-designer")}
                className="w-full"
              >
                Get Started
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="glass-morphism card-hover">
            <CardHeader>
              <CardTitle>Career Matches</CardTitle>
              <CardDescription>
                Explore roles that match your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">
                Discover career paths and roles that align with your skills, interests, and experience.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => navigate("/career-matches")}
                className="w-full"
                variant="outline"
              >
                View Matches
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="glass-morphism card-hover">
            <CardHeader>
              <CardTitle>Resume Analysis</CardTitle>
              <CardDescription>
                Get feedback on your resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">
                Upload your resume to receive AI-powered feedback and suggestions for improvement.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => navigate("/resume-analysis")}
                className="w-full"
                variant="outline"
              >
                Analyze Resume
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="glass-morphism card-hover">
            <CardHeader>
              <CardTitle>Career Roadmap</CardTitle>
              <CardDescription>
                Your personalized learning path
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">
                Follow a step-by-step roadmap to achieve your career goals with curated resources.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => navigate("/roadmap")}
                className="w-full"
                variant="outline"
              >
                View Roadmap
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="glass-morphism card-hover">
            <CardHeader>
              <CardTitle>Career Chat</CardTitle>
              <CardDescription>
                Get answers to your career questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">
                Chat with our AI career coach to get personalized advice and answers to your questions.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => navigate("/career-chat")}
                className="w-full"
                variant="outline"
              >
                Start Chatting
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="glass-morphism card-hover">
            <CardHeader>
              <CardTitle>Gen Z Career Decider</CardTitle>
              <CardDescription>
                Find your perfect career match
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">
                Take a quick quiz to discover careers that match your personality, interests, and values.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => navigate("/genz-career-decider")}
                className="w-full"
                variant="outline"
              >
                Take Quiz
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Onboarding Wizard */}
      <OnboardingWizard 
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        onCancel={() => setShowOnboarding(false)}
      />
    </DashboardLayout>
  );
}
