import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useGeminiContext } from "@/context/GeminiContext";
import { useGemini } from "@/lib/gemini";
import { ArrowRight, ArrowLeft, Upload, Sparkles, School, Briefcase, Globe, Clock, Code } from "lucide-react";
import { motion } from "framer-motion";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";

const educationLevels = [
  "High School",
  "Some College",
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Ph.D. or Doctorate"
];

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

const collegeTypes = [
  "Tier 1 (Elite)",
  "Tier 2 (National)",
  "Tier 3 (Regional)",
  "Community College",
  "Technical Institute",
  "No College"
];

const learningStyles = [
  "Visual",
  "Auditory",
  "Reading/Writing",
  "Kinesthetic (Hands-on)",
  "Mixed/Flexible"
];

export default function CareerDesigner() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    education: "",
    degree: "",
    strongestSkill: "",
    fieldsOfInterest: "",
    workPreference: "",
    incomeRange: "",
    timeInvestment: "",
    location: "",
    collegeType: "",
    learningStyle: ""
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedResume(file);
      
      // Read file content if it's a text file
      if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setResumeText(event.target.result as string);
          }
        };
        reader.readAsText(file);
      } else if (user) {
        // For other file types, upload to Supabase and get text later
        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          const filePath = `resumes/${fileName}`;
          
          // Upload to the career-documents bucket
          const { data, error } = await supabase.storage
            .from('career-documents')
            .upload(filePath, file);
            
          if (error) {
            throw error;
          }
          
          setResumeText("Resume uploaded. We'll use it to enhance your career recommendations.");
          
          // For non-text files, just acknowledge the upload
          toast({
            title: "Resume uploaded",
            description: "Your resume has been successfully uploaded and will be used for personalized recommendations",
          });
        } catch (error: any) {
          console.error("Error uploading resume:", error);
          toast({
            variant: "destructive",
            title: "Upload failed",
            description: error.message || "There was a problem uploading your resume."
          });
        }
      }
    }
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
          degree: formData.degree
        })
        .eq("id", user.id);
      
      // Enhanced prompt for Gemini that includes all new fields
      const prompt = `You're a career mentor helping create a personalized roadmap. Here's the background:
      
      - Education: ${formData.education}
      - Field of study: ${formData.degree}
      - Strongest skill: ${formData.strongestSkill}
      - Field of interest: ${formData.fieldsOfInterest}
      - Work preference: ${formData.workPreference}
      - Target income: ${formData.incomeRange}
      - Time commitment: ${formData.timeInvestment}
      - Location: ${formData.location}
      - College type: ${formData.collegeType}
      - Learning style: ${formData.learningStyle}
      ${resumeText ? `- Resume details: ${resumeText}` : ''}
      
      Generate a personalized career roadmap with:
      
      1. Suggested Career Path (role + brief reason why this fits them)
      2. Skill Roadmap (chronological skill-building plan)
      3. Online Courses/Certifications with specific platforms
      4. Tools to Learn (with priority order)
      5. Internship/Job Hunting Tips tailored to their background
      6. Community Recommendations (online forums, groups, meetups)
      7. Estimated Timeframe to reach job-ready level
      8. An encouraging message at the end
      
      Format as JSON with this structure:
      
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
        "recommendedCommunities": ["Community 1", "Community 2"],
        "jobPlatforms": ["Platform 1", "Platform 2"]
      }`;
      
      // Call Gemini API
      callGemini(prompt, apiKey)
        .then(response => {
          if (response) {
            try {
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
      title: "Education Background",
      description: "Let's start with your educational foundation",
      field: "education",
      options: educationLevels,
      icon: <School className="h-6 w-6 text-brand-400" />
    },
    {
      title: "Field of Study",
      description: "What degree or course are you pursuing/completed?",
      field: "degree",
      options: degreeOptions,
      icon: <School className="h-6 w-6 text-brand-400" />
    },
    {
      title: "College Type",
      description: "What type of institution did you attend?",
      field: "collegeType",
      options: collegeTypes,
      icon: <School className="h-6 w-6 text-brand-400" />
    },
    {
      title: "Learning Style",
      description: "How do you learn most effectively?",
      field: "learningStyle",
      options: learningStyles,
      icon: <Sparkles className="h-6 w-6 text-brand-400" />
    },
    {
      title: "Location",
      description: "Where are you currently based?",
      field: "location",
      options: countries,
      icon: <Globe className="h-6 w-6 text-brand-400" />
    },
    {
      title: "Strongest Skill",
      description: "What skill do you consider your strongest?",
      field: "strongestSkill",
      options: skillSets,
      icon: <Code className="h-6 w-6 text-brand-400" />
    },
    {
      title: "Field of Interest",
      description: "Which field interests you the most?",
      field: "fieldsOfInterest", 
      options: fields,
      icon: <Briefcase className="h-6 w-6 text-brand-400" />
    },
    {
      title: "Work Preference",
      description: "Do you prefer remote or on-site work?",
      field: "workPreference",
      options: workPreferences,
      icon: <Briefcase className="h-6 w-6 text-brand-400" />
    },
    {
      title: "Expected Income",
      description: "What's your expected income range?",
      field: "incomeRange",
      options: incomeRanges,
      icon: <Briefcase className="h-6 w-6 text-brand-400" />
    },
    {
      title: "Time Investment",
      description: "How much time can you invest weekly in your career development?",
      field: "timeInvestment",
      options: timeInvestments,
      icon: <Clock className="h-6 w-6 text-brand-400" />
    },
    {
      title: "Resume Upload",
      description: "Upload your resume for more personalized recommendations",
      field: "resume",
      icon: <Upload className="h-6 w-6 text-brand-400" />
    },
  ];

  const currentQuestion = steps[currentStep];
  const progress = (currentStep / (steps.length - 1)) * 100;

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-300 via-brand-400 to-purple-400 neon-purple-text">Design Your Career 🚀</h1>
          <p className="text-xl text-white/70 mt-2">Your personalized career path starts here</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <Card className="border-t-4 border-t-primary shadow-lg backdrop-blur-xl bg-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.12),0_0_20px_rgba(168,85,247,0.2)]">
            <CardHeader className="bg-gradient-to-r from-brand-900/50 to-cyber-dark/50 rounded-t-xl border-b border-white/10">
              <div className="flex items-center">
                {currentQuestion.icon}
                <div className="ml-3">
                  <CardTitle className="text-2xl font-bold text-white">{currentQuestion.title}</CardTitle>
                  <CardDescription className="text-white/80 text-lg">{currentQuestion.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-8 pb-6">
              {currentQuestion.field === "resume" ? (
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-brand-400/50 transition-all cursor-pointer" 
                       onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-12 w-12 mx-auto text-brand-400 mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">Upload Your Resume</h3>
                    <p className="text-white/70">
                      {uploadedResume 
                        ? `${uploadedResume.name} uploaded successfully` 
                        : "Drag and drop your resume here, or click to browse"}
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                  
                  {uploadedResume && (
                    <div className="p-4 rounded-lg bg-brand-400/10 border border-brand-400/30">
                      <p className="text-white/90 flex items-center">
                        <Check className="h-5 w-5 mr-2 text-green-400" />
                        Resume uploaded successfully
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid w-full items-center gap-2.5">
                    <Label htmlFor={currentQuestion.field} className="text-xl font-medium text-white">
                      {currentQuestion.title}
                    </Label>
                    <Select
                      value={formData[currentQuestion.field as keyof typeof formData] || ""}
                      onValueChange={(value) => handleSelectChange(currentQuestion.field, value)}
                    >
                      <SelectTrigger className="w-full h-14 text-lg glass-input">
                        <SelectValue 
                          placeholder={`Select your ${currentQuestion.title.toLowerCase()}`} 
                          className="text-white/70"
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-brand-900/90 backdrop-blur-xl border border-white/20 text-white">
                        {currentQuestion.options.map((option) => (
                          <SelectItem 
                            key={option} 
                            value={option}
                            className="text-white hover:bg-brand-400/30 focus:bg-brand-400/30"
                          >
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between pt-6 pb-6 border-t border-white/10 bg-gradient-to-r from-brand-900/40 to-cyber-dark/40">
              <Button 
                variant="outline" 
                onClick={handlePrevious} 
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              
              {currentStep < steps.length - 1 ? (
                <Button 
                  onClick={handleNext}
                  disabled={currentQuestion.field !== "resume" && !formData[currentQuestion.field as keyof typeof formData]}
                  className="bg-gradient-to-r from-brand-400 to-purple-600 hover:from-brand-400/90 hover:to-purple-600/90 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  className="bg-gradient-to-r from-brand-400 to-purple-600 hover:from-brand-400/90 hover:to-purple-600/90 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2">Analyzing...</span>
                      <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                    </>
                  ) : (
                    <>
                      <span>Generate My Career Path</span>
                      <Sparkles className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>

        <div className="mt-8">
          <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
            <motion.div
              className="h-3 bg-gradient-to-r from-brand-400 to-purple-500 rounded-full"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between mt-2 text-white/60">
            <p>Step {currentStep + 1} of {steps.length}</p>
            <p>{Math.round(progress)}% complete</p>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}

// Missing import
function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
