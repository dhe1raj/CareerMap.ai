
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import StepFive from "./StepFive";
import StepSix from "./StepSix";

// Helper function to save profile data
const saveField = (fieldName: string, value: any) => {
  // In a real app, this would connect to your backend
  const profileData = JSON.parse(localStorage.getItem('userProfile') || '{}');
  const nestedFields = fieldName.split('.');
  
  if (nestedFields.length === 2) {
    const [namespace, field] = nestedFields;
    if (!profileData[namespace]) {
      profileData[namespace] = {};
    }
    profileData[namespace][field] = value;
  } else {
    profileData[fieldName] = value;
  }
  
  localStorage.setItem('userProfile', JSON.stringify(profileData));
  console.log(`Saved ${fieldName}:`, value);
  return true;
};

export interface OnboardingProfile {
  roleStatus: string;
  roleStatusDetails?: string;
  organisation: string;
  organisationDetails?: string;
  yearsExperience: string;
  yearsExperienceDetails?: string;
  techStacks: string[];
  techStacksDetails?: string;
  confidentSkills: string[];
  confidentSkillsDetails?: string;
  immediateGoal: string;
  immediateGoalDetails?: string;
}

interface OnboardingWizardProps {
  isOpen: boolean;
  onComplete: (profile: OnboardingProfile) => void;
  onCancel?: () => void;
  initialProfile?: Partial<OnboardingProfile>;
}

export default function OnboardingWizard({
  isOpen,
  onComplete,
  onCancel,
  initialProfile = {}
}: OnboardingWizardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<OnboardingProfile>({
    roleStatus: initialProfile.roleStatus || "",
    roleStatusDetails: initialProfile.roleStatusDetails || "",
    organisation: initialProfile.organisation || "",
    organisationDetails: initialProfile.organisationDetails || "",
    yearsExperience: initialProfile.yearsExperience || "",
    yearsExperienceDetails: initialProfile.yearsExperienceDetails || "",
    techStacks: initialProfile.techStacks || [],
    techStacksDetails: initialProfile.techStacksDetails || "",
    confidentSkills: initialProfile.confidentSkills || [],
    confidentSkillsDetails: initialProfile.confidentSkillsDetails || "",
    immediateGoal: initialProfile.immediateGoal || "",
    immediateGoalDetails: initialProfile.immediateGoalDetails || ""
  });

  useEffect(() => {
    if (!isOpen) return;
    
    // Load any existing profile data
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        if (parsedProfile.profile) {
          setProfile(prev => ({ ...prev, ...parsedProfile.profile }));
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  }, [isOpen]);

  const updateProfile = (field: keyof OnboardingProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    
    // Save to user object
    if (field) {
      saveField(`profile.${field}`, value);
    }
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleComplete = () => {
    // Save all profile data
    Object.entries(profile).forEach(([key, value]) => {
      saveField(`profile.${key}`, value);
    });
    
    // Notify parent component
    onComplete(profile);
    
    // Navigate to career design page
    navigate("/career-designer", { state: { profile } });
    
    toast({
      title: "Profile updated",
      description: "Your profile has been saved successfully",
    });
  };

  // Calculate current progress percentage
  const progressPercentage = (currentStep / 6) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-3xl mx-auto">
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2 z-20" 
            onClick={handleCancel}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12),0_0_10px_rgba(168,85,247,0.2)]">
            <CardHeader>
              <div className="w-full mb-6">
                <Progress 
                  value={progressPercentage} 
                  className="h-2 w-full"
                />
              </div>
              <CardTitle className="text-2xl text-white text-gradient">
                {currentStep === 1 && "Tell us about yourself"}
                {currentStep === 2 && "Your organization"}
                {currentStep === 3 && "Your experience"}
                {currentStep === 4 && "Your tech expertise"}
                {currentStep === 5 && "Your key skills"}
                {currentStep === 6 && "Your goals"}
              </CardTitle>
              <CardDescription className="text-white/70">
                {`Step ${currentStep} of 6: Complete your profile to get personalized career guidance`}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="min-h-[300px]">
              {currentStep === 1 && (
                <StepOne 
                  value={profile.roleStatus}
                  details={profile.roleStatusDetails || ""}
                  onChange={(value) => updateProfile("roleStatus", value)}
                  onDetailsChange={(value) => updateProfile("roleStatusDetails", value)}
                />
              )}
              
              {currentStep === 2 && (
                <StepTwo 
                  value={profile.organisation}
                  details={profile.organisationDetails || ""}
                  onChange={(value) => updateProfile("organisation", value)}
                  onDetailsChange={(value) => updateProfile("organisationDetails", value)}
                />
              )}
              
              {currentStep === 3 && (
                <StepThree 
                  value={profile.yearsExperience}
                  details={profile.yearsExperienceDetails || ""}
                  onChange={(value) => updateProfile("yearsExperience", value)}
                  onDetailsChange={(value) => updateProfile("yearsExperienceDetails", value)}
                />
              )}
              
              {currentStep === 4 && (
                <StepFour 
                  values={profile.techStacks}
                  details={profile.techStacksDetails || ""}
                  onChange={(values) => updateProfile("techStacks", values)}
                  onDetailsChange={(value) => updateProfile("techStacksDetails", value)}
                />
              )}
              
              {currentStep === 5 && (
                <StepFive 
                  values={profile.confidentSkills}
                  details={profile.confidentSkillsDetails || ""}
                  onChange={(values) => updateProfile("confidentSkills", values)}
                  onDetailsChange={(value) => updateProfile("confidentSkillsDetails", value)}
                />
              )}
              
              {currentStep === 6 && (
                <StepSix 
                  value={profile.immediateGoal}
                  details={profile.immediateGoalDetails || ""}
                  onChange={(value) => updateProfile("immediateGoal", value)}
                  onDetailsChange={(value) => updateProfile("immediateGoalDetails", value)}
                />
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between border-t border-white/10 pt-6">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              
              <Button onClick={handleNext}>
                {currentStep === 6 ? "Complete" : "Next"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
