
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Upload, File, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ResumeAnalysisResults from "@/components/ResumeAnalysisResults";

export default function ResumeAnalysis() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file type
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a PDF, DOCX, or TXT file."
        });
        return;
      }
      
      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Maximum file size is 5MB."
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };
  
  const handleUpload = async () => {
    if (!file || !user) return;
    
    setIsUploading(true);
    
    try {
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `resumes/${fileName}`;
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('career-documents')
        .upload(filePath, file);
        
      if (error) {
        throw error;
      }
      
      // Start resume analysis
      await analyzeResume(filePath);
      
      toast({
        title: "Resume uploaded successfully",
        description: "Your resume is being analyzed."
      });
    } catch (error: any) {
      console.error("Error uploading resume:", error.message);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to upload resume."
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const analyzeResume = async (filePath: string) => {
    setIsAnalyzing(true);
    
    try {
      // Get the file URL
      const { data: urlData } = await supabase.storage
        .from('career-documents')
        .createSignedUrl(filePath, 60); // 60 seconds expiry
      
      if (urlData?.signedUrl) {
        // Extract text from the resume
        let resumeText = "";
        
        if (filePath.endsWith('.txt')) {
          const response = await fetch(urlData.signedUrl);
          resumeText = await response.text();
        } else {
          // In a real implementation, you would use a document parsing service
          // Simulating parsed text for demo purposes
          resumeText = "SAMPLE RESUME TEXT: Software Engineer with 3 years of experience in React, TypeScript, and Node.js. Developed multiple web applications and APIs. Proficient in database design and cloud services.";
        }
        
        // Send to AI for analysis (simulated)
        const analysisData = await simulateAIAnalysis(resumeText);
        setAnalysisResults(analysisData);
      }
    } catch (error: any) {
      console.error("Error analyzing resume:", error.message);
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: "Failed to analyze resume. Please try again."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Simulate AI analysis (in a real app, you would call an edge function)
  const simulateAIAnalysis = async (resumeText: string) => {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Sample response structure - in a real app this would come from GPT or another AI
    return {
      strengths: [
        "Strong frontend development skills with React and TypeScript",
        "Experience with full-stack development using Node.js",
        "Database design and implementation experience"
      ],
      improvements: [
        "Cloud infrastructure and DevOps knowledge",
        "Mobile development skills",
        "Leadership experience"
      ],
      careerPaths: [
        "Senior Frontend Developer",
        "Full-Stack Engineer",
        "React Technical Lead"
      ],
      topSkills: [
        "AWS/Azure cloud services",
        "CI/CD pipeline implementation",
        "System architecture design"
      ],
      potentialCompanies: [
        "Tech startups focused on web applications",
        "Mid-sized companies with established engineering teams",
        "Remote-first companies like GitLab, Zapier, etc."
      ]
    };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resume Analysis</h1>
          <p className="text-muted-foreground mt-2">
            Upload your resume to get smart, AI-powered career guidance based on your real skills and experience.
          </p>
        </div>
        
        {!analysisResults ? (
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Resume</CardTitle>
              <CardDescription>
                We accept PDF, DOCX, and TXT files up to 5MB.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed rounded-lg p-10 text-center border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                <div className="flex flex-col items-center gap-4">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium mb-1">
                      Drag & drop your resume here or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Your resume will be analyzed to provide personalized career guidance
                    </p>
                  </div>
                  <Input
                    type="file"
                    className="hidden"
                    id="resume-upload"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                  />
                  <Button asChild variant="secondary">
                    <label htmlFor="resume-upload" className="cursor-pointer">Browse Files</label>
                  </Button>
                </div>
              </div>
              
              {file && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                  <File className="h-4 w-4" />
                  <span className="text-sm font-medium truncate flex-1">
                    {file.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFile(null)}
                  >
                    Remove
                  </Button>
                </div>
              )}
              
              <Button
                className="w-full"
                disabled={!file || isUploading || isAnalyzing}
                onClick={handleUpload}
              >
                {(isUploading || isAnalyzing) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isUploading ? "Uploading..." : "Analyzing..."}
                  </>
                ) : (
                  <>Analyze Resume</>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <ResumeAnalysisResults results={analysisResults} onReset={() => setAnalysisResults(null)} />
        )}
      </div>
    </DashboardLayout>
  );
}
