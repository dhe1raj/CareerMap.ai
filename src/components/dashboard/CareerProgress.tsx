
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SuggestionChip } from "./SuggestionChip";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "./ProgressBar";
import { ArrowRight, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGeminiCareer } from "@/hooks/use-gemini-career";
import { UserData } from "@/hooks/use-user-data";
import { exportElementToPDF } from "@/utils/pdfExport";

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
  const { generateSuggestions, isProcessing } = useGeminiCareer();
  const [roadmapRef, setRoadmapRef] = useState<HTMLDivElement | null>(null);
  
  useEffect(() => {
    // Generate suggestions if none exist
    const fetchSuggestions = async () => {
      if (userData.career.suggestions.length === 0 && !isProcessing && !isLoadingSuggestions) {
        const suggestions = await generateSuggestions(userData);
        if (suggestions.length > 0) {
          onUpdateField('career.suggestions', suggestions);
        }
      }
    };
    
    fetchSuggestions();
  }, [userData, generateSuggestions, onUpdateField, isProcessing, isLoadingSuggestions]);
  
  const handleDesignCareer = () => {
    navigate('/career-designer');
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
        <ProgressBar progress={userData.career.progress} />
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-white/70">Suggested Roles</h4>
          
          {isProcessing || isLoadingSuggestions ? (
            <div className="flex justify-center py-2">
              <div className="w-6 h-6 border-2 border-t-brand-400 border-white/20 rounded-full animate-spin"></div>
            </div>
          ) : userData.career.suggestions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {userData.career.suggestions.map((suggestion, index) => (
                <SuggestionChip key={index} label={suggestion} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/60 italic">
              Complete your career design to get personalized suggestions
            </p>
          )}
        </div>
        
        {userData.career.roadmap && (
          <div 
            className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10"
            ref={(ref) => setRoadmapRef(ref)}
          >
            <h4 className="text-sm font-medium text-gradient mb-2">Your Career Roadmap</h4>
            <div className="text-xs text-white/70">
              {userData.career.roadmap}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleDesignCareer} className="flex-1 mr-2">
          {userData.career.roadmap ? "Update Career Design" : "Design My Career"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        
        <Button 
          onClick={handleExportRoadmap} 
          variant="outline" 
          disabled={!userData.career.roadmap}
          className="ml-2"
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </CardFooter>
    </Card>
  );
}
