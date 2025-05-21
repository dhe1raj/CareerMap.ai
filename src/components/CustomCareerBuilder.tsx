
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "./ui/sheet";
import { useUserData, UserRoadmap } from "@/hooks/use-user-data";
import { RoadmapStep } from "@/data/roadmapTemplates";
import { useGeminiRoadmap, GeminiRoadmapStep } from "@/utils/gemini";
import { useGeminiContext } from "@/context/GeminiContext";
import { Loader2, Sparkles, ArrowRight } from "lucide-react";

interface CareerBuilderQuestion {
  id: string;
  question: string;
  type: 'select' | 'input' | 'textarea' | 'radio';
  options?: string[];
  placeholder?: string;
  required?: boolean;
  conditionalShow?: (answers: Record<string, any>) => boolean;
}

const questions: CareerBuilderQuestion[] = [
  {
    id: 'status',
    question: 'Are you a student or working professional?',
    type: 'select',
    options: ['Student', 'Working Professional', 'Recent Graduate', 'Career Changer'],
    required: true,
  },
  {
    id: 'institution',
    question: 'Which college/university are you from?',
    type: 'select',
    options: ['Tier 1 Institution', 'Tier 2 Institution', 'Tier 3 Institution', 'Ivy League', 'Non-target School', 'Other'],
    conditionalShow: (answers) => answers.status === 'Student' || answers.status === 'Recent Graduate',
  },
  {
    id: 'degree',
    question: 'Your degree and course?',
    type: 'input',
    placeholder: 'e.g., BTech CSE, BA Economics',
  },
  {
    id: 'skills',
    question: 'Tech stacks or skills you already know?',
    type: 'textarea',
    placeholder: 'e.g., Python, React, SQL, Data Analysis',
    required: true,
  },
  {
    id: 'dreamRoles',
    question: 'What are your dream job roles?',
    type: 'textarea',
    placeholder: 'e.g., ML Engineer, Cyber Analyst, Full Stack Developer',
    required: true,
  },
  {
    id: 'industries',
    question: 'Preferred domain or industries?',
    type: 'textarea',
    placeholder: 'e.g., Healthcare, Fintech, E-commerce',
  },
  {
    id: 'timeCommitment',
    question: 'Time you can invest weekly in learning?',
    type: 'select',
    options: ['1-5 hours', '5-10 hours', '10-15 hours', '15+ hours'],
    required: true,
  },
  {
    id: 'learningStyle',
    question: 'Do you prefer video, text, or project-based learning?',
    type: 'radio',
    options: ['Video courses', 'Text tutorials/documentation', 'Project-based learning', 'Mix of everything'],
    required: true,
  },
];

interface CustomCareerBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  isDialog?: boolean; // True for Dialog, False for Sheet
}

export default function CustomCareerBuilder({ 
  isOpen, 
  onClose,
  isDialog = true 
}: CustomCareerBuilderProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userData, saveField } = useUserData();
  const { apiKey } = useGeminiContext();
  const { personalizeRoadmap, isLoading: isGeminiLoading } = useGeminiRoadmap();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  
  const totalSteps = questions.filter(q => !q.conditionalShow || q.conditionalShow(answers)).length;
  
  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const renderQuestion = () => {
    const filteredQuestions = questions.filter(q => !q.conditionalShow || q.conditionalShow(answers));
    if (currentStep >= filteredQuestions.length) return null;
    
    const question = filteredQuestions[currentStep];
    
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-medium">{question.question}</h3>
        
        {question.type === 'select' && (
          <Select
            value={answers[question.id] || ''}
            onValueChange={(value) => handleAnswer(question.id, value)}
          >
            <SelectTrigger className="glass-input">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        {question.type === 'input' && (
          <Input
            className="glass-input"
            placeholder={question.placeholder}
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
          />
        )}
        
        {question.type === 'textarea' && (
          <Textarea
            className="glass-input min-h-[100px]"
            placeholder={question.placeholder}
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
          />
        )}
        
        {question.type === 'radio' && (
          <RadioGroup
            value={answers[question.id] || ''}
            onValueChange={(value) => handleAnswer(question.id, value)}
            className="space-y-2"
          >
            {question.options?.map((option) => (
              <div key={option} className="flex items-center">
                <RadioGroupItem id={option} value={option} />
                <Label htmlFor={option} className="ml-2">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>
    );
  };
  
  const canProceed = () => {
    const filteredQuestions = questions.filter(q => !q.conditionalShow || q.conditionalShow(answers));
    if (currentStep >= filteredQuestions.length) return true;
    
    const question = filteredQuestions[currentStep];
    return !question.required || !!answers[question.id];
  };
  
  const handleNext = () => {
    const filteredQuestions = questions.filter(q => !q.conditionalShow || q.conditionalShow(answers));
    if (currentStep < filteredQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleGenerate();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleGenerate = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please add a Gemini API key in settings to use this feature.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Prepare user profile for AI
      const userProfile = {
        status: answers.status,
        education: {
          institution: answers.institution || "Not specified",
          degree: answers.degree || "Not specified"
        },
        skills: answers.skills,
        interests: {
          roles: answers.dreamRoles,
          industries: answers.industries || "Not specified"
        },
        preferences: {
          timeCommitment: answers.timeCommitment,
          learningStyle: answers.learningStyle
        }
      };
      
      // Basic template to customize
      const baseSteps: RoadmapStep[] = [
        { order: 1, label: "Learn fundamental concepts", estTime: "2-3 weeks", completed: false },
        { order: 2, label: "Complete core projects", estTime: "1 month", completed: false },
        { order: 3, label: "Build portfolio", estTime: "2 weeks", completed: false }
      ];
      
      // Generate personalized roadmap
      const customSteps = await personalizeRoadmap(
        apiKey,
        userProfile,
        "custom-career-path",
        baseSteps
      );
      
      if (!customSteps) {
        throw new Error("Failed to generate a personalized roadmap");
      }
      
      // Create a new user roadmap
      const newRoadmap: UserRoadmap = {
        id: `custom-${Date.now()}`,
        title: "My Custom Career",
        steps: customSteps.map(step => ({
          order: step.order,
          label: step.label,
          estTime: step.estTime,
          completed: false
        })),
        lastUpdated: new Date().toISOString()
      };
      
      // Save to user data
      await saveField("userRoadmap", newRoadmap);
      
      toast({
        title: "Roadmap Generated!",
        description: "Your custom career roadmap has been created successfully.",
      });
      
      // Close modal and redirect to dashboard
      onClose();
      navigate("/dashboard");
      
    } catch (error) {
      console.error("Error generating roadmap:", error);
      toast({
        title: "Generation Failed",
        description: "There was an error creating your custom roadmap. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const renderContent = () => (
    <>
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {totalSteps}
          </div>
          <div className="text-sm text-white/60">
            {Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete
          </div>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-purple-300 h-2 rounded-full transition-all"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {renderQuestion()}
      
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0 || isGenerating}
        >
          Back
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!canProceed() || isGenerating}
          className={`${currentStep === totalSteps - 1 ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600' : ''}`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : currentStep === totalSteps - 1 ? (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Roadmap
            </>
          ) : (
            <>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </>
  );
  
  if (isDialog) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] glass-morphism border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl text-gradient">Design Your Own Career Role</DialogTitle>
            <DialogDescription>
              Answer a few questions and let AI create a personalized career roadmap just for you.
            </DialogDescription>
          </DialogHeader>
          
          {renderContent()}
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="glass-morphism border-l border-white/10 w-[600px] max-w-full">
          <SheetHeader>
            <SheetTitle className="text-2xl text-gradient">Design Your Own Career Role</SheetTitle>
            <SheetDescription>
              Answer a few questions and let AI create a personalized career roadmap just for you.
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-6">
            {renderContent()}
          </div>
          
          <SheetFooter>
            {/* Footer controls are already in renderContent */}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }
}
