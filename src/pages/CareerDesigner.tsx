
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, Save } from "lucide-react";
import { useGeminiContext } from "@/context/GeminiContext";
import ReactMarkdown from "react-markdown";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import OnboardingWizard, { OnboardingProfile } from "@/components/OnboardingWizard";

export default function CareerDesigner() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { apiKey } = useGeminiContext();
  
  // State for handling the onboarding wizard
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  
  // State for career design results
  const [isLoading, setIsLoading] = useState(false);
  const [markdownResult, setMarkdownResult] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);
  
  // Get profile from navigation state or localStorage
  useEffect(() => {
    if (location.state?.profile) {
      setProfile(location.state.profile);
      // Trigger API call when profile is loaded from navigation
      handleApiCall(location.state.profile);
    } else {
      // Check if we have a stored profile
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        try {
          const parsedData = JSON.parse(storedProfile);
          if (parsedData.profile) {
            setProfile(parsedData.profile);
          } else {
            // No profile data, show onboarding
            setShowOnboarding(true);
          }
        } catch (error) {
          console.error("Error parsing stored profile:", error);
          setShowOnboarding(true);
        }
      } else {
        // No stored profile, show onboarding
        setShowOnboarding(true);
      }
    }
  }, [location.state]);

  const buildApiPrompt = (userProfile: any) => {
    return `You are CareerForge AI, a brutally-honest but encouraging Gen-Z career coach. Analyse the following user profile and produce:

1️⃣  Top 3 career roles that fit them (with one-line 'why it fits')
2️⃣  6-12-month skill roadmap (bullet points, chronological)
3️⃣  Recommended online courses or certs (platform + course name)
4️⃣  Tools they should master
5️⃣  Internship or job-hunt tips tailored to their college tier and location
6️⃣  Online communities to join
7️⃣  Motivational closing sentence

Return output as Markdown with section headings (##).

USER PROFILE:
${JSON.stringify(userProfile, null, 2)}`;
  };

  const handleApiCall = async (profileData: OnboardingProfile) => {
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please add your Gemini API key in settings.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare the request body
      const promptText = buildApiPrompt(profileData);
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: promptText
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 2048,
        }
      };
      
      // Call the Gemini API
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro:generateContent?key=${apiKey}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0].text) {
        throw new Error("Invalid response format from Gemini API");
      }
      
      const markdownContent = data.candidates[0].content.parts[0].text;
      setMarkdownResult(markdownContent);
      setIsLoading(false);
      
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      
      if (retryCount < 2) {
        toast({
          title: "AI is thinking... retrying",
          description: `Attempt ${retryCount + 1} of 3...`,
        });
        
        setRetryCount(prevCount => prevCount + 1);
        // Retry after a 2-second delay
        setTimeout(() => handleApiCall(profileData), 2000);
      } else {
        toast({
          title: "Error",
          description: "Failed to generate career report after multiple attempts. Please try again later.",
          variant: "destructive"
        });
        setRetryCount(0);
        setIsLoading(false);
      }
    }
  };

  const handleOnboardingComplete = (profileData: OnboardingProfile) => {
    setProfile(profileData);
    setShowOnboarding(false);
    handleApiCall(profileData);
  };

  const downloadAsPDF = () => {
    if (!resultRef.current) return;
    
    toast({
      title: "Generating PDF",
      description: "Please wait while we create your career report..."
    });
    
    html2canvas(resultRef.current, {
      scale: 2,
      logging: false,
      useCORS: true
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('CareerForge-Career-Report.pdf');
      
      toast({
        title: "PDF Downloaded",
        description: "Your career report has been downloaded."
      });
    });
  };

  const saveToDashboard = () => {
    // In a real app, this would save to a database
    toast({
      title: "Saved to Dashboard",
      description: "Your career report has been saved to your dashboard."
    });
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gradient">Design Your Career</h1>
            <p className="text-muted-foreground mt-2">
              Get personalized career guidance based on your profile
            </p>
          </div>
          
          <Button onClick={() => setShowOnboarding(true)}>
            Edit Profile
          </Button>
        </div>

        {isLoading ? (
          <Card className="glass-morphism animate-pulse-slow">
            <CardHeader>
              <CardTitle>Analyzing your profile...</CardTitle>
              <CardDescription>
                Our AI is crafting personalized career guidance for you
              </CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-t-brand-400 border-white/20 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white/70">This may take a moment</p>
              </div>
            </CardContent>
          </Card>
        ) : markdownResult ? (
          <div className="space-y-4">
            <Card className="glass-morphism shadow-[0_0_15px_rgba(168,85,247,0.2)]" ref={resultRef}>
              <CardHeader>
                <CardTitle className="text-2xl text-gradient">Your Career Path</CardTitle>
                <CardDescription>
                  Based on your profile and skills
                </CardDescription>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    h2: ({node, ...props}) => (
                      <h2 className="text-xl font-bold mt-6 mb-4 text-gradient-primary" {...props} />
                    ),
                    ul: ({node, ...props}) => (
                      <ul className="list-disc pl-6 space-y-2 my-4" {...props} />
                    ),
                    li: ({node, ...props}) => (
                      <li className="text-white/90" {...props} />
                    ),
                    p: ({node, ...props}) => (
                      <p className="text-white/80 my-3" {...props} />
                    ),
                  }}
                >
                  {markdownResult}
                </ReactMarkdown>
              </CardContent>
              <CardFooter className="border-t border-white/10 pt-6 flex justify-end gap-4">
                <Button variant="outline" onClick={downloadAsPDF}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                
                <Button onClick={saveToDashboard}>
                  <Save className="mr-2 h-4 w-4" />
                  Save to Dashboard
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>Welcome to Career Designer</CardTitle>
              <CardDescription>
                Complete your profile to get personalized career guidance
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-10">
              <p className="mb-6 text-white/70">
                You need to complete your profile before we can generate personalized career advice.
              </p>
              <Button onClick={() => setShowOnboarding(true)}>
                Complete Your Profile
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Onboarding Wizard */}
      <OnboardingWizard 
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        onCancel={() => setShowOnboarding(false)}
        initialProfile={profile || {}}
      />
    </DashboardLayout>
  );
}
