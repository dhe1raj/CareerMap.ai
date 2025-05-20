
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGemini } from "@/lib/gemini";
import { Step1Age } from "./wizard-steps/Step1Age";
import { Step2Status } from "./wizard-steps/Step2Status";
import { Step3Education } from "./wizard-steps/Step3Education";
import { Step4Stream } from "./wizard-steps/Step4Stream";
import { Step5CareerGoal } from "./wizard-steps/Step5CareerGoal";
import { Step6Resume } from "./wizard-steps/Step6Resume";

export interface CareerProfile {
  age?: number;
  status?: 'Student' | 'Working' | 'Experienced' | 'Intern';
  degree?: string;
  stream?: string;
  goal?: 'new-job' | 'career-switch' | 'promotion' | 'startup';
  resume?: File;
  resumeText?: string;
}

interface CareerProfileWizardProps {
  onComplete: (profile: CareerProfile) => void;
  apiKey?: string;
  onCancel: () => void;
}

export function CareerProfileWizard({ onComplete, apiKey, onCancel }: CareerProfileWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<CareerProfile>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { callGemini } = useGemini();

  const updateProfile = (key: keyof CareerProfile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    // Validate current step
    if (currentStep === 1 && !profile.age) {
      toast({
        title: "Missing Info",
        description: "Please enter your age",
        variant: "destructive"
      });
      return;
    }

    if (currentStep === 2 && !profile.status) {
      toast({
        title: "Missing Info",
        description: "Please select your current status",
        variant: "destructive"
      });
      return;
    }

    // Special handling for resume upload step
    if (currentStep === 6 && profile.resume && apiKey) {
      setIsProcessing(true);
      try {
        // Read the file content
        const text = await readFileAsText(profile.resume);
        updateProfile('resumeText', text);
        
        // Use Gemini to parse resume if API key is available
        if (apiKey) {
          const parsedInfo = await parseResumeWithGemini(text, apiKey);
          if (parsedInfo) {
            // Update profile with any extracted information
            if (!profile.stream && parsedInfo.field) {
              updateProfile('stream', parsedInfo.field);
            }
          }
        }
      } catch (error) {
        console.error("Error processing resume:", error);
        toast({
          title: "Resume Processing Error",
          description: "Failed to process your resume. You can continue without it.",
          variant: "destructive"
        });
      } finally {
        setIsProcessing(false);
      }
    }

    // Proceed to next step or complete
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Wizard completed
      onComplete(profile);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const parseResumeWithGemini = async (text: string, apiKey: string) => {
    try {
      const prompt = `
      Please analyze this resume text and extract the following information:
      - Field or industry of work
      - Key skills
      - Years of experience
      - Education level
      
      Return the information as a JSON object with these fields: field, skills, yearsExperience, education.
      
      Resume text:
      ${text.substring(0, 1500)}  // Limit text length for token constraints
      `;

      const response = await callGemini(prompt, apiKey);
      
      if (response) {
        try {
          // Try to parse as JSON
          const jsonMatch = response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
        } catch (e) {
          console.error("Error parsing Gemini response as JSON:", e);
        }
      }
    } catch (error) {
      console.error("Error using Gemini to parse resume:", error);
    }
    return null;
  };

  // Calculate progress percentage
  const progress = (currentStep / 6) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto glass-morphism">
      <CardHeader className="space-y-4">
        <Progress value={progress} className="h-2" />
        <CardTitle>Design Your Career: Step {currentStep} of 6</CardTitle>
      </CardHeader>
      <CardContent>
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-center">Processing your resume...</p>
          </div>
        ) : (
          <div className="min-h-[300px]">
            {currentStep === 1 && <Step1Age value={profile.age} onChange={(v) => updateProfile('age', v)} />}
            {currentStep === 2 && <Step2Status value={profile.status} onChange={(v) => updateProfile('status', v)} />}
            {currentStep === 3 && <Step3Education value={profile.degree} onChange={(v) => updateProfile('degree', v)} />}
            {currentStep === 4 && <Step4Stream value={profile.stream} onChange={(v) => updateProfile('stream', v)} />}
            {currentStep === 5 && <Step5CareerGoal value={profile.goal} onChange={(v) => updateProfile('goal', v)} />}
            {currentStep === 6 && <Step6Resume value={profile.resume} onChange={(v) => updateProfile('resume', v)} />}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          {currentStep > 1 ? (
            <Button variant="outline" onClick={handlePrevious} disabled={isProcessing}>
              Previous
            </Button>
          ) : (
            <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
              Cancel
            </Button>
          )}
        </div>
        <Button onClick={handleNext} disabled={isProcessing}>
          {currentStep === 6 ? "Complete" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  );
}
