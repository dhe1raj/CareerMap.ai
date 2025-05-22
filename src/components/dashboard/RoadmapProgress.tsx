
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/hooks/use-user-data";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import ProfileWizard from "@/components/ProfileWizard";
import CustomCareerBuilder from "@/components/CustomCareerBuilder";
import { FileDown, RefreshCw, Sparkles, ArrowRight, Book } from "lucide-react";
import { RoadmapProgressTracker } from "@/components/roadmap/RoadmapProgressTracker";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function RoadmapProgress() {
  const { userData, saveField } = useUserData();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [customCareerBuilderOpen, setCustomCareerBuilderOpen] = useState(false);
  const navigate = useNavigate();
  const [userRoadmaps, setUserRoadmaps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("skills");
  
  useEffect(() => {
    const fetchUserRoadmaps = async () => {
      setIsLoading(true);
      try {
        // Fetch user's roadmaps from Supabase
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('user_roadmaps')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(1);
          
          if (error) throw error;
          
          if (data && data.length > 0) {
            setUserRoadmaps(data);
          }
        }
      } catch (error) {
        console.error("Error fetching user roadmaps:", error);
        toast.error("Failed to load roadmap data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserRoadmaps();
  }, []);
  
  const handleExportPDF = () => {
    try {
      if (!userData.userRoadmap) return;
      
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text(`Career Roadmap: ${userData.userRoadmap.title}`, 20, 20);
      
      doc.setFontSize(12);
      doc.text(`Progress: ${userData.career.progress}%`, 20, 30);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 40);
      
      doc.setFontSize(14);
      doc.text("Steps:", 20, 55);
      
      let y = 65;
      userData.userRoadmap.steps.forEach((step, index) => {
        const checkmark = step.completed ? "✓" : "□";
        doc.setFontSize(12);
        doc.text(`${checkmark} ${step.label}`, 25, y);
        doc.setFontSize(10);
        doc.text(`Estimated time: ${step.estTime}`, 30, y + 7);
        y += 20;
        
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
      
      doc.save(`${userData.userRoadmap.title.toLowerCase().replace(/\s+/g, '-')}-roadmap.pdf`);
      
      toast.success("PDF exported successfully");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF");
    }
  };
  
  const handleResetRoadmap = () => {
    saveField("userRoadmap.reset", true);
    toast.success("Roadmap progress has been reset");
  };
  
  const openWizard = () => {
    setWizardOpen(true);
  };
  
  const openCustomCareerBuilder = () => {
    setCustomCareerBuilderOpen(true);
  };

  const viewAllRoadmaps = () => {
    navigate("/career-progress");
  };

  const viewResources = (roadmapId?: string) => {
    if (roadmapId) {
      navigate(`/career-resources/${roadmapId}`);
    } else {
      navigate("/career-resources");
    }
  };
  
  const handleProgressUpdate = (progress: number) => {
    saveField("career.progress", progress);
  };
  
  if (!userData.userRoadmap && userRoadmaps.length === 0) {
    return (
      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Career Roadmap</CardTitle>
          <CardDescription>Design your personalized career roadmap</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="mb-5">
            <p>You haven't set up your career roadmap yet.</p>
            <p className="text-muted-foreground">Create a personalized step-by-step plan to achieve your career goals.</p>
          </div>
          <div className="space-y-4">
            <Button onClick={openWizard} className="w-full bg-gradient-to-r from-[#9F68F0] to-[#8B5CF6] text-white hover:shadow-[0_0_20px_rgba(159,104,240,0.5)]">
              Design My Career Path
            </Button>
            <Button 
              onClick={openCustomCareerBuilder} 
              variant="outline" 
              className="w-full border border-purple-400/30 bg-purple-500/10 hover:bg-purple-500/20"
            >
              <Sparkles className="mr-2 h-4 w-4 text-purple-300" />
              Design Your Own Career Role (AI)
            </Button>
            <Button 
              onClick={viewAllRoadmaps}
              variant="outline" 
              className="w-full border border-purple-400/30 bg-purple-500/10 hover:bg-purple-500/20"
            >
              <ArrowRight className="mr-2 h-4 w-4 text-purple-300" />
              View Career Progress
            </Button>
          </div>
        </CardContent>
        <ProfileWizard isOpen={wizardOpen} onClose={() => setWizardOpen(false)} />
        <CustomCareerBuilder isOpen={customCareerBuilderOpen} onClose={() => setCustomCareerBuilderOpen(false)} />
      </Card>
    );
  }
  
  // Display the first roadmap from Supabase if available
  if (userRoadmaps.length > 0) {
    const latestRoadmap = userRoadmaps[0];
    
    return (
      <>
        <Card className="glass-morphism">
          <CardHeader className="pb-3">
            <div className="space-y-1">
              <CardTitle className="text-lg line-clamp-1" title={latestRoadmap.title}>
                {latestRoadmap.title}
              </CardTitle>
              <CardDescription>Your step-by-step career plan</CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="pb-3">
            <RoadmapProgressTracker 
              roadmapId={latestRoadmap.id} 
              title={latestRoadmap.title}
              onProgressUpdate={handleProgressUpdate}
            />
          </CardContent>
          
          <div className="px-6">
            <Tabs defaultValue="skills" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-4 bg-purple-500/10">
                <TabsTrigger value="skills" className="data-[state=active]:bg-purple-500/30">Skills</TabsTrigger>
                <TabsTrigger value="tools" className="data-[state=active]:bg-purple-500/30">Tools</TabsTrigger>
                <TabsTrigger value="resources" className="data-[state=active]:bg-purple-500/30">Resources</TabsTrigger>
                <TabsTrigger value="timeline" className="data-[state=active]:bg-purple-500/30">Timeline</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <CardFooter className="flex flex-wrap justify-between border-t border-white/10 pt-4 gap-2">
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportPDF}
                className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30"
              >
                <FileDown className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => viewResources(latestRoadmap.id)}
                className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30"
              >
                <Book className="h-4 w-4 mr-2" />
                Resources
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={openCustomCareerBuilder}
                className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30"
              >
                <Sparkles className="h-4 w-4 mr-2 text-purple-300" />
                Custom
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleResetRoadmap}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-3 flex justify-end">
          <Button 
            onClick={viewAllRoadmaps} 
            variant="link" 
            size="sm" 
            className="text-purple-300 hover:text-purple-200"
          >
            View all roadmaps
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        <ProfileWizard isOpen={wizardOpen} onClose={() => setWizardOpen(false)} />
        <CustomCareerBuilder isOpen={customCareerBuilderOpen} onClose={() => setCustomCareerBuilderOpen(false)} />
      </>
    );
  }
  
  // Fallback to local storage data if needed
  return (
    <>
      <Card className="glass-morphism">
        <CardHeader>
          <div>
            <CardTitle className="line-clamp-1" title={userData.userRoadmap?.title}>
              {userData.userRoadmap?.title}
            </CardTitle>
            <CardDescription>Your step-by-step career plan</CardDescription>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{userData.career.progress}%</span>
            </div>
            <Progress value={userData.career.progress} className="h-2" />
          </div>
        </CardHeader>
        <CardContent className="space-y-5 max-h-[300px] overflow-y-auto scrollbar-none">
          {userData.userRoadmap && userData.userRoadmap.steps && userData.userRoadmap.steps.length > 0 && (
            <div className="space-y-2">
              {userData.userRoadmap.steps.map((step, index) => (
                <div 
                  key={index} 
                  className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                    step.completed 
                      ? "bg-brand-500/20 shadow-[0_0_10px_rgba(168,85,247,0.3)]" 
                      : "bg-white/5"
                  }`}
                >
                  <input 
                    type="checkbox"
                    checked={step.completed}
                    onChange={() => {
                      if (!userData.userRoadmap) return;
                      
                      const newCompleted = !step.completed;
                      saveField(`userRoadmap.steps.${index}`, { ...step, completed: newCompleted });
                      
                      if (newCompleted) {
                        toast.success("Progress updated! Keep going!");
                      }
                    }}
                    className={step.completed ? "text-brand-500" : ""}
                  />
                  <div className="flex-1">
                    <div className="font-medium line-clamp-2">{step.label}</div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      {step.estTime}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-wrap justify-between border-t border-white/10 pt-4 gap-2">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportPDF}
              className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => viewResources()}
              className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30"
            >
              <Book className="h-4 w-4 mr-2" />
              Resources
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={openCustomCareerBuilder}
              className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30"
            >
              <Sparkles className="h-4 w-4 mr-2 text-purple-300" />
              Custom
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleResetRoadmap}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <div className="mt-3 flex justify-end">
        <Button 
          onClick={viewAllRoadmaps} 
          variant="link" 
          size="sm" 
          className="text-purple-300 hover:text-purple-200"
        >
          View all roadmaps
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      
      <ProfileWizard isOpen={wizardOpen} onClose={() => setWizardOpen(false)} />
      <CustomCareerBuilder isOpen={customCareerBuilderOpen} onClose={() => setCustomCareerBuilderOpen(false)} />
    </>
  );
}
