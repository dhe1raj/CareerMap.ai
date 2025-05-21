
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGeminiContext } from "@/context/GeminiContext";
import { useGeminiCareer } from "@/hooks/use-gemini-career";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckIcon, Info, Link as LinkIcon, ChevronDown, ChevronUp, Sparkles, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface RoadmapItem {
  label: string;
  tooltip: string;
  link: string;
  completed?: boolean;
}

interface RoadmapSection {
  title: string;
  items: RoadmapItem[];
  isOpen?: boolean;
}

interface Roadmap {
  title: string;
  sections: RoadmapSection[];
}

export default function GenZCareerDecider() {
  const navigate = useNavigate();
  const { apiKey } = useGeminiContext();
  const { generateGenZRoadmap, isProcessing } = useGeminiCareer();
  const { toast: useAppToast } = useToast();
  const { user } = useAuth();
  
  const [careerRole, setCareerRole] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState<Roadmap | null>(null);
  const [openSections, setOpenSections] = useState<{[key: string]: boolean}>({});
  const [progress, setProgress] = useState(0);
  
  // Initialize sections to be open by default
  useEffect(() => {
    if (generatedRoadmap) {
      const initialOpenState: {[key: string]: boolean} = {};
      generatedRoadmap.sections.forEach((section, index) => {
        initialOpenState[section.title] = index === 0; // Open only first section by default
      });
      setOpenSections(initialOpenState);
    }
  }, [generatedRoadmap]);
  
  // Calculate progress based on completed items
  useEffect(() => {
    if (generatedRoadmap) {
      const allItems = generatedRoadmap.sections.flatMap(section => section.items);
      const completedItems = allItems.filter(item => item.completed);
      const calculatedProgress = allItems.length > 0 
        ? Math.round((completedItems.length / allItems.length) * 100)
        : 0;
      setProgress(calculatedProgress);
    }
  }, [generatedRoadmap]);
  
  const handleToggleSection = (title: string) => {
    setOpenSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };
  
  const handleGenerate = async () => {
    if (!careerRole.trim()) {
      useAppToast({
        title: "Error",
        description: "Please enter a career role",
        variant: "destructive"
      });
      return;
    }
    
    if (!apiKey) {
      useAppToast({
        title: "API Key Required",
        description: "Please add a Gemini API key in settings to use this feature.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const roadmap = await generateGenZRoadmap(careerRole);
      
      if (roadmap) {
        // Ensure all items have a completed property
        const processedRoadmap = {
          ...roadmap,
          sections: roadmap.sections.map(section => ({
            ...section,
            items: section.items.map(item => ({
              ...item,
              completed: false
            }))
          }))
        };
        
        setGeneratedRoadmap(processedRoadmap);
        toast.success("Roadmap generated successfully!");
      }
    } catch (error) {
      console.error("Error generating roadmap:", error);
      toast.error("Failed to generate roadmap. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleToggleComplete = (sectionIndex: number, itemIndex: number) => {
    if (!generatedRoadmap) return;
    
    setGeneratedRoadmap(prev => {
      if (!prev) return null;
      
      const newRoadmap = {...prev};
      const newSections = [...newRoadmap.sections];
      const newSection = {...newSections[sectionIndex]};
      const newItems = [...newSection.items];
      newItems[itemIndex] = {
        ...newItems[itemIndex],
        completed: !newItems[itemIndex].completed
      };
      newSection.items = newItems;
      newSections[sectionIndex] = newSection;
      newRoadmap.sections = newSections;
      
      return newRoadmap;
    });
  };
  
  const handleSaveRoadmap = async () => {
    if (!generatedRoadmap) return;
    if (!user) {
      useAppToast({
        title: "Login Required",
        description: "Please log in to save your roadmap.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Create a new roadmap in Supabase
      const { data: roadmapData, error: roadmapError } = await supabase
        .from('roadmaps')
        .insert({
          user_id: user.id,
          title: generatedRoadmap.title,
          description: `GenZ career roadmap for ${generatedRoadmap.title}`,
          role_id: null, // No specific role ID for custom roadmaps
          is_public: false,
          sections: generatedRoadmap.sections
        })
        .select('id')
        .single();
        
      if (roadmapError) {
        throw roadmapError;
      }
      
      if (roadmapData) {
        // Create a progress entry
        const { error: progressError } = await supabase
          .from('users_roadmap_progress')
          .insert({
            user_id: user.id,
            roadmap_id: roadmapData.id,
            progress_pct: progress,
            completed_items: generatedRoadmap.sections
              .flatMap(section => section.items)
              .filter(item => item.completed)
              .map(item => item.label)
          });
          
        if (progressError) {
          throw progressError;
        }
        
        toast.success("Roadmap saved successfully!");
        navigate('/career-progress');
      }
    } catch (error) {
      console.error("Error saving roadmap:", error);
      toast.error("Failed to save roadmap. Please try again.");
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient">
            GenZ Career Path AI Generator
          </h1>
          <p className="text-muted-foreground mt-2">
            Get a personalized roadmap for your dream career as a GenZ student
          </p>
        </div>
        
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle>Generate Your Career Roadmap</CardTitle>
            <CardDescription>
              Tell us what career role you're interested in, and we'll generate a step-by-step roadmap tailored for GenZ students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter career role (e.g. Frontend Developer, Data Scientist)"
                value={careerRole}
                onChange={(e) => setCareerRole(e.target.value)}
                className="glass-input"
              />
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || !careerRole.trim()}
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Roadmap
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
            <p className="mt-4 text-lg text-purple-300">Generating your personalized roadmap...</p>
            <p className="text-sm text-muted-foreground">This may take a few moments</p>
          </div>
        )}
        
        {generatedRoadmap && !isGenerating && (
          <div className="space-y-6">
            <Card className="glass-morphism">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{generatedRoadmap.title} Roadmap</CardTitle>
                    <CardDescription>Your personalized GenZ career path</CardDescription>
                  </div>
                  <Badge className="bg-purple-500/80 hover:bg-purple-600/80">
                    {progress}% Complete
                  </Badge>
                </div>
                <Progress value={progress} className="h-2 bg-purple-900/30" />
              </CardHeader>
              <CardContent className="space-y-6">
                {generatedRoadmap.sections.map((section, sectionIndex) => (
                  <Collapsible
                    key={`section-${sectionIndex}`}
                    open={openSections[section.title]}
                    onOpenChange={() => handleToggleSection(section.title)}
                    className="border border-white/10 rounded-lg bg-white/5"
                  >
                    <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left">
                      <h3 className="text-lg font-medium text-purple-400">{section.title}</h3>
                      {openSections[section.title] ? (
                        <ChevronUp className="h-4 w-4 text-purple-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-purple-400" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4 pt-0">
                      <ul className="space-y-3">
                        {section.items.map((item, itemIndex) => (
                          <li 
                            key={`item-${sectionIndex}-${itemIndex}`} 
                            className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                              item.completed 
                                ? "bg-brand-500/20 shadow-[0_0_10px_rgba(168,85,247,0.3)]" 
                                : "bg-white/5 hover:bg-white/10"
                            }`}
                          >
                            <div>
                              <button
                                onClick={() => handleToggleComplete(sectionIndex, itemIndex)}
                                className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                                  item.completed 
                                    ? "bg-purple-500 border-purple-400" 
                                    : "border-white/30 bg-transparent hover:bg-white/10"
                                }`}
                              >
                                {item.completed && <CheckIcon className="h-4 w-4 text-white" />}
                              </button>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium flex items-center gap-2">
                                {item.label}
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{item.tooltip}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground mt-1">
                                <a 
                                  href={item.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center hover:text-purple-400 transition-colors"
                                >
                                  <LinkIcon className="h-3 w-3 mr-1" />
                                  Resource Link
                                </a>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </CardContent>
              <CardFooter className="border-t border-white/10 pt-4">
                <Button
                  onClick={handleSaveRoadmap}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 ml-auto"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Confirm & Track This Roadmap
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
