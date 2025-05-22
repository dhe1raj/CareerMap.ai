
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ArrowRight, FileDown, Trash2, Calendar, Clock, RefreshCw } from "lucide-react";
import { exportElementToPDF } from "@/utils/pdfExport";
import { RoadmapProgressTracker } from "@/components/roadmap/RoadmapProgressTracker";

interface RoadmapCardProps {
  roadmap: any;
  onDelete: (id: string) => Promise<void>;
  onProgressUpdate: (roadmapId: string, progress: number) => void;
}

export const RoadmapCard = ({ roadmap, onDelete, onProgressUpdate }: RoadmapCardProps) => {
  const navigate = useNavigate();
  const [isResetting, setIsResetting] = useState(false);
  
  const handleExportPDF = (roadmap: any) => {
    try {
      const element = document.getElementById(`roadmap-${roadmap.id}`);
      if (!element) return;
      
      exportElementToPDF(element, `${roadmap.title}-roadmap.pdf`)
        .then(() => toast.success("PDF exported successfully"))
        .catch(() => toast.error("Failed to export PDF"));
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF");
    }
  };

  const handleResetProgress = async (roadmapId: string) => {
    try {
      setIsResetting(true);
      // Reset progress in the RoadmapProgressTracker component
      onProgressUpdate(roadmapId, 0);
      toast.success("Progress has been reset");
    } catch (error) {
      console.error("Error resetting progress:", error);
      toast.error("Failed to reset progress");
    } finally {
      setIsResetting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return 'Unknown date';
    }
  };
  
  return (
    <Card 
      key={roadmap.id} 
      className="glass-morphism transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] w-full min-w-[320px] md:min-w-[720px]" 
      id={`roadmap-${roadmap.id}`}
    >
      <CardHeader className="border-b border-white/10">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl md:text-3xl">{roadmap.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <CardDescription className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {roadmap.lastUpdated ? formatDate(roadmap.lastUpdated) : 'No date available'}
              </CardDescription>
              {roadmap.category && (
                <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                  {roadmap.category}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center justify-end">
            <Badge className="bg-purple-500/20 text-white border-purple-500/30 backdrop-blur-sm px-3 py-1 text-sm">
              {roadmap.progress || 0}% Complete
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 px-6 min-h-[400px] max-h-[70vh]">
        {/* Use our RoadmapProgressTracker component */}
        <RoadmapProgressTracker 
          roadmapId={roadmap.id}
          title=""
          onProgressUpdate={(progress) => onProgressUpdate(roadmap.id, progress)}
        />
        
        {/* Legacy content for fallback - only show if no RoadmapProgressTracker */}
        {(!roadmap.id || !roadmap.steps) ? null : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">
            {roadmap.steps.map((step: any, stepIndex: number) => (
              <div 
                key={stepIndex} 
                className={`flex items-start gap-3 p-4 rounded-lg transition-all ${
                  step.completed 
                    ? "bg-brand-500/20 shadow-[0_0_10px_rgba(168,85,247,0.3)]" 
                    : "bg-white/5"
                }`}
              >
                <div className="flex-1">
                  <div className="font-medium">{step.label}</div>
                  {step.estTime && (
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mr-1" /> {step.estTime}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-4 border-t border-white/10 p-6">
        <Button 
          onClick={() => navigate(`/roadmap/${roadmap.id}`)}
          className="flex-1 bg-gradient-to-r from-[#9F68F0] to-purple-600 hover:from-[#8A50DB] hover:to-purple-700 py-6 sm:py-2"
        >
          Continue Roadmap
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        
        <div className="flex gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => handleExportPDF(roadmap)}
            className="h-10 w-10"
          >
            <FileDown className="h-4 w-4" />
            <span className="sr-only">Export Roadmap</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => handleResetProgress(roadmap.id)}
            className="h-10 w-10"
            disabled={isResetting}
          >
            <RefreshCw className={`h-4 w-4 ${isResetting ? 'animate-spin' : ''}`} />
            <span className="sr-only">Reset Progress</span>
          </Button>
          
          <Button 
            variant="destructive" 
            size="icon"
            onClick={() => onDelete(roadmap.id)}
            className="h-10 w-10"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete Roadmap</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
