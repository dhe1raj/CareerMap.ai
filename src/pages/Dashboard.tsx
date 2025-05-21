
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import OnboardingWizard from "@/components/OnboardingWizard";
import { useUserData } from "@/hooks/use-user-data";
import { CareerProgress } from "@/components/dashboard/CareerProgress";
import { ResumeAnalysis } from "@/components/dashboard/ResumeAnalysis";
import { CareerChat } from "@/components/dashboard/CareerChat";
import { RoadmapProgress } from "@/components/dashboard/RoadmapProgress";
import { ChevronRight, BookMarked, FileText, Briefcase } from "lucide-react";
import ProfileWizard from "@/components/ProfileWizard";

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
  const [showProfileWizard, setShowProfileWizard] = useState(false);
  const { userData, isLoading, fetchUserData, saveField } = useUserData();
  
  // Fetch user data on mount
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);
  
  const handleOnboardingComplete = (profile) => {
    setShowOnboarding(false);
    
    // Save profile data
    saveField('profile.fullName', profile.roleStatus || '');
    saveField('profile.email', user?.email || '');
    
    // Update career progress
    saveField('career.progress', 30); // Starting progress after completing onboarding
    
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
              Welcome back, {userData.profile.fullName || user?.email || 'User'}
            </p>
          </div>
          
          <Button onClick={() => setShowProfileWizard(true)} variant="outline">
            Design My Career
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="glass-morphism animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-white/10 rounded w-1/2"></div>
                  <div className="h-4 bg-white/10 rounded w-2/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-24 bg-white/5 rounded"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-10 bg-white/10 rounded w-full"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Roadmap Progress Card - New and primary component */}
            <div className="md:col-span-2 lg:col-span-2">
              <RoadmapProgress />
            </div>
            
            {/* Career Progress Card */}
            <CareerProgress 
              userData={userData} 
              onUpdateField={saveField}
            />
            
            {/* Resume Analysis Card */}
            <ResumeAnalysis 
              userData={userData} 
              onUpdateField={saveField}
            />
            
            {/* Career Chat Card */}
            <CareerChat 
              userData={userData} 
              onUpdateField={saveField}
            />
            
            {/* Career Roadmap Card */}
            <Card className="glass-morphism card-hover">
              <CardHeader>
                <CardTitle>Career Resources</CardTitle>
                <CardDescription>
                  Learn more about your chosen career path
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">
                  Access specialized resources and learning materials tailored to your career goals.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => navigate("/roadmap")}
                  className="w-full"
                  variant="outline"
                >
                  <BookMarked className="mr-2 h-4 w-4" />
                  Explore Resources
                  <ChevronRight className="ml-auto h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            {/* Career Matches Card */}
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
                  <Briefcase className="mr-2 h-4 w-4" />
                  View Matches
                  <ChevronRight className="ml-auto h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            {/* Resume Analysis Full Card */}
            <Card className="glass-morphism card-hover">
              <CardHeader>
                <CardTitle>Resume Analysis</CardTitle>
                <CardDescription>
                  Get detailed feedback on your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">
                  Get comprehensive AI-powered feedback and suggestions to improve your resume and stand out to employers.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => navigate("/resume-analysis")}
                  className="w-full"
                  variant="outline"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Full Analysis
                  <ChevronRight className="ml-auto h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
      
      {/* Onboarding Wizard */}
      <OnboardingWizard 
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        onCancel={() => setShowOnboarding(false)}
        initialProfile={userData ? {
          roleStatus: userData.profile.fullName
          // Removed email property as it's not part of the OnboardingProfile type
        } : {}}
      />
      
      {/* Profile Wizard */}
      <ProfileWizard 
        isOpen={showProfileWizard}
        onClose={() => setShowProfileWizard(false)}
      />
    </DashboardLayout>
  );
}
