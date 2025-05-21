
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { useUserData } from "@/hooks/use-user-data";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import ProfileWizard from "@/components/ProfileWizard";
import { RoadmapTemplate } from "@/data/roadmapTemplates";
import { Check, FileDown, RefreshCcw, Clock } from "lucide-react";

export function RoadmapProgress() {
  const { userData, saveField } = useUserData();
  const [wizardOpen, setWizardOpen] = React.useState(false);
  
  const handleStepToggle = (index: number) => {
    if (!userData.userRoadmap) return;
    
    const newCompleted = !userData.userRoadmap.steps[index].completed;
    saveField(`userRoadmap.steps.${index}`, { completed: newCompleted });
  };
  
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
  };
  
  const openWizard = () => {
    setWizardOpen(true);
  };
  
  if (!userData.userRoadmap) {
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
          <Button onClick={openWizard} className="glowing-purple">
            Design My Career Path
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <Card className="glass-morphism">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{userData.userRoadmap.title} Roadmap</CardTitle>
              <CardDescription>Your step-by-step career plan</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{userData.career.progress}%</div>
              <div className="text-xs text-muted-foreground">Complete</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <Progress value={userData.career.progress} className="h-2" />
          
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {userData.userRoadmap.steps.map((step, index) => (
              <div 
                key={index} 
                className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                  step.completed 
                    ? "bg-brand-500/20 shadow-[0_0_10px_rgba(168,85,247,0.3)]" 
                    : "bg-white/5"
                }`}
              >
                <Checkbox 
                  checked={step.completed} 
                  onCheckedChange={() => handleStepToggle(index)}
                  className={step.completed ? "text-brand-500" : ""}
                />
                <div className="flex-1">
                  <div className="font-medium">{step.label}</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3 mr-1" /> {step.estTime}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-white/10 pt-4">
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <FileDown className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="destructive" size="sm" onClick={handleResetRoadmap}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Reset Progress
          </Button>
        </CardFooter>
      </Card>
      
      <ProfileWizard isOpen={wizardOpen} onClose={() => setWizardOpen(false)} />
    </>
  );
}
