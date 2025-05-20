
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import OnboardingWizard from "@/components/OnboardingWizard";
import { useUserData } from "@/hooks/use-user-data";
import { useRoadmap } from "@/hooks/use-roadmap";
import { useGeminiContext } from "@/context/GeminiContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingFallback } from "@/components/LoadingFallback";
import { isFirstLogin } from "@/utils/dashboard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { LoadingDashboard } from "@/components/dashboard/LoadingDashboard";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { apiKey } = useGeminiContext();
  const [showOnboarding, setShowOnboarding] = useState(isFirstLogin());
  const { userData, isLoading, fetchUserData, saveField } = useUserData();
  const { userRoadmap, roadmapProgress } = useRoadmap(apiKey || '');
  
  // Fetch user data on mount
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);
  
  const handleOnboardingComplete = (profile: any) => {
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
        <DashboardHeader 
          fullName={userData.profile?.fullName} 
          email={user?.email}
          onEditProfile={() => setShowOnboarding(true)}
        />

        <ErrorBoundary 
          fallback={
            <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-white">
              Something went wrong loading the dashboard content. Please refresh the page.
            </div>
          }
        >
          {isLoading ? (
            <LoadingDashboard />
          ) : (
            <DashboardContent 
              userData={userData}
              saveField={saveField}
              userRoadmap={userRoadmap}
              roadmapProgress={roadmapProgress}
            />
          )}
        </ErrorBoundary>
      </div>
      
      {/* Onboarding Wizard */}
      <OnboardingWizard 
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        onCancel={() => setShowOnboarding(false)}
        initialProfile={userData ? {
          roleStatus: userData.profile?.fullName
        } : {}}
      />
    </DashboardLayout>
  );
}
