
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { roadmapTemplates, RoadmapTemplate } from "@/data/roadmapTemplates";
import { Clock, CheckCircle2, Sparkles } from "lucide-react";
import { useUserData } from "@/hooks/use-user-data";
import { useGeminiRoadmap, GeminiRoadmapStep } from "@/utils/gemini";
import { useGeminiContext } from "@/context/GeminiContext";

interface RoadmapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RoadmapPickerModal({ isOpen, onClose }: RoadmapPickerModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("technical");
  const [geminiEnhancing, setGeminiEnhancing] = useState<string | null>(null);
  
  const { userData, saveField } = useUserData();
  const { personalizeRoadmap, isLoading: isEnhancing } = useGeminiRoadmap();
  const { apiKey } = useGeminiContext();
  
  const technicalRoadmaps = roadmapTemplates.filter(r => 
    ["ai-ml-engineer", "data-scientist", "software-developer", "cybersecurity-analyst"].includes(r.id)
  );
  
  const nonTechnicalRoadmaps = roadmapTemplates.filter(r => 
    ["cloud-architect", "devops-engineer", "full-stack-dev", "ui-ux-designer"].includes(r.id)
  );
  
  const handleSelectRoadmap = async (template: RoadmapTemplate, enhanceWithAI: boolean = false) => {
    if (enhanceWithAI && apiKey) {
      try {
        setGeminiEnhancing(template.id);
        
        const enhancedSteps = await personalizeRoadmap(
          apiKey,
          userData.profile,
          template.id,
          template.steps
        );
        
        if (enhancedSteps) {
          // Create user roadmap with enhanced steps
          const userRoadmap = {
            id: template.id,
            title: template.title,
            steps: enhancedSteps.map(step => ({
              ...step,
              completed: false
            })),
            lastUpdated: new Date().toISOString()
          };
          
          saveField('userRoadmap', userRoadmap);
          
          toast.success("AI-enhanced roadmap created successfully!");
        } else {
          // Fallback to template if enhancement failed
          createRoadmapFromTemplate(template);
          toast.info("Using standard template (AI enhancement failed)");
        }
      } catch (error) {
        console.error("Error enhancing roadmap:", error);
        createRoadmapFromTemplate(template);
        toast.error("AI enhancement failed, using standard template");
      } finally {
        setGeminiEnhancing(null);
        onClose();
      }
    } else {
      createRoadmapFromTemplate(template);
      onClose();
    }
  };
  
  const createRoadmapFromTemplate = (template: RoadmapTemplate) => {
    // Create user roadmap from template
    const userRoadmap = {
      id: template.id,
      title: template.title,
      steps: template.steps.map(step => ({
        ...step,
        completed: false
      })),
      lastUpdated: new Date().toISOString()
    };
    
    saveField('userRoadmap', userRoadmap);
    toast.success(`${template.title} roadmap created!`);
  };
  
  // Check if the user already has a roadmap
  if (userData.userRoadmap) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] glass-morphism">
          <DialogHeader>
            <DialogTitle>Roadmap Already Active</DialogTitle>
            <DialogDescription>
              You already have the "{userData.userRoadmap.title}" roadmap active. 
              You'll need to reset your current roadmap before selecting a new one.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => {
              saveField("userRoadmap.reset", true);
              toast.success("Roadmap has been reset");
              onClose();
            }}>
              Reset Current Roadmap
            </Button>
            <Button onClick={onClose}>
              Keep Current Roadmap
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] glass-morphism">
        <DialogHeader>
          <DialogTitle>Choose Your Career Path</DialogTitle>
          <DialogDescription>
            Select a roadmap template to get started on your career journey
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="technical" onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="technical">Technical Roles</TabsTrigger>
            <TabsTrigger value="non-technical">Other Roles</TabsTrigger>
          </TabsList>
          
          <TabsContent value="technical" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {technicalRoadmaps.map((template) => (
                <RoadmapCard 
                  key={template.id}
                  template={template}
                  onSelect={handleSelectRoadmap}
                  isEnhancing={isEnhancing && geminiEnhancing === template.id}
                  hasGeminiKey={!!apiKey}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="non-technical" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nonTechnicalRoadmaps.map((template) => (
                <RoadmapCard 
                  key={template.id}
                  template={template}
                  onSelect={handleSelectRoadmap}
                  isEnhancing={isEnhancing && geminiEnhancing === template.id}
                  hasGeminiKey={!!apiKey}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

interface RoadmapCardProps {
  template: RoadmapTemplate;
  onSelect: (template: RoadmapTemplate, enhanceWithAI: boolean) => void;
  isEnhancing: boolean;
  hasGeminiKey: boolean;
}

function RoadmapCard({ template, onSelect, isEnhancing, hasGeminiKey }: RoadmapCardProps) {
  return (
    <div className="glass-morphism p-4 rounded-lg border border-white/10 hover:border-brand-500/50 transition-all">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-lg">{template.title}</h3>
        <Badge variant="outline">{template.steps.length} steps</Badge>
      </div>
      
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        <Clock className="h-3 w-3" />
        <span>
          Est. {
            template.steps.some(s => s.estTime === "ongoing") 
              ? "8+ weeks" 
              : `${Math.ceil(template.steps.length * 2.5)} weeks`
          }
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        {template.steps.slice(0, 3).map((step, idx) => (
          <div key={idx} className="text-sm flex items-center gap-2">
            <span className="bg-white/10 text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {step.order}
            </span>
            <span className="text-white/80">{step.label}</span>
          </div>
        ))}
        {template.steps.length > 3 && (
          <div className="text-xs text-muted-foreground text-center mt-1">
            + {template.steps.length - 3} more steps
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-2">
        <Button 
          onClick={() => onSelect(template, false)}
          variant="default"
          className="w-full"
        >
          <CheckCircle2 className="h-4 w-4 mr-2" /> 
          Use This Roadmap
        </Button>
        
        {hasGeminiKey && (
          <Button 
            onClick={() => onSelect(template, true)}
            variant="outline"
            disabled={isEnhancing}
            className="w-full"
          >
            {isEnhancing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Enhancing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" /> 
                Personalize with AI
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
