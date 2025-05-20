
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRoadmap } from "@/hooks/use-roadmap";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { jsPDF } from "jspdf";
import { useGeminiContext } from "@/context/GeminiContext";
import { exportRoadmapToPDF } from "@/utils/pdfExport";
import { RoadmapSelector } from "@/components/roadmap/RoadmapSelector";
import { RoadmapProgress } from "@/components/roadmap/RoadmapProgress";
import { RoadmapSteps } from "@/components/roadmap/RoadmapSteps";
import { Route, Sparkles } from "lucide-react";
import CareerDesignModal from "@/components/career/CareerDesignModal";
import { GeneratedRoadmap } from "@/components/career/CareerDesignWizard";

export default function CareerDesign() {
  const { toast } = useToast();
  const { apiKey } = useGeminiContext();
  const { 
    userRoadmap, 
    roadmapProgress, 
    selectRoadmap, 
    resetRoadmap, 
    updateRoadmapStep, 
    personalizeWithAI,
    loadingRoadmap,
    saveCustomRoadmap,
  } = useRoadmap(apiKey || '');
  const [showRoadmapSelector, setShowRoadmapSelector] = useState(false);
  const [showDesignWizard, setShowDesignWizard] = useState(false);

  useEffect(() => {
    if (!userRoadmap) {
      setShowRoadmapSelector(true);
    }
  }, [userRoadmap]);

  const handleSelectRoadmap = async (roadmapId: string) => {
    await selectRoadmap(roadmapId);
    setShowRoadmapSelector(false);
    
    toast({
      title: "Roadmap selected!",
      description: "Your career roadmap has been created.",
      variant: "default"
    });
  };

  const handleResetRoadmap = async () => {
    await resetRoadmap();
    setShowRoadmapSelector(true);
    
    toast({
      title: "Roadmap reset",
      description: "Your career roadmap has been reset.",
    });
  };

  const handleExportPDF = async () => {
    if (!userRoadmap) return;
    
    await exportRoadmapToPDF(userRoadmap);
    
    toast({
      title: "PDF Exported",
      description: "Your career roadmap has been exported to PDF.",
    });
  };

  const handlePersonalize = async () => {
    if (!userRoadmap) return;
    
    // Create a simple user profile for personalization
    // In a real app, this would come from the user's stored profile
    const userProfile = {
      level: "beginner",
      interests: ["machine learning", "data analysis"],
      goal: "Get entry-level position"
    };
    
    const success = await personalizeWithAI(userProfile);
    
    if (success) {
      toast({
        title: "Roadmap Personalized",
        description: "Your roadmap has been tailored to your profile.",
      });
    } else {
      toast({
        title: "Personalization Failed",
        description: "Could not personalize your roadmap. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleWizardComplete = async (customRoadmap: GeneratedRoadmap) => {
    if (saveCustomRoadmap) {
      await saveCustomRoadmap(customRoadmap);
      
      toast({
        title: "Custom Roadmap Created",
        description: "Your custom career roadmap has been saved.",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Career Roadmap</h1>
            <p className="text-muted-foreground mt-2">
              Your personalized career roadmap and progress tracking.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowDesignWizard(true)}
              variant="default"
              className="bg-primary hover:bg-primary/90 flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Design Your Own Career Role
            </Button>
            
            {userRoadmap && (
              <>
                <Button onClick={handleExportPDF} variant="outline">
                  Export PDF
                </Button>
                <Button onClick={handleResetRoadmap} variant="outline">
                  Reset Roadmap
                </Button>
              </>
            )}
          </div>
        </div>

        {showRoadmapSelector ? (
          <div className="space-y-6">
            <Card className="glass-morphism card-hover border-primary/20 mb-6">
              <CardHeader>
                <CardTitle>Create Your Own Career Role</CardTitle>
                <CardDescription>
                  Use AI to generate a personalized career roadmap based on your profile and goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">
                  Answer a series of questions about your background, skills, and career aspirations, 
                  and our AI will create a custom step-by-step roadmap just for you.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => setShowDesignWizard(true)}
                  className="w-full bg-primary/10 hover:bg-primary/20 border border-primary/30"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Design Your Own Career Role
                </Button>
              </CardFooter>
            </Card>
            
            <RoadmapSelector onSelect={handleSelectRoadmap} />
          </div>
        ) : userRoadmap ? (
          <div className="space-y-6">
            <Card className="glass-morphism">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{userRoadmap.title}</CardTitle>
                    <CardDescription>
                      Your career roadmap with {roadmapProgress}% completion
                    </CardDescription>
                  </div>
                  
                  <Button
                    onClick={handlePersonalize}
                    disabled={loadingRoadmap}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Route className="h-4 w-4" />
                    {loadingRoadmap ? "Personalizing..." : "✨ Personalize with AI"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <RoadmapProgress 
                  roadmap={userRoadmap}
                  progress={roadmapProgress}
                  onReset={handleResetRoadmap}
                  onPersonalize={handlePersonalize}
                  onExport={handleExportPDF}
                  personalizeDisabled={loadingRoadmap}
                />
                <RoadmapSteps 
                  steps={userRoadmap.steps} 
                  onToggleStep={updateRoadmapStep} 
                />
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="glass-morphism">
            <CardContent className="py-10">
              <div className="text-center">
                <h3 className="text-xl font-medium">No Roadmap Selected</h3>
                <p className="text-muted-foreground mt-2">
                  Please select a roadmap to get started.
                </p>
                <Button 
                  onClick={() => setShowRoadmapSelector(true)} 
                  className="mt-4"
                >
                  Select a Roadmap
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <CareerDesignModal
        isOpen={showDesignWizard}
        onClose={() => setShowDesignWizard(false)}
        onComplete={handleWizardComplete}
      />
    </DashboardLayout>
  );
}
