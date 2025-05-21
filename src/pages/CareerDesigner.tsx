
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { RoadmapTemplate } from "@/data/roadmapTemplates";
import { roadmapTemplates } from "@/data/roadmapTemplates";
import { useUserData } from "@/hooks/use-user-data";
import CustomCareerBuilder from "@/components/CustomCareerBuilder";
import { Sparkles, Clock, ArrowRight } from "lucide-react";

export default function CareerDesigner() {
  const navigate = useNavigate();
  const { userData, saveField } = useUserData();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customCareerOpen, setCustomCareerOpen] = useState(false);
  
  const handleSelectTemplate = (id: string) => {
    setSelectedTemplate(id);
  };
  
  const handleCreateRoadmap = () => {
    if (!selectedTemplate) return;
    
    const template = roadmapTemplates.find(t => t.id === selectedTemplate);
    if (!template) return;
    
    const newRoadmap = {
      id: template.id,
      title: template.title,
      steps: template.steps.map(step => ({
        ...step,
        completed: false
      })),
      lastUpdated: new Date().toISOString()
    };
    
    saveField("userRoadmap", newRoadmap);
    navigate("/dashboard");
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gradient">Design Your Career</h1>
            <p className="text-muted-foreground mt-2">
              Select a career path or create your own custom roadmap
            </p>
          </div>
          
          <Button 
            onClick={() => setCustomCareerOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Design Custom Role
          </Button>
        </div>
        
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle>Choose a Career Template</CardTitle>
            <CardDescription>
              Select from our pre-built career path templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedTemplate || ""}
              onValueChange={handleSelectTemplate}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {roadmapTemplates.map((template) => (
                <div key={template.id} className="relative">
                  <RadioGroupItem
                    value={template.id}
                    id={template.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={template.id}
                    className="flex flex-col p-4 rounded-lg border border-white/10 hover:border-purple-400/50 hover:bg-white/5 transition-all cursor-pointer peer-data-[state=checked]:border-purple-400 peer-data-[state=checked]:bg-purple-400/10 peer-data-[state=checked]:shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                  >
                    <span className="text-base font-medium">{template.title}</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {template.steps.length} steps
                    </span>
                  </Label>
                </div>
              ))}
              
              {/* Custom career option */}
              <div className="relative">
                <RadioGroupItem
                  value="custom-ai"
                  id="custom-ai"
                  className="peer sr-only"
                  onClick={() => setCustomCareerOpen(true)}
                />
                <Label
                  htmlFor="custom-ai"
                  className="flex flex-col p-4 rounded-lg border border-dashed border-purple-400/50 hover:border-purple-400/70 hover:bg-white/5 transition-all cursor-pointer"
                >
                  <div className="flex items-center">
                    <Sparkles className="h-4 w-4 text-purple-400 mr-2" />
                    <span className="text-base font-medium">Create Your Own</span>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    AI-powered custom roadmap
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              onClick={handleCreateRoadmap} 
              disabled={!selectedTemplate || selectedTemplate === 'custom-ai'}
            >
              Create Roadmap
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        {selectedTemplate && selectedTemplate !== 'custom-ai' && (
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>Preview: {roadmapTemplates.find(t => t.id === selectedTemplate)?.title}</CardTitle>
              <CardDescription>
                Review the steps in this career roadmap
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {roadmapTemplates
                  .find(t => t.id === selectedTemplate)
                  ?.steps.map((step, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-3 rounded-lg bg-white/5"
                    >
                      <div className="flex-none w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-sm">
                        {step.order}
                      </div>
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
          </Card>
        )}
      </div>
      
      <CustomCareerBuilder 
        isOpen={customCareerOpen} 
        onClose={() => setCustomCareerOpen(false)}
        isDialog={true}
      />
    </DashboardLayout>
  );
}
