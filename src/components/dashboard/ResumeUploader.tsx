
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { openFilePicker } from "@/utils/filePicker";
import { Loader2, Upload } from "lucide-react";
import { useGeminiCareer } from "@/hooks/use-gemini-career";

interface ResumeUploaderProps {
  onUploadComplete: (fileURL: string, summary: string, suggestions: string[]) => void;
  isUploaded: boolean;
}

export function ResumeUploader({ onUploadComplete, isUploaded }: ResumeUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { analyzeResume } = useGeminiCareer();
  
  const handleUpload = async () => {
    setIsLoading(true);
    
    try {
      // Open file picker for PDF or DOCX files
      const files = await openFilePicker({
        accept: '.pdf,.docx',
        multiple: false,
      });
      
      if (files.length === 0) {
        setIsLoading(false);
        return;
      }
      
      const file = files[0];
      
      // For demo purposes, we'll simulate a file URL
      // In a real app, this would upload to storage
      const fileURL = URL.createObjectURL(file);
      
      // Read the file as text (for demo purposes)
      // In a real app, we'd use a PDF/DOCX parser
      let resumeText = await readFileAsText(file);
      
      // Analyze the resume with Gemini
      toast({
        title: "Analyzing resume...",
        description: "This may take a moment"
      });
      
      const { summary, suggestions } = await analyzeResume(resumeText);
      
      // Call the callback with the results
      onUploadComplete(fileURL, summary, suggestions);
      
      toast({
        title: "Resume analyzed!",
        description: "Your resume has been processed successfully."
      });
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast({
        title: "Upload failed",
        description: "There was an error processing your resume.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Read file as text (demo helper)
  const readFileAsText = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };
  
  return (
    <Button 
      onClick={handleUpload} 
      variant={isUploaded ? "outline" : "default"}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Upload className="mr-2 h-4 w-4" />
      )}
      {isUploaded ? "Update Resume" : "Upload Resume"}
    </Button>
  );
}
