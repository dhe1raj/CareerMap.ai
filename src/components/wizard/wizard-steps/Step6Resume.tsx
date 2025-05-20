
import React, { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Step6ResumeProps {
  value?: File;
  onChange: (value: File) => void;
}

export function Step6Resume({ value, onChange }: Step6ResumeProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">Upload your resume (optional)</h2>
        <p className="text-white/70">
          This helps us provide more personalized recommendations.
        </p>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {value ? (
        <div className="border border-primary/20 bg-primary/5 rounded-md p-4 flex items-center">
          <FileText className="h-8 w-8 mr-4 text-primary" />
          <div>
            <p className="font-medium">{value.name}</p>
            <p className="text-sm text-white/70">
              {(value.size / 1024 / 1024).toFixed(2)} MB • {value.type}
            </p>
          </div>
          <Button className="ml-auto" size="sm" onClick={handleButtonClick}>
            Change
          </Button>
        </div>
      ) : (
        <div className="border border-dashed border-white/20 rounded-md p-8 flex flex-col items-center justify-center cursor-pointer" onClick={handleButtonClick}>
          <Upload className="h-12 w-12 text-white/50 mb-4" />
          <p className="font-medium">Click to upload your resume</p>
          <p className="text-sm text-white/50 mt-1">PDF, DOC or DOCX (max 5MB)</p>
        </div>
      )}
      
      <Alert className="bg-primary/5 border-primary/20">
        <AlertDescription className="text-white/70">
          Your resume will be analyzed to better personalize your career roadmap. 
          This step is optional - you can skip it and continue.
        </AlertDescription>
      </Alert>
    </div>
  );
}
