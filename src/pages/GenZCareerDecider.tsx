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
import { Progress } from "@/components/ui/progress";
import { 
  Loader2, ArrowRight, ArrowLeft, Download, FileText, Briefcase
} from "lucide-react";
import { useGeminiContext } from "@/context/GeminiContext";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
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
    college: "",
    collegeDetails: "",
    grindLevel: "",
    grindLevelDetails: "",
    workPlace: "",
    workPlaceDetails: "",
  });
  
  // Handler to update form data
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
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
  
  const callGeminiAPI = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please add your Gemini API key in settings.",
        variant: "destructive",
      });
      return null;
    }
    
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
${JSON.stringify(formData, null, 2)}
`
            }
          ]
        }
      ]
    };
    
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      
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
      
      if (!data.candidates || 
          !data.candidates[0] || 
          !data.candidates[0].content || 
          !data.candidates[0].content.parts || 
          !data.candidates[0].content.parts[0].text) {
        throw new Error("Invalid response format from Gemini API");
      }
      
      const markdownContent = data.candidates[0].content.parts[0].text;
      setMarkdownResult(markdownContent);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      toast({
        title: "Error",
        description: "Failed to generate career report. Please try again later.",
        variant: "destructive",
      });
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
        
        <Card className="border-t-4 border-t-primary shadow-md backdrop-blur-xl bg-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.12),0_0_20px_rgba(168,85,247,0.2)]">
          <CardHeader className="bg-gradient-to-r from-brand-900/50 to-cyber-dark/50 rounded-t-xl border-b border-white/10">
            <CardTitle>
              {currentSection === 1 && "Real Talk (College & Plans)"}
              {currentSection === 2 && "Hype & Hustle Check"}
            </CardTitle>
            <CardDescription>
              {currentSection === 1 && "Let's start with your current education situation"}
              {currentSection === 2 && "How hard are you willing to work?"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            {currentSection === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="college">Be honest — how would you rate your current college?</Label>
                  <Select value={formData.college} onValueChange={(val) => handleChange("college", val)}>
                    <SelectTrigger className="w-full glass-input">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent className="bg-brand-900/90 backdrop-blur-xl border border-white/20 text-white">
                      {collegeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value} className="text-white hover:bg-brand-400/30 focus:bg-brand-400/30">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="grindLevel">How ready are you to grind?</Label>
                  <Select value={formData.grindLevel} onValueChange={(val) => handleChange("grindLevel", val)}>
                    <SelectTrigger className="w-full glass-input">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent className="bg-brand-900/90 backdrop-blur-xl border border-white/20 text-white">
                      {grindOptions.map(option => (
                        <SelectItem key={option.value} value={option.value} className="text-white hover:bg-brand-400/30 focus:bg-brand-400/30">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            
            {currentSection === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="workPlace">Where do you see yourself working?</Label>
                  <Select value={formData.workPlace} onValueChange={(val) => handleChange("workPlace", val)}>
                    <SelectTrigger className="w-full glass-input">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent className="bg-brand-900/90 backdrop-blur-xl border border-white/20 text-white">
                      {workOptions.map(option => (
                        <SelectItem key={option.value} value={option.value} className="text-white hover:bg-brand-400/30 focus:bg-brand-400/30">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentSection === 1} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            
            {currentSection < 5 ? (
              <Button onClick={handleNext} className="bg-brand-400/90 hover:bg-brand-400 flex items-center gap-2">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => setCurrentSection(1)} disabled={isLoading} className="text-white/70 hover:text-white">
                Start Over
              </Button>
            )}
          </CardFooter>
        </Card>
        
        {markdownResult && (
          <div className="space-y-6">
            <Card className="border-t-4 border-t-purple-500 shadow-lg backdrop-blur-xl bg-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.12),0_0_20px_rgba(168,85,247,0.3)]" ref={resultRef}>
              <CardHeader className="bg-gradient-to-r from-brand-900/50 to-cyber-dark/50 rounded-t-xl border-b border-white/10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl font-bold text-white flex items-center">
                      <Briefcase className="mr-2 h-6 w-6 text-brand-400" />
                      Your Career Roadmap
                    </CardTitle>
                    <CardDescription className="text-white/80">
                      A personalized plan based on your skills and preferences
                    </CardDescription>
                  </div>
                  <Button onClick={downloadAsPDF} variant="outline" className="flex items-center gap-2 border border-brand-400/50 hover:bg-brand-900/20">
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="py-8 px-4 md:px-8 prose prose-invert prose-purple max-w-none">
                <ReactMarkdown>
                  {markdownResult}
                </ReactMarkdown>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
