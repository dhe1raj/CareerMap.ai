import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ArrowRight, Upload, FileText, BookOpen, DollarSign, Briefcase, BookMarked, GraduationCap, Clock, BarChart3 } from "lucide-react";
import { useGeminiContext } from "@/context/GeminiContext";
import { useGemini } from "@/lib/gemini";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// Questions and options data
const collegeOptions = [
  { value: "ivy", label: "Ivy League or Top IIT/NIT (God Tier)" },
  { value: "target", label: "Target College (Decent placement + exposure)" },
  { value: "non_target", label: "Non-Target (Mid, but I'll hustle)" },
  { value: "tier3", label: "Tier 3 (No support but I'm not giving up)" },
  { value: "dropout", label: "I dropped out / planning to drop out" },
  { value: "pre_college", label: "Not in college yet" },
];

const placementOptions = [
  { value: "mass", label: "Mass recruiters mostly" },
  { value: "core", label: "A few core companies" },
  { value: "no_placement", label: "No proper placement cell" },
  { value: "unsure", label: "Not sure" },
  { value: "networking", label: "Don't care — I'll network my way in" },
];

const gamePlanOptions = [
  { value: "college_placement", label: "Get placed via college" },
  { value: "off_campus", label: "Crack off-campus roles" },
  { value: "portfolio", label: "Build portfolio & apply cold" },
  { value: "abroad", label: "Study abroad" },
  { value: "business", label: "Start a business / freelance" },
  { value: "figuring", label: "Still figuring it out" },
];

const grindOptions = [
  { value: "whatever_it_takes", label: "I'll do whatever it takes" },
  { value: "weekends", label: "Only weekends please" },
  { value: "fun", label: "I'll do it if it's fun" },
  { value: "procrastinating", label: "Still stuck in procrastination loop" },
  { value: "grinding", label: "Already grinding!" },
];

const workOptions = [
  { value: "big_tech", label: "Big Tech (FAANG, etc.)" },
  { value: "startup", label: "Cool startup culture" },
  { value: "remote", label: "Remote global gigs" },
  { value: "government", label: "Government sector" },
  { value: "ngo", label: "NGO / Impact work" },
  { value: "any", label: "As long as it pays — I'm good" },
];

const detourOptions = [
  { value: "yes", label: "Yes, I don't care as long as I get there" },
  { value: "no", label: "Nope, I want a direct route" },
  { value: "unsure", label: "Unsure — what does that even mean?" },
];

const interestOptions = [
  { value: "build", label: "Build apps or tools" },
  { value: "design", label: "Make aesthetic posts or videos" },
  { value: "solve", label: "Solve puzzles or bugs" },
  { value: "teach", label: "Help people understand stuff" },
  { value: "communicate", label: "Talk to new people or present" },
  { value: "research", label: "Read, write, or research" },
];

const levelOptions = [
  { value: "exploring", label: "Still learning, just exploring" },
  { value: "basics", label: "I know basics" },
  { value: "build", label: "Can build real stuff" },
  { value: "internship", label: "Already doing internships/freelance" },
  { value: "offers", label: "Got job offers" },
];

const countryOptions = [
  { value: "india", label: "India" },
  { value: "north_america", label: "USA / Canada" },
  { value: "europe", label: "Germany / Europe" },
  { value: "remote", label: "Remote only" },
  { value: "anywhere", label: "Anywhere, just want good vibes" },
];

export default function GenZCareerDecider() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { apiKey } = useGeminiContext();
  const { callGemini } = useGemini();
  
  // Current section/step
  const [currentSection, setCurrentSection] = useState<number>(1);
  
  // Form state
  const [formData, setFormData] = useState({
    // Section 1: Real Talk
    college: "",
    placement: "",
    gamePlan: "",
    
    // Section 2: Hype & Hustle
    grindLevel: "",
    workPlace: "",
    detours: "",
    
    // Section 3: Skills & Interests
    interests: [] as string[],
    currentLevel: "",
    preferredCountry: "",
    
    // Section 4: Resume
    resumeText: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string | null>(null);
  const [parsedResults, setParsedResults] = useState<any>(null);
  
  // Handler to update form data
  const handleChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  // Handler for interests (multiple selection)
  const handleInterestToggle = (interest: string) => {
    setFormData(prev => {
      const currentInterests = [...prev.interests];
      
      if (currentInterests.includes(interest)) {
        return {
          ...prev,
          interests: currentInterests.filter(i => i !== interest),
        };
      } else {
        // Limit to max 3 selections
        if (currentInterests.length < 3) {
          return {
            ...prev,
            interests: [...currentInterests, interest],
          };
        }
        return prev;
      }
    });
  };
  
  // Navigate to next section
  const handleNext = () => {
    if (currentSection < 5) {
      setCurrentSection(currentSection + 1);
    }
  };
  
  // Navigate to previous section
  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };
  
  // Handle resume text input
  const handleResumeTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      resumeText: e.target.value,
    }));
  };
  
  // Attempt to parse the Gemini results into structured data
  const tryParseResults = (text: string) => {
    try {
      // Look for career roles
      const careerRoles = extractSection(text, "career roles", "why it suits");
      const whySuits = extractSection(text, "why it suits", "skills");
      const skillsToAdd = extractSection(text, "skills", "companies");
      const companies = extractSection(text, "companies", "roadmap");
      const roadmap = extractSection(text, "roadmap", "");
      
      return {
        careerRoles,
        whySuits,
        skillsToAdd,
        companies,
        roadmap
      };
    } catch (e) {
      console.error("Failed to parse results:", e);
      return null;
    }
  };
  
  // Helper function to extract a section from text
  const extractSection = (text: string, startMarker: string, endMarker: string): string[] => {
    try {
      const lowerText = text.toLowerCase();
      const startIdx = lowerText.indexOf(startMarker);
      
      if (startIdx === -1) return [];
      
      let endIdx = lowerText.length;
      if (endMarker && lowerText.indexOf(endMarker) > startIdx) {
        endIdx = lowerText.indexOf(endMarker, startIdx);
      }
      
      const section = text.substring(startIdx, endIdx).trim();
      
      // Extract bullet points
      const bulletPoints = section.split(/\n-|\n•|\n\*/).slice(1).map(item => item.trim()).filter(Boolean);
      return bulletPoints.length > 0 ? bulletPoints : [section];
    } catch (e) {
      return [];
    }
  };
  
  // Submit form and get AI suggestions
  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      const collegeLabel = collegeOptions.find(o => o.value === formData.college)?.label || formData.college;
      const placementLabel = placementOptions.find(o => o.value === formData.placement)?.label || formData.placement;
      const gamePlanLabel = gamePlanOptions.find(o => o.value === formData.gamePlan)?.label || formData.gamePlan;
      const grindLabel = grindOptions.find(o => o.value === formData.grindLevel)?.label || formData.grindLevel;
      const workLabel = workOptions.find(o => o.value === formData.workPlace)?.label || formData.workPlace;
      const detourLabel = detourOptions.find(o => o.value === formData.detours)?.label || formData.detours;
      const levelLabel = levelOptions.find(o => o.value === formData.currentLevel)?.label || formData.currentLevel;
      const countryLabel = countryOptions.find(o => o.value === formData.preferredCountry)?.label || formData.preferredCountry;
      
      const interestLabels = formData.interests.map(interest => {
        const option = interestOptions.find(o => o.value === interest);
        return option ? option.label : interest;
      }).join(", ");
      
      const prompt = `Hey there! I'm your career mentor - someone who genuinely gets the Gen Z vibe. Let's chat about your career options based on what you've shared.

Based on your profile, I'll recommend:
- 3-4 career paths that would actually fit your vibe and skills
- Why I honestly think they'd work for you (keeping it real)
- Specific tools and skills worth picking up (no vague advice)
- Places to apply that make sense for someone like you
- What your next 6-12 months could look like (realistic steps)

What I know about you:
- College situation: ${collegeLabel}
- Placement scene: ${placementLabel}
- Your current plan: ${gamePlanLabel}
- Your hustle level: ${grindLabel}
- Work vibe you want: ${workLabel}
- Flexibility on your path: ${detourLabel}
- What you enjoy: ${interestLabels}
- Where you're at now: ${levelLabel}
- Where you want to be: ${countryLabel}
${formData.resumeText ? `- From your resume: ${formData.resumeText}` : ''}

Keep your response short, focused and super easy to scan. Write like you're texting a friend - conversational but helpful. Use bullets and short paragraphs. 

Include these sections with clear headings:
- CAREER ROLES (3-4 options that actually match)
- WHY IT SUITS YOU (brief, honest take)
- SKILLS TO ADD (specific tools, not generic advice)
- COMPANIES & INTERNSHIPS (realistic options)
- ROADMAP (simple next steps)

For each career path, also tell me:
- Realistic salary range in their location
- What the day-to-day life actually feels like
- Growth potential in plain language
- Whether remote work is actually possible`;

      // Call Gemini API
      const response = await callGemini(prompt, apiKey);
      
      if (response) {
        setResults(response);
        
        // Try to parse structured data from the response
        const parsed = tryParseResults(response);
        if (parsed) {
          setParsedResults(parsed);
        }
        
        toast({
          title: "Career paths generated! 🚀",
          description: "Check out your personalized career suggestions below.",
        });
        
        // Save results to localStorage for now
        localStorage.setItem("genZ_career_results", response);
      } else {
        toast({
          title: "Error",
          description: "Failed to generate career suggestions. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating career suggestions:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check if current section is valid
  const isCurrentSectionValid = () => {
    switch(currentSection) {
      case 1:
        return !!formData.college && !!formData.placement && !!formData.gamePlan;
      case 2:
        return !!formData.grindLevel && !!formData.workPlace && !!formData.detours;
      case 3:
        return formData.interests.length > 0 && formData.interests.length <= 3 && !!formData.currentLevel && !!formData.preferredCountry;
      case 4:
        // Resume section is optional
        return true;
      default:
        return false;
    }
  };
  
  // Reset the form and results
  const handleReset = () => {
    setFormData({
      college: "",
      placement: "",
      gamePlan: "",
      grindLevel: "",
      workPlace: "",
      detours: "",
      interests: [],
      currentLevel: "",
      preferredCountry: "",
      resumeText: "",
    });
    setResults(null);
    setCurrentSection(1);
  };

  // Function to get a random gradient for career role cards
  const getRandomGradient = (index: number) => {
    const gradients = [
      "from-purple-500 to-indigo-500",
      "from-blue-500 to-teal-400",
      "from-pink-500 to-purple-500",
      "from-amber-500 to-red-500",
      "from-green-500 to-emerald-500"
    ];
    return gradients[index % gradients.length];
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Gen Z Career Role Decider</h1>
          <p className="text-muted-foreground">
            Be real with us, and we'll match you with career paths that actually vibe with you
          </p>
        </div>
        
        {!results ? (
          <Card className="border-t-4 border-t-primary shadow-md">
            <CardHeader className="bg-muted/30">
              <CardTitle>
                {currentSection === 1 && "Real Talk (College & Plans)"}
                {currentSection === 2 && "Hype & Hustle Check"}
                {currentSection === 3 && "Skills, Interests, and Style"}
                {currentSection === 4 && "Resume & Reality Check (Optional)"}
              </CardTitle>
              <CardDescription>
                {currentSection === 1 && "Let's start with your current education situation"}
                {currentSection === 2 && "How hard are you willing to work?"}
                {currentSection === 3 && "What do you actually enjoy doing?"}
                {currentSection === 4 && "Add your resume for more tailored suggestions"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 pt-6">
              {/* Section 1: Real Talk */}
              {currentSection === 1 && (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="college">Be honest — how would you rate your current college?</Label>
                      <Select value={formData.college} onValueChange={(value) => handleChange("college", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your college tier" />
                        </SelectTrigger>
                        <SelectContent>
                          {collegeOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="placement">What kind of job placement does your college offer?</Label>
                      <Select value={formData.placement} onValueChange={(value) => handleChange("placement", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select placement situation" />
                        </SelectTrigger>
                        <SelectContent>
                          {placementOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gamePlan">What's your current game plan?</Label>
                      <Select value={formData.gamePlan} onValueChange={(value) => handleChange("gamePlan", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your strategy" />
                        </SelectTrigger>
                        <SelectContent>
                          {gamePlanOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
              
              {/* Section 2: Hype & Hustle */}
              {currentSection === 2 && (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="grindLevel">How ready are you to grind?</Label>
                      <Select value={formData.grindLevel} onValueChange={(value) => handleChange("grindLevel", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your grind level" />
                        </SelectTrigger>
                        <SelectContent>
                          {grindOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="workPlace">Where do you see yourself working?</Label>
                      <Select value={formData.workPlace} onValueChange={(value) => handleChange("workPlace", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your ideal workplace" />
                        </SelectTrigger>
                        <SelectContent>
                          {workOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="detours">Are you okay with taking detours?</Label>
                      <Select value={formData.detours} onValueChange={(value) => handleChange("detours", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your flexibility" />
                        </SelectTrigger>
                        <SelectContent>
                          {detourOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
              
              {/* Section 3: Skills & Interests */}
              {currentSection === 3 && (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Pick 2-3 things you'd do even if no one paid you</Label>
                      <p className="text-sm text-muted-foreground mb-2">Selected: {formData.interests.length}/3</p>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {interestOptions.map(option => (
                          <Button 
                            key={option.value}
                            type="button"
                            variant={formData.interests.includes(option.value) ? "default" : "outline"}
                            className={`justify-start text-left ${formData.interests.includes(option.value) ? "" : "hover:bg-accent"}`}
                            onClick={() => handleInterestToggle(option.value)}
                            disabled={!formData.interests.includes(option.value) && formData.interests.length >= 3}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currentLevel">What's your current level?</Label>
                      <Select value={formData.currentLevel} onValueChange={(value) => handleChange("currentLevel", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          {levelOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="preferredCountry">Preferred country for future roles or study?</Label>
                      <Select value={formData.preferredCountry} onValueChange={(value) => handleChange("preferredCountry", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your preferred location" />
                        </SelectTrigger>
                        <SelectContent>
                          {countryOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
              
              {/* Section 4: Resume */}
              {currentSection === 4 && (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="resumeText">Paste your resume text (optional)</Label>
                      <Textarea
                        id="resumeText"
                        placeholder="Copy and paste your resume text here for more tailored suggestions..."
                        rows={8}
                        value={formData.resumeText}
                        onChange={handleResumeTextChange}
                        className="border-dashed"
                      />
                      <p className="text-xs text-muted-foreground">
                        This helps us provide more accurate career suggestions based on your existing skills.
                      </p>
                    </div>
                    
                    <div className="mt-6">
                      <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing your profile...
                          </>
                        ) : (
                          <>
                            Generate My Career Paths
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between bg-muted/20 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentSection === 1}
              >
                Previous
              </Button>
              
              {currentSection < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={!isCurrentSectionValid()}
                >
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => setCurrentSection(1)}
                  disabled={isLoading}
                >
                  Back to start
                </Button>
              )}
            </CardFooter>
          </Card>
        ) : (
          // Results Display with improved styling
          <div>
            <Tabs defaultValue="overview" className="mb-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Career Paths</TabsTrigger>
                <TabsTrigger value="skills">Skills to Add</TabsTrigger>
                <TabsTrigger value="companies">Companies</TabsTrigger>
                <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="bg-muted/30">
                    <CardTitle className="flex items-center">
                      <GraduationCap className="mr-2 h-5 w-5 text-primary" />
                      Your Gen Z Career Analysis
                    </CardTitle>
                    <CardDescription>
                      Career paths that match your vibe and skills
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {parsedResults?.careerRoles?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {parsedResults.careerRoles.map((role: string, index: number) => (
                          <div 
                            key={index}
                            className={`p-5 rounded-lg text-white bg-gradient-to-br ${getRandomGradient(index)}`}
                          >
                            <h3 className="font-bold text-lg mb-2">{role.split(':')[0]}</h3>
                            <p>{role.split(':').slice(1).join(':')}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Why These Careers Suit You</h3>
                        <div className="prose max-w-none">
                          {parsedResults?.whySuits?.map((reason: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2 mb-2">
                              <div className="mt-1 text-primary">•</div>
                              <p>{reason}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden">
                  <CardHeader className="bg-muted/30">
                    <CardTitle>Full AI Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="prose prose-sm max-w-none bg-muted/10 p-4 rounded-md border border-dashed overflow-auto max-h-[600px]">
                      {results.split('\n').map((line, index) => {
                        // Add special styling to headings
                        if (line.toUpperCase() === line && line.length > 0) {
                          return <h3 key={index} className="text-primary font-bold mt-4">{line}</h3>;
                        }
                        // Highlight emoji sections
                        if (line.match(/^[•\-*]|\p{Emoji}/u)) {
                          return (
                            <div key={index} className="flex items-start gap-2 ml-2">
                              <span>{line.startsWith('-') ? '•' : line.charAt(0)}</span>
                              <p>{line.substring(1)}</p>
                            </div>
                          );
                        }
                        return line.length > 0 ? <p key={index} className="mb-1">{line}</p> : <br key={index} />;
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="skills" className="mt-4">
                <Card>
                  <CardHeader className="bg-muted/30">
                    <CardTitle className="flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
                      Skills You Need to Add
                    </CardTitle>
                    <CardDescription>
                      Tools and technologies to learn for your career path
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(parsedResults?.skillsToAdd || []).map((skill: string, index: number) => (
                        <div key={index} className="p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors duration-200">
                          <p>{skill}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="companies" className="mt-4">
                <Card>
                  <CardHeader className="bg-muted/30">
                    <CardTitle className="flex items-center">
                      <Briefcase className="mr-2 h-5 w-5 text-purple-500" />
                      Recommended Companies
                    </CardTitle>
                    <CardDescription>
                      Places where you could thrive based on your profile
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(parsedResults?.companies || []).map((company: string, index: number) => (
                        <div key={index} className="p-4 border rounded-lg flex items-center space-x-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Briefcase className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{company.split(':')[0]}</p>
                            <p className="text-sm text-muted-foreground">{company.split(':').slice(1).join(':')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="roadmap" className="mt-4">
                <Card>
                  <CardHeader className="bg-muted/30">
                    <CardTitle className="flex items-center">
                      <BarChart3 className="mr-2 h-5 w-5 text-amber-500" />
                      6-12 Month Roadmap
                    </CardTitle>
                    <CardDescription>
                      Your realistic path forward in this career
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="relative border-l-2 border-primary/30 pl-6 space-y-6 ml-2">
                      {(parsedResults?.roadmap || []).map((step: string, index: number) => (
                        <div key={index} className="relative">
                          <div className="absolute -left-9 top-1 w-5 h-5 rounded-full bg-primary z-10"></div>
                          <div className="p-4 border rounded-lg">
                            <p>{step}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleReset}>
                Start Over
              </Button>
              <Button 
                onClick={() => navigate("/dashboard")}
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500"
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        )}
        
        {/* Progress Bar */}
        {!results && (
          <div className="mt-4">
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div
                className="h-2 bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${(currentSection / 4) * 100}%` }}
              />
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Step {currentSection} of 4
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
