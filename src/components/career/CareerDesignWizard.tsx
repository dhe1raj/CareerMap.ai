
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import { useGeminiContext } from "@/context/GeminiContext";
import { useGemini } from "@/lib/gemini";
import { Badge } from "@/components/ui/badge";

interface WizardFormData {
  status: string;
  institution: string;
  educationLevel: string;
  skills: string[];
  dreamRoles: string[];
  industries: string[];
  weeklyHours: string;
  learningStyle: string;
}

export interface GeneratedRoadmap {
  title: string;
  steps: {
    order: number;
    label: string;
    estTime: string;
    completed: boolean;
    resource?: string;
  }[];
}

interface CareerDesignWizardProps {
  onComplete: (roadmap: GeneratedRoadmap) => void;
  onCancel: () => void;
}

export default function CareerDesignWizard({ onComplete, onCancel }: CareerDesignWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<WizardFormData>({
    status: "",
    institution: "",
    educationLevel: "",
    skills: [],
    dreamRoles: [],
    industries: [],
    weeklyHours: "",
    learningStyle: ""
  });
  
  const { toast } = useToast();
  const { apiKey } = useGeminiContext();
  const { callGemini } = useGemini();
  
  const totalSteps = 8;
  
  const handleTextChange = (field: keyof WizardFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleArrayFieldChange = (field: keyof WizardFormData, value: string) => {
    if (Array.isArray(formData[field])) {
      // Convert comma-separated string to array
      const itemsArray = value.split(',').map(item => item.trim()).filter(item => item !== '');
      setFormData((prev) => ({ ...prev, [field]: itemsArray }));
    }
  };
  
  const handleAddSkill = (skill: string) => {
    if (!skill.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, skill.trim()]
    }));
  };
  
  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };
  
  const handleNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      generateRoadmap();
    }
  };
  
  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const generateRoadmap = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please add your Gemini API key in settings to continue.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const prompt = `
Create a personalized career roadmap for a user with the following profile:
- Status: ${formData.status}
- Educational Institution: ${formData.institution}
- Education Level: ${formData.educationLevel}
- Skills: ${formData.skills.join(', ')}
- Dream Roles: ${formData.dreamRoles.join(', ')}
- Preferred Industries: ${formData.industries.join(', ')}
- Weekly Hours for Learning: ${formData.weeklyHours}
- Preferred Learning Style: ${formData.learningStyle}

Create a step-by-step roadmap with the following structure:
1. Choose a specific career title based on their dream roles and industry preferences
2. Provide 8-12 sequential steps to reach their goal
3. Each step should have a label, estimated time to complete, and an optional resource link

Format the response as a valid JSON object with this exact structure:
{
  "title": "Career Title",
  "steps": [
    {
      "order": 1,
      "label": "Step description",
      "estTime": "Estimated time (e.g., 2 weeks)",
      "completed": false,
      "resource": "Optional URL to a learning resource"
    }
  ]
}

Make the roadmap realistic, practical, and tailored to their current status and skills.
`;
      
      const response = await callGemini(prompt, apiKey);
      
      if (!response) {
        throw new Error("Failed to generate roadmap");
      }
      
      // Try to extract the JSON object from the response
      try {
        // Look for JSON structure in the response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const roadmapData = JSON.parse(jsonMatch[0]) as GeneratedRoadmap;
          
          // Validate the response structure
          if (!roadmapData.title || !Array.isArray(roadmapData.steps) || roadmapData.steps.length === 0) {
            throw new Error("Invalid roadmap data structure");
          }
          
          // Add the completed property if it's missing
          const processedSteps = roadmapData.steps.map(step => ({
            ...step,
            completed: step.completed || false
          }));
          
          const finalRoadmap = {
            ...roadmapData,
            steps: processedSteps
          };
          
          onComplete(finalRoadmap);
          
          toast({
            title: "Roadmap Generated",
            description: "Your custom career roadmap has been created successfully!",
          });
        } else {
          throw new Error("Could not extract JSON from response");
        }
      } catch (parseError) {
        console.error("Error parsing roadmap data:", parseError);
        toast({
          title: "Error",
          description: "Could not parse the generated roadmap. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error generating roadmap:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate your roadmap. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="glass-morphism border-primary/20 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600/10 to-indigo-600/5 border-b border-white/10">
          <CardTitle className="text-2xl font-bold">Design Your Own Career Role</CardTitle>
          <CardDescription>
            Answer a few questions to get a personalized career roadmap
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-4">
          <div className="flex justify-between mb-6">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index + 1 <= step
                    ? "bg-primary w-[12%]"
                    : "bg-white/20 w-[10%]"
                }`}
              />
            ))}
          </div>
          
          {/* Step 1: Working Status */}
          {step === 1 && (
            <div className="space-y-4 fade-in">
              <h3 className="text-xl font-medium">Are you a student or working professional?</h3>
              <RadioGroup
                value={formData.status}
                onValueChange={(value) => handleTextChange("status", value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="working" id="working" />
                  <Label htmlFor="working">Working Professional</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both">Both (Working Student)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="neither" id="neither" />
                  <Label htmlFor="neither">Neither (Career Switcher)</Label>
                </div>
              </RadioGroup>
            </div>
          )}
          
          {/* Step 2: Educational Institution */}
          {step === 2 && (
            <div className="space-y-4 fade-in">
              <h3 className="text-xl font-medium">Which college/university are you from?</h3>
              <Select 
                value={formData.institution} 
                onValueChange={(value) => handleTextChange("institution", value)}
              >
                <SelectTrigger className="glass-input">
                  <SelectValue placeholder="Select educational institution tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tier1">Tier 1 (Top Universities)</SelectItem>
                  <SelectItem value="tier2">Tier 2 (Mid-level Universities)</SelectItem>
                  <SelectItem value="tier3">Tier 3 (Other Accredited Institutions)</SelectItem>
                  <SelectItem value="ivy">Ivy League / Top Global Universities</SelectItem>
                  <SelectItem value="nontarget">Non-target School</SelectItem>
                  <SelectItem value="selfTaught">Self-taught / No formal education</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Step 3: Education Level */}
          {step === 3 && (
            <div className="space-y-4 fade-in">
              <h3 className="text-xl font-medium">Your degree and course?</h3>
              <Input
                placeholder="e.g., BTech CSE, BA Economics, MBA Finance"
                value={formData.educationLevel}
                onChange={(e) => handleTextChange("educationLevel", e.target.value)}
                className="glass-input"
              />
              <p className="text-sm text-white/60">
                Share your highest degree or current course of study
              </p>
            </div>
          )}
          
          {/* Step 4: Skills */}
          {step === 4 && (
            <div className="space-y-4 fade-in">
              <h3 className="text-xl font-medium">Tech stacks or skills you already know?</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.skills.map((skill, index) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="px-3 py-1 cursor-pointer hover:bg-primary/20"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    {skill} <span className="ml-1">×</span>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Type a skill and press enter"
                  className="glass-input"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const target = e.target as HTMLInputElement;
                      handleAddSkill(target.value);
                      target.value = '';
                    }
                  }}
                />
              </div>
              <p className="text-sm text-white/60">
                Click on a skill to remove it. Enter skills one at a time and press Enter.
              </p>
            </div>
          )}
          
          {/* Step 5: Dream Roles */}
          {step === 5 && (
            <div className="space-y-4 fade-in">
              <h3 className="text-xl font-medium">What are your dream job roles?</h3>
              <Textarea
                placeholder="e.g., ML Engineer, Cyber Analyst, Data Scientist (comma-separated)"
                value={formData.dreamRoles.join(', ')}
                onChange={(e) => handleArrayFieldChange("dreamRoles", e.target.value)}
                className="glass-input min-h-[120px]"
              />
              <p className="text-sm text-white/60">
                Separate multiple roles with commas
              </p>
            </div>
          )}
          
          {/* Step 6: Industries */}
          {step === 6 && (
            <div className="space-y-4 fade-in">
              <h3 className="text-xl font-medium">Preferred domain or industries?</h3>
              <Textarea
                placeholder="e.g., Healthcare, Fintech, E-commerce (comma-separated)"
                value={formData.industries.join(', ')}
                onChange={(e) => handleArrayFieldChange("industries", e.target.value)}
                className="glass-input min-h-[120px]"
              />
              <p className="text-sm text-white/60">
                Separate multiple industries with commas
              </p>
            </div>
          )}
          
          {/* Step 7: Time Commitment */}
          {step === 7 && (
            <div className="space-y-4 fade-in">
              <h3 className="text-xl font-medium">Time you can invest weekly in learning?</h3>
              <Select 
                value={formData.weeklyHours} 
                onValueChange={(value) => handleTextChange("weeklyHours", value)}
              >
                <SelectTrigger className="glass-input">
                  <SelectValue placeholder="Select weekly hours" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-5">1-5 hours/week (Minimal)</SelectItem>
                  <SelectItem value="5-10">5-10 hours/week (Part-time)</SelectItem>
                  <SelectItem value="10-20">10-20 hours/week (Dedicated)</SelectItem>
                  <SelectItem value="20+">20+ hours/week (Full-time)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Step 8: Learning Style */}
          {step === 8 && (
            <div className="space-y-4 fade-in">
              <h3 className="text-xl font-medium">Do you prefer video, text, or project-based learning?</h3>
              <RadioGroup
                value={formData.learningStyle}
                onValueChange={(value) => handleTextChange("learningStyle", value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="video" />
                  <Label htmlFor="video">Video Courses</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="text" id="text" />
                  <Label htmlFor="text">Text-based Learning (Books, Docs)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="project" id="project" />
                  <Label htmlFor="project">Project-based Learning</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mixed" id="mixed" />
                  <Label htmlFor="mixed">Mixed Learning Style</Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t border-white/10 bg-gradient-to-r from-purple-600/5 to-indigo-600/10 p-6">
          {step > 1 ? (
            <Button 
              variant="outline" 
              onClick={handlePrevStep}
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          
          <Button 
            variant={step === totalSteps ? "default" : "outline"}
            onClick={handleNextStep}
            disabled={loading}
            className={`flex items-center ${step === totalSteps ? "bg-primary hover:bg-primary/90" : ""}`}
          >
            {step === totalSteps ? (
              <>
                {loading ? (
                  "Generating..."
                ) : (
                  <>
                    Generate My Career Roadmap
                    <Sparkles className="h-4 w-4 ml-2" />
                  </>
                )}
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
