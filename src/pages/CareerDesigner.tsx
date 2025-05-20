
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const educationLevels = [
  "High School",
  "Some College",
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Ph.D. or Doctorate"
];

const skillSets = [
  "Programming / Coding",
  "Design",
  "Problem Solving",
  "Analysis",
  "Communication",
  "Writing",
  "Leadership",
  "Organization"
];

const fields = [
  "Software Development",
  "AI / Machine Learning",
  "Cybersecurity",
  "Data Science",
  "UX/UI Design",
  "Project Management",
  "Digital Marketing",
  "Business Analysis"
];

const workPreferences = [
  "Remote only",
  "Hybrid",
  "On-site",
  "Flexible",
  "No preference"
];

const incomeRanges = [
  "$30,000 - $50,000",
  "$50,000 - $70,000",
  "$70,000 - $100,000",
  "$100,000 - $130,000",
  "$130,000+"
];

const timeInvestments = [
  "Less than 10 hours/week",
  "10-20 hours/week", 
  "20-30 hours/week",
  "30-40 hours/week",
  "40+ hours/week"
];

export default function CareerDesigner() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    education: "",
    strongestSkill: "",
    fieldsOfInterest: "",
    workPreference: "",
    incomeRange: "",
    timeInvestment: ""
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // In a real app, we would send the data to a backend for processing
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Career analysis complete",
        description: "Your personalized career matches are ready!",
      });
      navigate("/career-matches");
    }, 2000);
  };

  const steps = [
    {
      title: "Education Level",
      description: "What's your current education level?",
      field: "education",
      options: educationLevels,
    },
    {
      title: "Strongest Skill",
      description: "What skill do you consider your strongest?",
      field: "strongestSkill",
      options: skillSets,
    },
    {
      title: "Field of Interest",
      description: "Which field interests you the most?",
      field: "fieldsOfInterest",
      options: fields,
    },
    {
      title: "Work Preference",
      description: "Do you prefer remote or on-site work?",
      field: "workPreference",
      options: workPreferences,
    },
    {
      title: "Expected Income",
      description: "What's your expected income range?",
      field: "incomeRange",
      options: incomeRanges,
    },
    {
      title: "Time Investment",
      description: "How much time can you invest weekly in your career development?",
      field: "timeInvestment",
      options: timeInvestments,
    },
  ];

  const currentQuestion = steps[currentStep];
  const progress = (currentStep / (steps.length - 1)) * 100;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Design Your Career</h1>
          <p className="text-muted-foreground">
            Answer these questions to help us find your ideal career match
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{currentQuestion.title}</CardTitle>
            <CardDescription>{currentQuestion.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor={currentQuestion.field}>{currentQuestion.title}</Label>
                <Select
                  value={formData[currentQuestion.field as keyof typeof formData]}
                  onValueChange={(value) => handleSelectChange(currentQuestion.field, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Select your ${currentQuestion.title.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {currentQuestion.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
              Previous
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button 
                onClick={handleNext}
                disabled={!formData[currentQuestion.field as keyof typeof formData]}
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || !formData[currentQuestion.field as keyof typeof formData]}
              >
                {isSubmitting ? "Analyzing..." : "Submit"}
              </Button>
            )}
          </CardFooter>
        </Card>

        <div className="w-full bg-muted h-2 rounded-full">
          <div
            className="h-2 bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Question {currentStep + 1} of {steps.length}
        </p>
      </div>
    </DashboardLayout>
  );
}
