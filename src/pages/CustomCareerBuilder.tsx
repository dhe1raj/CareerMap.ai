
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CustomCareerBuilder from "@/components/CustomCareerBuilder";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function CustomCareerBuilderPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [wizardOpen, setWizardOpen] = useState(true);
  
  // Auto-open the builder when the page loads
  useEffect(() => {
    setWizardOpen(true);
  }, []);
  
  const handleClose = () => {
    setWizardOpen(false);
    // Navigate back to the career designer page after a small delay
    setTimeout(() => {
      navigate("/career-designer");
    }, 100);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/career-designer")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gradient">Create Custom Career Role</h1>
            <p className="text-muted-foreground mt-2">
              Design a personalized AI-powered career roadmap
            </p>
          </div>
        </div>
        
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-purple-300" />
              Custom Career Designer
            </CardTitle>
            <CardDescription>
              Answer a few questions to generate a custom roadmap for your career goals
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center max-w-md">
              <Sparkles className="h-12 w-12 mx-auto text-purple-300 mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI-Powered Career Planning</h3>
              <p className="text-white/70 mb-6">
                Tell us about your background, skills, and goals, and our AI will create a personalized step-by-step career roadmap just for you.
              </p>
              <Button 
                onClick={() => setWizardOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 w-full"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Start Building My Career Path
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Sheet implementation of the wizard */}
      <CustomCareerBuilder 
        isOpen={wizardOpen}
        onClose={handleClose}
        isDialog={false} // Use Sheet instead of Dialog
      />
    </DashboardLayout>
  );
}
