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
import { Route } from "lucide-react";

export default function CareerDesign() {
  const { toast } = useToast();
  const { apiKey } = useGeminiContext();
  const { 
    userRoadmap, 
    roadmapProgress, 
    saveRoadmap, 
    resetRoadmap, 
    toggleStepCompleted, 
    personalizeRoadmap,
    isPersonalizing
  } = useRoadmap(apiKey || '');
  const [showRoadmapSelector, setShowRoadmapSelector] = useState(false);

  useEffect(() => {
    if (!userRoadmap) {
      setShowRoadmapSelector(true);
    }
  }, [userRoadmap]);

  const handleSelectRoadmap = async (roadmapId: string) => {
    await saveRoadmap(roadmapId);
    setShowRoadmapSelector(false);
    
    toast({
      title: "Roadmap selected!",
      description: "Your career roadmap has been created.",
      variant: "default" // <-- Changed from "success" to "default" to fix the type error
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
    
    const success = await personalizeRoadmap();
    
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
          
          {userRoadmap && (
            <div className="flex gap-2">
              <Button onClick={handleExportPDF} variant="outline">
                Export PDF
              </Button>
              <Button onClick={handleResetRoadmap} variant="outline">
                Reset Roadmap
              </Button>
            </div>
          )}
        </div>

        {showRoadmapSelector ? (
          <RoadmapSelector onSelectRoadmap={handleSelectRoadmap} />
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
                    disabled={isPersonalizing}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Route className="h-4 w-4" />
                    {isPersonalizing ? "Personalizing..." : "✨ Personalize with AI"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <RoadmapProgress progress={roadmapProgress} />
                <RoadmapSteps 
                  steps={userRoadmap.steps} 
                  onToggleStep={toggleStepCompleted} 
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
    </DashboardLayout>
  );
}
