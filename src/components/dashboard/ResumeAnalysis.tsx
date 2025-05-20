
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ResumeUploader } from "./ResumeUploader";
import { useToast } from "@/hooks/use-toast";
import { UserData } from "@/hooks/use-user-data";

interface ResumeAnalysisProps {
  userData: UserData;
  onUpdateField: (path: string, value: any) => void;
}

export function ResumeAnalysis({ userData, onUpdateField }: ResumeAnalysisProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleUploadComplete = (fileURL: string, aiSummary: string, suggestions: string[]) => {
    onUpdateField('resume.fileURL', fileURL);
    onUpdateField('resume.aiSummary', aiSummary);
    
    // Also update career suggestions if we got new ones from the resume
    if (suggestions.length > 0) {
      onUpdateField('career.suggestions', suggestions);
    }
    
    // Update career progress
    const newProgress = Math.min(100, userData.career.progress + 20);
    onUpdateField('career.progress', newProgress);
  };
  
  const handleViewAnalysis = () => {
    if (!userData.resume.aiSummary) {
      toast({
        title: "No analysis available",
        description: "Please upload your resume first.",
        variant: "destructive"
      });
      return;
    }
    
    navigate('/resume-analysis');
  };
  
  return (
    <Card className="glass-morphism shadow-[0_0_15px_rgba(168,85,247,0.2)]">
      <CardHeader>
        <CardTitle className="text-gradient">Resume Analysis</CardTitle>
        <CardDescription>Get AI feedback on your resume</CardDescription>
      </CardHeader>
      <CardContent>
        {userData.resume.fileURL && userData.resume.aiSummary ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-400" />
              <span className="text-sm">Resume uploaded and analyzed</span>
            </div>
            
            <div className="p-3 rounded-md bg-white/5 border border-white/10">
              <p className="text-sm text-white/70">
                {userData.resume.aiSummary.length > 150 
                  ? userData.resume.aiSummary.substring(0, 150) + '...' 
                  : userData.resume.aiSummary}
              </p>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-white/70 text-sm">
            <FileText className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>Upload your resume to get AI analysis</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between space-x-2">
        <ResumeUploader 
          onUploadComplete={handleUploadComplete} 
          isUploaded={!!userData.resume.fileURL}
        />
        
        <Button 
          onClick={handleViewAnalysis} 
          variant="outline" 
          disabled={!userData.resume.aiSummary || isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileText className="mr-2 h-4 w-4" />
          )}
          View Analysis
        </Button>
      </CardFooter>
    </Card>
  );
}
