
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserData } from "@/hooks/use-user-data";
import { exportElementToPDF } from "@/utils/pdfExport";
import { ProgressBar } from "./ProgressBar";
import { SuggestionsList } from "./SuggestionsList";
import { LatestRoadmapSummary } from "./LatestRoadmapSummary";
import { useDashboardRoadmap } from "@/hooks/use-dashboard-roadmap";
import { useCareerSuggestions } from "@/hooks/use-career-suggestions";

interface CareerProgressProps {
  userData: UserData;
  onUpdateField: (path: string, value: any) => void;
  isLoadingSuggestions?: boolean;
}

export function CareerProgress({ 
  userData, 
  onUpdateField,
  isLoadingSuggestions = false
}: CareerProgressProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [roadmapRef, setRoadmapRef] = useState<HTMLDivElement | null>(null);
  
  // Custom hooks to handle data fetching and state management
  const { progress, latestRoadmap, isLoadingRoadmap } = useDashboardRoadmap(userData, onUpdateField);
  const { suggestions, isProcessingSuggestions } = useCareerSuggestions(userData, isLoadingSuggestions, onUpdateField);
  
  const handleDesignCareer = () => {
    navigate('/career-designer');
  };
  
  const handleViewProgress = () => {
    navigate('/career-progress');
  };
  
  const handleExportRoadmap = async () => {
    if (!userData.career.roadmap) {
      toast({
        title: "No roadmap available",
        description: "Complete your career design first to generate a roadmap.",
        variant: "destructive"
      });
      return;
    }
    
    if (!roadmapRef) {
      toast({
        title: "Error",
        description: "Cannot export roadmap at this time.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await exportElementToPDF(roadmapRef, 'CareerForge-Roadmap.pdf');
      toast({
        title: "PDF Downloaded",
        description: "Your career roadmap has been downloaded."
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your roadmap.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card className="glass-morphism shadow-[0_0_15px_rgba(168,85,247,0.2)]">
      <CardHeader>
        <CardTitle className="text-gradient">Career Progress</CardTitle>
        <CardDescription>Your progress toward career goals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProgressBar progress={progress} />
        
        <SuggestionsList 
          suggestions={suggestions} 
          isLoading={isProcessingSuggestions} 
        />
        
        <LatestRoadmapSummary 
          roadmap={latestRoadmap}
          isLoading={isLoadingRoadmap} 
          setRoadmapRef={setRoadmapRef} 
          userRoadmapText={userData.career.roadmap}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleDesignCareer} className="flex-1 mr-2">
          {userData.career.roadmap ? "Update Career Design" : "Design My Career"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        
        <Button 
          onClick={handleViewProgress} 
          variant="outline" 
          className="ml-2"
        >
          {latestRoadmap ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Track Progress
            </>
          ) : (
            <>
              View Progress
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
