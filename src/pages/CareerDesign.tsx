
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGeminiContext } from "@/context/GeminiContext";
import { CareerProfileWizard, CareerProfile } from "@/components/wizard/CareerProfileWizard";
import { RoadmapSelector } from "@/components/roadmap/RoadmapSelector";
import { RoadmapProgress } from "@/components/roadmap/RoadmapProgress";
import { RoadmapSteps } from "@/components/roadmap/RoadmapSteps";
import { useRoadmap } from "@/hooks/use-roadmap";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, ArrowRight, CheckCircle2, ClipboardList } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function CareerDesign() {
  const navigate = useNavigate();
  const { apiKey } = useGeminiContext();
  const { toast } = useToast();
  const [showWizard, setShowWizard] = useState(false);
  const [userProfile, setUserProfile] = useState<CareerProfile | null>(null);
  const [showRoadmapSelector, setShowRoadmapSelector] = useState(false);
  
  const {
    userRoadmap,
    loadingRoadmap,
    roadmapProgress,
    selectRoadmap,
    updateRoadmapStep,
    resetRoadmap,
    personalizeWithAI
  } = useRoadmap(apiKey || '');
  
  // Check if user has a saved profile
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setUserProfile(parsedProfile);
      } catch (error) {
        console.error("Error parsing saved profile:", error);
      }
    }
  }, []);
  
  // Handle wizard completion
  const handleWizardComplete = (profile: CareerProfile) => {
    setUserProfile(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setShowWizard(false);
    setShowRoadmapSelector(true);
  };
  
  // Handle roadmap selection
  const handleRoadmapSelect = async (templateId: string) => {
    await selectRoadmap(templateId);
    setShowRoadmapSelector(false);
    
    toast({
      title: "Roadmap Selected",
      description: "Your career roadmap has been created successfully."
    });
  };
  
  // Handle personalization with AI
  const handlePersonalizeWithAI = async () => {
    if (!userProfile) {
      toast({
        title: "Profile Required",
        description: "Please complete your profile before personalizing.",
        variant: "destructive"
      });
      return;
    }
    
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please add a Gemini API key in settings to use AI personalization.",
        variant: "destructive"
      });
      return;
    }
    
    const success = await personalizeWithAI(userProfile);
    
    if (success) {
      toast({
        title: "Roadmap Personalized",
        description: "AI has enhanced your roadmap with personalized steps."
      });
    }
  };
  
  // Export roadmap as PDF
  const handleExportPDF = async () => {
    if (!userRoadmap) return;
    
    try {
      const element = document.getElementById('roadmap-container');
      if (!element) return;
      
      toast({
        title: "Preparing PDF",
        description: "Your roadmap is being exported to PDF...",
      });
      
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#1A1F2C'
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${userRoadmap.title.replace(/\s+/g, '-').toLowerCase()}-roadmap.pdf`);
      
      toast({
        title: "PDF Exported",
        description: "Your roadmap has been exported as a PDF.",
        variant: "success"
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your roadmap. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle reset profile
  const handleResetProfile = () => {
    localStorage.removeItem('userProfile');
    setUserProfile(null);
    resetRoadmap();
    setShowWizard(true);
    
    toast({
      title: "Profile Reset",
      description: "Your profile has been reset successfully."
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gradient">Career Design</h1>
            <p className="text-muted-foreground mt-2">
              Design your career path with a customized roadmap
            </p>
          </div>
          
          {userRoadmap && (
            <Button variant="outline" onClick={handleResetProfile}>
              Create New Roadmap
            </Button>
          )}
        </div>

        {/* Main content */}
        <div>
          {/* Show wizard if no profile exists or button clicked */}
          {showWizard && (
            <CareerProfileWizard 
              onComplete={handleWizardComplete} 
              apiKey={apiKey}
              onCancel={() => setShowWizard(false)}
            />
          )}
          
          {/* Show roadmap selector if profile exists but no roadmap */}
          {showRoadmapSelector && (
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle>Choose Your Career Path</CardTitle>
                <CardDescription>
                  Select a roadmap template to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RoadmapSelector onSelect={handleRoadmapSelect} />
              </CardContent>
            </Card>
          )}
          
          {/* Show roadmap if it exists */}
          {!showWizard && !showRoadmapSelector && !userRoadmap && !loadingRoadmap && (
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
                <CardDescription>
                  Create your career profile and roadmap
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <ClipboardList className="h-16 w-16 text-primary/60" />
                  <h3 className="text-xl font-semibold">Create Your Career Profile</h3>
                  <p className="text-white/70 max-w-md">
                    Tell us about yourself, your background, and your career goals to get a personalized roadmap.
                  </p>
                  <Button onClick={() => setShowWizard(true)}>
                    Create Profile <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {loadingRoadmap && (
            <Card className="glass-morphism">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                <h3 className="text-xl font-semibold mt-4">Creating Your Roadmap</h3>
                <p className="text-white/70 mt-2">Please wait while we prepare your career path...</p>
              </CardContent>
            </Card>
          )}
          
          {userRoadmap && (
            <div className="space-y-6" id="roadmap-container">
              {/* Roadmap Progress */}
              <RoadmapProgress 
                roadmap={userRoadmap}
                progress={roadmapProgress}
                onReset={resetRoadmap}
                onPersonalize={handlePersonalizeWithAI}
                personalizeDisabled={!apiKey || !userProfile}
                onExport={handleExportPDF}
              />
              
              {/* Roadmap Steps */}
              <RoadmapSteps 
                steps={userRoadmap.steps} 
                onToggleStep={updateRoadmapStep} 
              />
              
              {/* Completed message */}
              {roadmapProgress === 100 && (
                <Card className="glass-morphism bg-primary/10 border-primary/20">
                  <CardContent className="flex items-center gap-4 py-6">
                    <div className="bg-primary/20 rounded-full p-2">
                      <CheckCircle2 className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Congratulations!</h3>
                      <p className="text-white/70">
                        You've completed all steps in your roadmap. Consider exploring more advanced topics or selecting a new path.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* API key warning */}
              {!apiKey && (
                <Card className="glass-morphism bg-yellow-900/10 border-yellow-600/20">
                  <CardContent className="flex items-center gap-4 py-6">
                    <div className="bg-yellow-500/20 rounded-full p-2">
                      <AlertCircle className="h-8 w-8 text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Add Gemini API Key for Enhanced Features</h3>
                      <p className="text-white/70">
                        To personalize your roadmap with AI, add your Gemini API key in settings.
                      </p>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-yellow-400 mt-1"
                        onClick={() => navigate("/settings")}
                      >
                        Go to Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
