
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
      className="glass-morphism transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]" 
      id={`roadmap-${roadmap.id}`}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="truncate">{roadmap.title}</CardTitle>
            <div className="flex items-center space-x-2 mt-2">
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
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Use our RoadmapProgressTracker component */}
        <RoadmapProgressTracker 
          roadmapId={roadmap.id}
          title=""
          onProgressUpdate={(progress) => onProgressUpdate(roadmap.id, progress)}
        />
        
        {/* Legacy content for fallback */}
        {(!roadmap.id || !roadmap.steps) ? null : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {roadmap.steps.map((step: any, stepIndex: number) => (
              <div 
                key={stepIndex} 
                className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
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
      
      <CardFooter className="flex flex-col sm:flex-row gap-2 border-t border-white/10 pt-4">
        <Button 
          onClick={() => navigate(`/roadmap/${roadmap.id}`)}
          className="flex-1 bg-gradient-to-r from-[#9F68F0] to-purple-600 hover:from-[#8A50DB] hover:to-purple-700"
        >
          Continue Roadmap
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => handleExportPDF(roadmap)}
            className="flex-1 sm:flex-none"
          >
            <FileDown className="h-4 w-4" />
            <span className="sr-only">Export Roadmap</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => handleResetProgress(roadmap.id)}
            className="flex-1 sm:flex-none"
            disabled={isResetting}
          >
            <RefreshCw className={`h-4 w-4 ${isResetting ? 'animate-spin' : ''}`} />
            <span className="sr-only">Reset Progress</span>
          </Button>
          
          <Button 
            variant="destructive" 
            size="icon"
            onClick={() => onDelete(roadmap.id)}
            className="flex-1 sm:flex-none"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete Roadmap</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
