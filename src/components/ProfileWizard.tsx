import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useUserData } from "@/hooks/use-user-data";
import RoadmapPickerModal from "@/components/RoadmapPickerModal";

interface ProfileWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileWizard({ isOpen, onClose }: ProfileWizardProps) {
  const { user } = useAuth();
  const { userData, saveField } = useUserData();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState({
    age: userData.profile.age || undefined,
    status: userData.profile.status || undefined,
    degree: userData.profile.degree || '',
    stream: userData.profile.stream || '',
    goal: userData.profile.goal || undefined,
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [showRoadmapPicker, setShowRoadmapPicker] = useState(false);
  
  const totalSteps = 6;
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save all profile data
      for (const [key, value] of Object.entries(profile)) {
        if (value !== undefined) {
          saveField(`profile.${key}`, value);
        }
      }
      
      // Process resume if uploaded
      if (resumeFile) {
        processResume(resumeFile);
      }
      
      // Show roadmap selection
      setShowRoadmapPicker(true);
      onClose();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleInputChange = (field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const processResume = async (file: File) => {
    try {
      // Read file content
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        
        // Save raw text
        saveField('resume.rawText', text);
        
        // For now, just store the file name as fileURL
        saveField('resume.fileURL', file.name);
        
        // In a real app, we would upload to storage and call an AI service to parse the resume
        // But for now, just simulate this with a timeout
        toast({
          title: "Resume Uploaded",
          description: "Your resume is being analyzed...",
        });
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error("Error processing resume:", error);
      toast({
        title: "Error",
        description: "Failed to process your resume.",
        variant: "destructive"
      });
    }
  };
  
  // Handle conditional logic
  const shouldShowStream = profile.status !== "Working" || !userData.resume.fileURL;
  
  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <Label htmlFor="age">Your Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter your age"
              className="glass-input"
              value={profile.age || ''}
              onChange={(e) => handleInputChange('age', parseInt(e.target.value) || '')}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <Label htmlFor="status">Current Status</Label>
            <Select
              value={profile.status || ''}
              onValueChange={(value) => handleInputChange('status', value)}
            >
              <SelectTrigger className="glass-input">
                <SelectValue placeholder="Select your current status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Student">Student</SelectItem>
                <SelectItem value="Working">Working Professional</SelectItem>
                <SelectItem value="Experienced">Experienced (5+ years)</SelectItem>
                <SelectItem value="Intern">Intern</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <Label htmlFor="degree">Highest Education Level</Label>
            <Select
              value={profile.degree || ''}
              onValueChange={(value) => handleInputChange('degree', value)}
            >
              <SelectTrigger className="glass-input">
                <SelectValue placeholder="Select your highest education" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High School">High School</SelectItem>
                <SelectItem value="Associate">Associate Degree</SelectItem>
                <SelectItem value="Bachelor">Bachelor's Degree</SelectItem>
                <SelectItem value="Master">Master's Degree</SelectItem>
                <SelectItem value="PhD">PhD or Doctorate</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {profile.degree === 'Other' && (
              <Input
                placeholder="Please specify"
                className="glass-input mt-2"
                value={typeof profile.degree === 'string' ? profile.degree : ''}
                onChange={(e) => handleInputChange('degree', e.target.value)}
              />
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            {shouldShowStream && (
              <>
                <Label htmlFor="stream">Field of Study or Current Domain</Label>
                <Select
                  value={profile.stream || ''}
                  onValueChange={(value) => handleInputChange('stream', value)}
                >
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Select your field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {profile.stream === 'Other' && (
                  <Input
                    placeholder="Please specify"
                    className="glass-input mt-2"
                    value={typeof profile.stream === 'string' ? profile.stream : ''}
                    onChange={(e) => handleInputChange('stream', e.target.value)}
                  />
                )}
              </>
            )}
            {!shouldShowStream && (
              <p className="text-muted-foreground">
                This step is skipped based on your previous selections.
              </p>
            )}
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <Label htmlFor="goal">Primary Career Goal</Label>
            <Select
              value={profile.goal || ''}
              onValueChange={(value: "job" | "switch" | "promotion" | "startup") => 
                handleInputChange('goal', value)
              }
            >
              <SelectTrigger className="glass-input">
                <SelectValue placeholder="Select your goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="job">Find a new job</SelectItem>
                <SelectItem value="switch">Switch careers</SelectItem>
                <SelectItem value="promotion">Get a promotion</SelectItem>
                <SelectItem value="startup">Start my own business</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <Label htmlFor="resume">Upload Resume (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="resume"
                type="file"
                accept=".pdf,.docx,.doc"
                className="glass-input"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, DOCX (Max size: 5MB)
            </p>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] glass-morphism">
          <DialogHeader>
            <DialogTitle>Design Your Career</DialogTitle>
          </DialogHeader>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1 text-sm text-muted-foreground">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded">
              <div 
                className="h-2 bg-gradient-to-r from-brand-400 to-brand-500 rounded" 
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {renderStepContent()}
          
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            <Button onClick={handleNext}>
              {currentStep === totalSteps ? "Finish" : "Next"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <RoadmapPickerModal 
        open={showRoadmapPicker}
        onClose={() => setShowRoadmapPicker(false)}
        onSelect={(roadmap) => {
          // Handle roadmap selection
          console.log('Selected roadmap:', roadmap);
          setShowRoadmapPicker(false);
        }}
      />
    </>
  );
}
