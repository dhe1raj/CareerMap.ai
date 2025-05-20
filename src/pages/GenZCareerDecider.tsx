
import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, ArrowRight, ArrowLeft, Download, FileText, BookOpen, 
  DollarSign, Briefcase, BookMarked, GraduationCap, Clock, BarChart3,
  Code, Wrench, GitBranch, Building
} from "lucide-react";
import { useGeminiContext } from "@/context/GeminiContext";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from "react-markdown";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

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

// New options
const workExperienceOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const yearsExperienceOptions = [
  { value: "0-1", label: "0-1 years" },
  { value: "1-3", label: "1-3 years" },
  { value: "3-5", label: "3-5 years" },
  { value: "5+", label: "5+ years" },
];

const programmingLanguageOptions = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "cpp", label: "C++" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
];

const techStackOptions = [
  { value: "react", label: "React" },
  { value: "angular", label: "Angular" },
  { value: "vue", label: "Vue.js" },
  { value: "next", label: "Next.js" },
  { value: "node", label: "Node.js" },
  { value: "express", label: "Express" },
  { value: "django", label: "Django" },
  { value: "flask", label: "Flask" },
  { value: "rails", label: "Ruby on Rails" },
  { value: "spring", label: "Spring Boot" },
  { value: "laravel", label: "Laravel" },
  { value: "dotnet", label: ".NET" },
];

const toolOptions = [
  { value: "git", label: "Git" },
  { value: "docker", label: "Docker" },
  { value: "figma", label: "Figma" },
  { value: "sketch", label: "Sketch" },
  { value: "photoshop", label: "Photoshop" },
  { value: "illustrator", label: "Illustrator" },
  { value: "excel", label: "Excel" },
  { value: "powerpoint", label: "PowerPoint" },
  { value: "jira", label: "Jira" },
  { value: "trello", label: "Trello" },
  { value: "notion", label: "Notion" },
  { value: "vscode", label: "VS Code" },
];

export default function GenZCareerDecider() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { apiKey } = useGeminiContext();
  
  // Current section/step
  const [currentSection, setCurrentSection] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [markdownResult, setMarkdownResult] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    // Section 1: Real Talk
    college: "",
    collegeDetails: "",
    placement: "",
    placementDetails: "",
    gamePlan: "",
    gamePlanDetails: "",
    
    // Section 2: Hype & Hustle
    grindLevel: "",
    grindLevelDetails: "",
    workPlace: "",
    workPlaceDetails: "",
    detours: "",
    detoursDetails: "",
    
    // Section 3: Skills & Interests
    interests: [] as string[],
    interestsDetails: "",
    currentLevel: "",
    currentLevelDetails: "",
    preferredCountry: "",
    preferredCountryDetails: "",
    
    // Section 4: Experience & Tech Skills
    workExperience: "",
    workExperienceDetails: "",
    yearsExperience: "",
    yearsExperienceDetails: "",
    programmingLanguages: [] as string[],
    programmingLanguagesDetails: "",
    techStacks: [] as string[],
    techStacksDetails: "",
    tools: [] as string[],
    toolsDetails: "",
    
    // Section 5: Resume
    resumeText: "",
  });
  
  // Handler to update form data
  const handleChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  // Handler for multi-select options
  const handleMultiSelectToggle = (field: string, value: string) => {
    setFormData(prev => {
      const currentValues = [...(prev[field as keyof typeof prev] as string[])];
      
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [field]: currentValues.filter(v => v !== value),
        };
      } else {
        // Allow up to 5 selections
        if (currentValues.length < 5) {
          return {
            ...prev,
            [field]: [...currentValues, value],
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
      window.scrollTo(0, 0);
    }
  };
  
  // Navigate to previous section
  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Handle text input change
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const buildUserProfile = () => {
    // Create a user profile object with all data
    const profile: Record<string, any> = {};
    
    // Process each field and its details
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // For arrays (multi-select), get the labels
        const options = 
          key === 'interests' ? interestOptions :
          key === 'programmingLanguages' ? programmingLanguageOptions :
          key === 'techStacks' ? techStackOptions :
          key === 'tools' ? toolOptions : [];
        
        if (value.length > 0) {
          const labels = value.map(v => {
            const option = options.find(o => o.value === v);
            return option ? option.label : v;
          }).join(", ");
          
          profile[key] = labels;
        }
      } else if (value && !key.includes('Details')) {
        // For single selects, get the label
        const options = 
          key === 'college' ? collegeOptions :
          key === 'placement' ? placementOptions :
          key === 'gamePlan' ? gamePlanOptions :
          key === 'grindLevel' ? grindOptions :
          key === 'workPlace' ? workOptions :
          key === 'detours' ? detourOptions :
          key === 'currentLevel' ? levelOptions :
          key === 'preferredCountry' ? countryOptions :
          key === 'workExperience' ? workExperienceOptions :
          key === 'yearsExperience' ? yearsExperienceOptions : [];
        
        if (options.length > 0) {
          const option = options.find(o => o.value === value);
          profile[key] = option ? option.label : value;
        } else {
          profile[key] = value;
        }
      } else if (key.includes('Details') && value) {
        // Add details directly
        profile[key] = value;
      }
    });
    
    return profile;
  };
  
  const callGeminiAPI = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please add your Gemini API key in settings.",
        variant: "destructive",
      });
      return null;
    }
    
    const userProfile = buildUserProfile();
    console.log("User profile:", userProfile);
    
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `You are CareerForge AI, a brutally-honest but encouraging Gen-Z career coach. Analyse the following user profile and produce:

1️⃣  Top 3 career roles that fit them (with one-line 'why it fits')
2️⃣  6-12-month skill roadmap (bullet points, chronological)
3️⃣  Recommended online courses or certs (platform + course name)
4️⃣  Tools they should master
5️⃣  Internship or job-hunt tips tailored to their college tier and location
6️⃣  Online communities to join
7️⃣  Motivational closing sentence

Return output as Markdown with section headings (##).

USER PROFILE:
${JSON.stringify(userProfile, null, 2)}
`
            }
          ]
        }
      ]
    };
    
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro:generateContent?key=${apiKey}`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API response:", data);
      
      if (!data.candidates || 
          !data.candidates[0] || 
          !data.candidates[0].content || 
          !data.candidates[0].content.parts || 
          !data.candidates[0].content.parts[0].text) {
        throw new Error("Invalid response format from Gemini API");
      }
      
      const markdownContent = data.candidates[0].content.parts[0].text;
      return markdownContent;
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      throw error;
    }
  };
  
  const downloadAsPDF = useCallback(() => {
    if (!resultRef.current) return;
    
    toast({
      title: "Generating PDF",
      description: "Please wait while we create your career report...",
    });
    
    html2canvas(resultRef.current, {
      scale: 2,
      logging: false,
      useCORS: true,
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('CareerForge-Career-Report.pdf');
      
      toast({
        title: "PDF Downloaded",
        description: "Your career report has been downloaded.",
      });
    });
  }, [toast]);
  
  // Submit form and get AI suggestions
  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      const result = await callGeminiAPI();
      
      if (result) {
        setMarkdownResult(result);
        toast({
          title: "Career analysis complete",
          description: "Your personalized career report is ready!",
        });
      } else {
        throw new Error("Empty response from Gemini API");
      }
    } catch (error) {
      console.error("Error generating career suggestions:", error);
      
      if (retryCount < 2) {
        toast({
          title: "Failed—retrying",
          description: `Attempt ${retryCount + 1} of 3...`,
          variant: "destructive",
        });
        setRetryCount(prevCount => prevCount + 1);
        // Retry after a short delay
        setTimeout(() => handleSubmit(), 1500);
      } else {
        toast({
          title: "Error",
          description: "Failed to generate career report after multiple attempts. Please try again later.",
          variant: "destructive",
        });
        setRetryCount(0);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check if current section is valid
  const isCurrentSectionValid = () => {
    switch(currentSection) {
      case 1:
        return !!formData.college;
      case 2:
        return !!formData.grindLevel;
      case 3:
        return formData.interests.length > 0 && !!formData.currentLevel && !!formData.preferredCountry;
      case 4:
        return !!formData.workExperience && 
          (formData.workExperience === 'no' || !!formData.yearsExperience) && 
          (formData.programmingLanguages.length > 0 || formData.techStacks.length > 0 || formData.tools.length > 0);
      case 5:
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
      collegeDetails: "",
      placement: "",
      placementDetails: "",
      gamePlan: "",
      gamePlanDetails: "",
      grindLevel: "",
      grindLevelDetails: "",
      workPlace: "",
      workPlaceDetails: "",
      detours: "",
      detoursDetails: "",
      interests: [],
      interestsDetails: "",
      currentLevel: "",
      currentLevelDetails: "",
      preferredCountry: "",
      preferredCountryDetails: "",
      workExperience: "",
      workExperienceDetails: "",
      yearsExperience: "",
      yearsExperienceDetails: "",
      programmingLanguages: [],
      programmingLanguagesDetails: "",
      techStacks: [],
      techStacksDetails: "",
      tools: [],
      toolsDetails: "",
      resumeText: "",
    });
    setMarkdownResult(null);
    setCurrentSection(1);
    setRetryCount(0);
  };
  
  // Function to render a question with dropdown and text input
  const renderQuestionWithDetail = (
    label: string, 
    fieldName: string, 
    value: string, 
    options: { value: string; label: string }[], 
    detailsField: string, 
    detailsValue: string,
    placeholder: string = "Add more details..."
  ) => {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={fieldName}>{label}</Label>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Select value={value} onValueChange={(val) => handleChange(fieldName, val)}>
                <SelectTrigger className="w-full glass-input">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent className="bg-brand-900/90 backdrop-blur-xl border border-white/20 text-white">
                  {options.map(option => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="text-white hover:bg-brand-400/30 focus:bg-brand-400/30"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Input
                name={detailsField}
                value={detailsValue}
                onChange={handleTextChange}
                placeholder={placeholder}
                className="glass-input"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Function to render multi-select options with text input
  const renderMultiSelect = (
    label: string,
    fieldName: string,
    values: string[],
    options: { value: string; label: string }[],
    detailsField: string,
    detailsValue: string,
    icon: JSX.Element,
    placeholder: string = "Other skills or details..."
  ) => {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            {icon}
            <span>{label}</span> 
            <span className="text-xs text-white/60 ml-2">
              (Select up to 5)
            </span>
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {options.map(option => (
              <Button 
                key={option.value}
                type="button"
                variant={values.includes(option.value) ? "default" : "outline"}
                className={`justify-start text-left text-sm ${values.includes(option.value) ? "bg-brand-400/80 hover:bg-brand-400" : "hover:bg-brand-900/40"}`}
                onClick={() => handleMultiSelectToggle(fieldName, option.value)}
                disabled={!values.includes(option.value) && values.length >= 5}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <Input
            name={detailsField}
            value={detailsValue}
            onChange={handleTextChange}
            placeholder={placeholder}
            className="glass-input mt-2"
          />
        </div>
      </div>
    );
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-300 via-brand-400 to-purple-400 neon-purple-text">Gen Z Career Role Decider</h1>
          <p className="text-white/70 mt-1">
            Be real with us, and we'll match you with career paths that actually vibe with you
          </p>
        </div>
        
        {/* Progress bar */}
        <div className="w-full">
          <Progress value={(currentSection / 5) * 100} className="h-2 mb-1" />
          <div className="flex justify-between text-xs text-white/60">
            <span>Start</span>
            <span>Step {currentSection} of 5</span>
            <span>Complete</span>
          </div>
        </div>
        
        {!markdownResult ? (
          <Card className="border-t-4 border-t-primary shadow-md backdrop-blur-xl bg-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.12),0_0_20px_rgba(168,85,247,0.2)]">
            <CardHeader className="bg-gradient-to-r from-brand-900/50 to-cyber-dark/50 rounded-t-xl border-b border-white/10">
              <CardTitle>
                {currentSection === 1 && "Real Talk (College & Plans)"}
                {currentSection === 2 && "Hype & Hustle Check"}
                {currentSection === 3 && "Skills, Interests, and Style"}
                {currentSection === 4 && "Experience & Tech Skills"}
                {currentSection === 5 && "Resume & Final Details"}
              </CardTitle>
              <CardDescription>
                {currentSection === 1 && "Let's start with your current education situation"}
                {currentSection === 2 && "How hard are you willing to work?"}
                {currentSection === 3 && "What do you actually enjoy doing?"}
                {currentSection === 4 && "Tell us about your tech experience"}
                {currentSection === 5 && "Add your resume for more tailored suggestions"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 pt-6">
              {/* Section 1: Real Talk */}
              {currentSection === 1 && (
                <>
                  {renderQuestionWithDetail(
                    "Be honest — how would you rate your current college?",
                    "college",
                    formData.college,
                    collegeOptions,
                    "collegeDetails",
                    formData.collegeDetails,
                    "Any specific details about your college..."
                  )}
                  
                  {renderQuestionWithDetail(
                    "What kind of job placement does your college offer?",
                    "placement",
                    formData.placement,
                    placementOptions,
                    "placementDetails",
                    formData.placementDetails
                  )}
                  
                  {renderQuestionWithDetail(
                    "What's your current game plan?",
                    "gamePlan",
                    formData.gamePlan,
                    gamePlanOptions,
                    "gamePlanDetails",
                    formData.gamePlanDetails,
                    "More details about your plan..."
                  )}
                </>
              )}
              
              {/* Section 2: Hype & Hustle */}
              {currentSection === 2 && (
                <>
                  {renderQuestionWithDetail(
                    "How ready are you to grind?",
                    "grindLevel",
                    formData.grindLevel,
                    grindOptions,
                    "grindLevelDetails",
                    formData.grindLevelDetails
                  )}
                  
                  {renderQuestionWithDetail(
                    "Where do you see yourself working?",
                    "workPlace",
                    formData.workPlace,
                    workOptions,
                    "workPlaceDetails",
                    formData.workPlaceDetails,
                    "What kind of work environment motivates you..."
                  )}
                  
                  {renderQuestionWithDetail(
                    "Are you okay with taking detours?",
                    "detours",
                    formData.detours,
                    detourOptions,
                    "detoursDetails",
                    formData.detoursDetails
                  )}
                </>
              )}
              
              {/* Section 3: Skills & Interests */}
              {currentSection === 3 && (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-brand-400" />
                        <span>Pick things you'd do even if no one paid you</span>
                        <span className="text-xs text-white/60 ml-2">
                          (Selected: {formData.interests.length}/5)
                        </span>
                      </Label>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                        {interestOptions.map(option => (
                          <Button 
                            key={option.value}
                            type="button"
                            variant={formData.interests.includes(option.value) ? "default" : "outline"}
                            className={`justify-start text-left ${formData.interests.includes(option.value) ? "bg-brand-400/80 hover:bg-brand-400" : "hover:bg-brand-900/40"}`}
                            onClick={() => handleMultiSelectToggle("interests", option.value)}
                            disabled={!formData.interests.includes(option.value) && formData.interests.length >= 5}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                      
                      <Input
                        name="interestsDetails"
                        value={formData.interestsDetails}
                        onChange={handleTextChange}
                        placeholder="Other interests or hobbies..."
                        className="glass-input mt-2"
                      />
                    </div>
                    
                    {renderQuestionWithDetail(
                      "What's your current level?",
                      "currentLevel",
                      formData.currentLevel,
                      levelOptions,
                      "currentLevelDetails",
                      formData.currentLevelDetails,
                      "More context about your experience level..."
                    )}
                    
                    {renderQuestionWithDetail(
                      "Preferred country for future roles or study?",
                      "preferredCountry",
                      formData.preferredCountry,
                      countryOptions,
                      "preferredCountryDetails",
                      formData.preferredCountryDetails,
                      "Any specific cities or regions?"
                    )}
                  </div>
                </>
              )}
              
              {/* Section 4: Experience & Tech Skills */}
              {currentSection === 4 && (
                <>
                  {renderQuestionWithDetail(
                    "Do you have any previous work experience?",
                    "workExperience",
                    formData.workExperience,
                    workExperienceOptions,
                    "workExperienceDetails",
                    formData.workExperienceDetails,
                    "Describe your role or company..."
                  )}
                  
                  {formData.workExperience === 'yes' && (
                    renderQuestionWithDetail(
                      "Years of experience",
                      "yearsExperience",
                      formData.yearsExperience,
                      yearsExperienceOptions,
                      "yearsExperienceDetails",
                      formData.yearsExperienceDetails,
                      "What industry or role?"
                    )
                  )}
                  
                  {renderMultiSelect(
                    "Programming languages you know",
                    "programmingLanguages",
                    formData.programmingLanguages,
                    programmingLanguageOptions,
                    "programmingLanguagesDetails",
                    formData.programmingLanguagesDetails,
                    <Code className="h-5 w-5 text-brand-400" />,
                    "Other languages or skill level details..."
                  )}
                  
                  {renderMultiSelect(
                    "Tech stacks / frameworks",
                    "techStacks",
                    formData.techStacks,
                    techStackOptions,
                    "techStacksDetails",
                    formData.techStacksDetails,
                    <GitBranch className="h-5 w-5 text-brand-400" />,
                    "Other frameworks or libraries..."
                  )}
                  
                  {renderMultiSelect(
                    "Tools you're comfortable with",
                    "tools",
                    formData.tools,
                    toolOptions,
                    "toolsDetails",
                    formData.toolsDetails,
                    <Wrench className="h-5 w-5 text-brand-400" />,
                    "Other tools or expertise level..."
                  )}
                </>
              )}
              
              {/* Section 5: Resume */}
              {currentSection === 5 && (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="resumeText" className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-brand-400" />
                        <span>Paste your resume text or additional skills (optional)</span>
                      </Label>
                      <Textarea
                        id="resumeText"
                        name="resumeText"
                        placeholder="Copy and paste your resume text or add any additional skills, experiences, or preferences..."
                        rows={8}
                        value={formData.resumeText}
                        onChange={handleTextChange}
                        className="border-dashed glass-input"
                      />
                      <p className="text-xs text-white/60">
                        This helps us provide more accurate career suggestions based on your existing skills.
                      </p>
                    </div>
                    
                    <div className="mt-6 text-center">
                      <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full md:w-2/3 lg:w-1/2 bg-gradient-to-r from-brand-400 to-purple-600 hover:from-brand-400/90 hover:to-purple-600/90 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] text-lg py-6"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            {retryCount > 0 ? `Retry ${retryCount}/3...` : "Analyzing your profile..."}
                          </>
                        ) : (
                          <>
                            Generate My Career Path
                            <BookMarked className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between bg-gradient-to-r from-brand-900/40 to-cyber-dark/40 border-t border-white/10 p-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentSection === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              
              {currentSection < 5 ? (
                <Button
                  onClick={handleNext}
                  disabled={!isCurrentSectionValid()}
                  className="bg-brand-400/90 hover:bg-brand-400 flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => setCurrentSection(1)}
                  disabled={isLoading}
                  className="text-white/70 hover:text-white"
                >
                  Start Over
                </Button>
              )}
            </CardFooter>
          </Card>
        ) : (
          // Results Display with improved styling
          <div className="space-y-6">
            <Card className="border-t-4 border-t-purple-500 shadow-lg backdrop-blur-xl bg-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.12),0_0_20px_rgba(168,85,247,0.3)]" ref={resultRef}>
              <CardHeader className="bg-gradient-to-r from-brand-900/50 to-cyber-dark/50 rounded-t-xl border-b border-white/10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl font-bold text-white flex items-center">
                      <BookMarked className="mr-2 h-6 w-6 text-brand-400" />
                      Your Career Roadmap
                    </CardTitle>
                    <CardDescription className="text-white/80">
                      A personalized plan based on your skills and preferences
                    </CardDescription>
                  </div>
                  <Button
                    onClick={downloadAsPDF} 
                    variant="outline"
                    className="flex items-center gap-2 border border-brand-400/50 hover:bg-brand-900/20"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="py-8 px-4 md:px-8 prose prose-invert prose-purple max-w-none">
                <ReactMarkdown
                  components={{
                    h2: ({ node, ...props }) => <h2 className="text-xl md:text-2xl font-bold text-brand-300 mt-8 mb-4 border-b border-white/10 pb-2" {...props} />,
                    ul: ({ node, ...props }) => <ul className="space-y-2 my-4" {...props} />,
                    li: ({ node, ...props }) => <li className="flex items-start gap-3"><span className="text-brand-400 mt-1">•</span><span {...props} /></li>,
                    p: ({ node, ...props }) => <p className="my-3 text-white/80" {...props} />,
                    a: ({ node, ...props }) => <a className="text-brand-300 hover:underline" {...props} />,
                  }}
                >
                  {markdownResult}
                </ReactMarkdown>
              </CardContent>
            </Card>
            
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Start New Analysis
              </Button>
              
              <Button 
                onClick={downloadAsPDF}
                className="bg-gradient-to-r from-brand-400 to-purple-600 hover:from-brand-400/90 hover:to-purple-600/90 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Career Roadmap
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
