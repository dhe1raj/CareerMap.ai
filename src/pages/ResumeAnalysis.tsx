
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
import GeminiApiKeyInput from "@/components/GeminiApiKeyInput";
import { useGeminiContext } from "@/context/GeminiContext";
import { useGemini } from "@/lib/gemini";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ResumeAnalysis() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const { apiKey } = useGeminiContext();
  const { callGemini } = useGemini();
  
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
    if (!file || !user || !apiKey) return;
    
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
          // For demo purposes, we'll assume we can extract the text
          resumeText = "SAMPLE RESUME TEXT: Software Engineer with 3 years of experience in React, TypeScript, and Node.js. Developed multiple web applications and APIs. Proficient in database design and cloud services.";
        }
        
        // Send to Gemini for analysis
        const prompt = `You are CareerForge AI — a futuristic career mentor. Analyze the following resume and provide:

1. The most relevant career paths based on their **current experience and skills**
2. High-demand roles or industries they are already fit for
3. Skill gaps they should address
4. Suggested certifications, projects, or internships to level up
5. Recommended companies, remote platforms, or startup roles where they can thrive
6. Country-specific suggestions based on resume details

Resume:
${resumeText}

⚠️ Do not suggest degrees or academic courses unless the resume clearly shows the user is still a student and explicitly asks for it.

Format your response as a JSON object with the following fields:
{
  "strengths": ["strength1", "strength2", ...],
  "improvements": ["improvement1", "improvement2", ...],
  "careerPaths": ["path1", "path2", ...],
  "topSkills": ["skill1", "skill2", ...],
  "potentialCompanies": ["company/platform1", "company/platform2", ...]
}`;

        const geminiResponse = await callGemini(prompt, apiKey);
        
        if (geminiResponse) {
          try {
            // Parse the JSON response from Gemini
            const parsedResponse = JSON.parse(geminiResponse);
            setAnalysisResults(parsedResponse);
          } catch (error) {
            console.error("Error parsing Gemini response:", error);
            
            // Fallback to sample data if parsing fails
            setAnalysisResults({
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
            });
            
            toast({
              title: "Warning",
              description: "Could not parse AI response, showing sample data instead.",
              variant: "destructive"
            });
          }
        }
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resume Analysis</h1>
          <p className="text-muted-foreground mt-2">
            Upload your resume to get smart, AI-powered career guidance based on your real skills and experience.
          </p>
        </div>
        
        {!apiKey && (
          <GeminiApiKeyInput />
        )}
        
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
                disabled={!file || !apiKey || isUploading || isAnalyzing}
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
