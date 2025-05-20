import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useGeminiContext } from "@/context/GeminiContext";
import { useGemini } from "@/lib/gemini";
import { ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const educationLevels = [
  "High School",
  "Some College",
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Ph.D. or Doctorate"
];

// Add degree/course options
const degreeOptions = [
  "Computer Science",
  "Business Administration",
  "Engineering",
  "Design",
  "Marketing",
  "Psychology",
  "Education",
  "Liberal Arts",
  "Healthcare",
  "Other"
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

const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "India",
  "Germany",
  "France",
  "Brazil",
  "Japan",
  "Other"
];

export default function CareerDesigner() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    education: "",
    degree: "", // New field for degree/course
    strongestSkill: "",
    fieldsOfInterest: "",
    workPreference: "",
    incomeRange: "",
    timeInvestment: "",
    location: ""
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { apiKey } = useGeminiContext();
  const { callGemini } = useGemini();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
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

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save your career preferences.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Update user profile with preferences
      await supabase
        .from("profiles")
        .update({
          education: formData.education,
          location: formData.location,
          degree: formData.degree // Save the degree field
        })
        .eq("id", user.id);
      
      // Generate career roadmap with Gemini - more conversational prompt
      const prompt = `You're a friendly career mentor helping a friend plan their next career move. They have this background:
      
      - Education: ${formData.education}
      - Studied: ${formData.degree}
      - Strongest skill: ${formData.strongestSkill}
      - Looking for: ${formData.workPreference} work
      - Hoping to earn: ${formData.incomeRange}
      - Can invest: ${formData.timeInvestment} in development
      - Based in: ${formData.location}
      
      Create a personalized, encouraging career roadmap that feels like advice from a supportive mentor. Include:
      
      1. A few relevant certifications they should consider
      2. 3-5 key skills to develop (be specific about tools/technologies)
      3. Where they should look for jobs in their location
      4. Realistic salary expectations at different career stages
      5. What to expect for work-life balance 
      6. Growth opportunities they can look forward to
      7. Types of companies where they'd likely thrive
      
      Format as JSON with this structure (keep descriptions concise and conversational):
      
      {
        "title": "Career Path Title",
        "overview": "Brief, encouraging overview",
        "salary": {
          "entry": "Entry level range with context",
          "mid": "Mid-level range with context",
          "senior": "Senior level range with context"
        },
        "workLifeBalance": {
          "stress": "Low/Medium/High with specifics",
          "workHours": "Typical hours with context",
          "flexibility": "Description of flexibility options"
        },
        "growthPotential": "Upbeat description of opportunities",
        "steps": [
          {
            "title": "Step 1: Short title",
            "description": "Brief, actionable advice",
            "items": ["Specific item 1", "Specific item 2"],
            "timeframe": "Realistic timeline"
          }
        ],
        "recommendedCompanies": ["Company type 1", "Company type 2"],
        "jobPlatforms": ["Specific platform 1", "Specific platform 2"]
      }`;
      
      // Call Gemini API in the background, but don't wait for it
      // This allows us to navigate the user to the matches page while the API call is processing
      callGemini(prompt, apiKey)
        .then(response => {
          if (response) {
            try {
              // Store the JSON response in localStorage for now
              // In a real app, you would store this in the database
              localStorage.setItem('careerRoadmap', response);
            } catch (error) {
              console.error("Error processing Gemini response:", error);
            }
          }
        });
      
      toast({
        title: "Career analysis complete",
        description: "Your personalized career matches are ready!",
      });
      
      navigate("/career-matches");
    } catch (error) {
      console.error("Error saving career preferences:", error);
      toast({
        title: "Error",
        description: "There was a problem saving your preferences.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      title: "Education Level",
      description: "What's your current education level?",
      field: "education",
      options: educationLevels,
    },
    {
      title: "Degree or Course",
      description: "What degree or course are you pursuing/completed?",
      field: "degree",
      options: degreeOptions,
    },
    {
      title: "Location",
      description: "Where are you currently located?",
      field: "location",
      options: countries,
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

        <Card className="mb-8 border-t-4 border-t-primary shadow-lg">
          <CardHeader className="bg-muted/50">
            <CardTitle>{currentQuestion.title}</CardTitle>
            <CardDescription>{currentQuestion.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor={currentQuestion.field}>{currentQuestion.title}</Label>
                <Select
                  value={formData[currentQuestion.field as keyof typeof formData] || ""}
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
          <CardFooter className="flex justify-between pt-4 border-t bg-muted/30">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
              Previous
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button 
                onClick={handleNext}
                disabled={!formData[currentQuestion.field as keyof typeof formData]}
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500"
                disabled={isSubmitting || !formData[currentQuestion.field as keyof typeof formData]}
              >
                {isSubmitting ? "Analyzing..." : "Submit"}
              </Button>
            )}
          </CardFooter>
        </Card>

        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
          <div
            className="h-2 bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-300"
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
