
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SuggestionChip } from "./SuggestionChip";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "./ProgressBar";
import { ArrowRight, FileText, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGeminiCareer } from "@/hooks/use-gemini-career";
import { UserData } from "@/hooks/use-user-data";
import { exportElementToPDF } from "@/utils/pdfExport";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface CareerProgressProps {
  userData: UserData;
  onUpdateField: (path: string, value: any) => void;
  isLoadingSuggestions?: boolean;
}

interface RoadmapSummary {
  id: string;
  title: string;
  skills: string[];
  tools: string[];
  resources: { label: string; url?: string }[];
}

export function CareerProgress({ 
  userData, 
  onUpdateField,
  isLoadingSuggestions = false
}: CareerProgressProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { generateSuggestions, isProcessing } = useGeminiCareer();
  const [roadmapRef, setRoadmapRef] = useState<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(userData.career.progress);
  const { user } = useAuth();
  const [latestRoadmap, setLatestRoadmap] = useState<RoadmapSummary | null>(null);
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(true);
  
  // Get progress from the roadmaps and fetch the latest roadmap data
  useEffect(() => {
    const fetchProgress = async () => {
      // First try to get progress from Supabase if the user is logged in
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_roadmaps')
            .select('*, user_roadmap_steps(*)')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });
          
          if (error) {
            console.error("Error fetching roadmaps from Supabase:", error);
            fallbackToLocalStorage();
          } else if (data && data.length > 0) {
            // Calculate combined progress from all roadmaps
            const averageProgress = data.reduce((sum: number, roadmap: any) => {
              if (roadmap.user_roadmap_steps && roadmap.user_roadmap_steps.length > 0) {
                const completed = roadmap.user_roadmap_steps.filter((step: any) => step.completed).length;
                return sum + (completed / roadmap.user_roadmap_steps.length * 100);
              }
              return sum;
            }, 0) / data.length;
            
            const roundedProgress = Math.round(averageProgress);
            setProgress(roundedProgress);
            onUpdateField('career.progress', roundedProgress);
            
            // Fetch the most recent roadmap's detailed data
            if (data[0]) {
              fetchLatestRoadmapDetails(data[0].id);
            }
          } else {
            fallbackToLocalStorage();
          }
        } catch (error) {
          console.error("Failed to fetch roadmaps progress:", error);
          fallbackToLocalStorage();
        } finally {
          setIsLoadingRoadmap(false);
        }
      } else {
        // If not logged in, fall back to localStorage
        fallbackToLocalStorage();
        setIsLoadingRoadmap(false);
      }
    };
    
    const fetchLatestRoadmapDetails = async (roadmapId: string) => {
      try {
        // Fetch skills
        const { data: skills, error: skillsError } = await supabase
          .from('roadmap_skills')
          .select('label')
          .eq('roadmap_id', roadmapId);
          
        if (skillsError) throw skillsError;
        
        // Fetch tools
        const { data: tools, error: toolsError } = await supabase
          .from('roadmap_tools')
          .select('label')
          .eq('roadmap_id', roadmapId);
          
        if (toolsError) throw toolsError;
        
        // Fetch resources
        const { data: resources, error: resourcesError } = await supabase
          .from('roadmap_resources')
          .select('label, url')
          .eq('roadmap_id', roadmapId);
          
        if (resourcesError) throw resourcesError;
        
        // Fetch the roadmap title
        const { data: roadmap, error: roadmapError } = await supabase
          .from('user_roadmaps')
          .select('title')
          .eq('id', roadmapId)
          .single();
          
        if (roadmapError) throw roadmapError;
        
        setLatestRoadmap({
          id: roadmapId,
          title: roadmap.title,
          skills: skills.map((s: any) => s.label),
          tools: tools.map((t: any) => t.label),
          resources: resources.map((r: any) => ({ label: r.label, url: r.url }))
        });
      } catch (error) {
        console.error("Error fetching latest roadmap details:", error);
      }
    };
    
    // Fallback to localStorage if Supabase fails or user is not logged in
    const fallbackToLocalStorage = () => {
      // Load progress data from localStorage
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          if (parsedData.userRoadmaps && Array.isArray(parsedData.userRoadmaps)) {
            // Calculate combined progress from all roadmaps
            if (parsedData.userRoadmaps.length > 0) {
              const averageProgress = parsedData.userRoadmaps.reduce((sum: number, roadmap: any) => {
                if (roadmap.steps && roadmap.steps.length > 0) {
                  const completed = roadmap.steps.filter((step: any) => step.completed).length;
                  return sum + (completed / roadmap.steps.length * 100);
                }
                return sum;
              }, 0) / parsedData.userRoadmaps.length;
              
              setProgress(Math.round(averageProgress));
              onUpdateField('career.progress', Math.round(averageProgress));
              
              // Set latest roadmap from local storage (simplified)
              const latestRoadmap = parsedData.userRoadmaps[0];
              if (latestRoadmap) {
                // Extract skills, tools, resources from the steps if available
                const skills: string[] = [];
                const tools: string[] = [];
                const resources: {label: string, url?: string}[] = [];
                
                latestRoadmap.steps.forEach((step: any) => {
                  const label = step.label.toLowerCase();
                  if (label.includes('skill')) skills.push(step.label);
                  else if (label.includes('tool')) tools.push(step.label);
                  else if (label.includes('resource') || label.includes('http')) {
                    let url;
                    const urlMatch = step.label.match(/\((https?:\/\/[^\s)]+)\)/);
                    if (urlMatch) url = urlMatch[1];
                    resources.push({ label: step.label, url });
                  }
                });
                
                setLatestRoadmap({
                  id: latestRoadmap.id,
                  title: latestRoadmap.title,
                  skills,
                  tools,
                  resources
                });
              }
            } else {
              setProgress(userData.career.progress);
            }
          } else if (parsedData.userRoadmap) {
            // Handle single roadmap case
            if (parsedData.userRoadmap.steps && parsedData.userRoadmap.steps.length > 0) {
              const completed = parsedData.userRoadmap.steps.filter((step: any) => step.completed).length;
              const roadmapProgress = Math.round((completed / parsedData.userRoadmap.steps.length) * 100);
              
              setProgress(roadmapProgress);
              onUpdateField('career.progress', roadmapProgress);
            }
          }
        } catch (error) {
          console.error("Failed to parse saved roadmaps:", error);
        }
      }
    };
    
    fetchProgress();
    
    // Set up Supabase realtime subscription for user_roadmaps changes
    if (user) {
      const channel = supabase
        .channel('roadmap-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_roadmap_steps',
          },
          () => {
            // When steps change, refetch the progress data
            fetchProgress();
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userData, onUpdateField, user]);
  
  useEffect(() => {
    // Generate suggestions if none exist
    const fetchSuggestions = async () => {
      if (userData.career.suggestions.length === 0 && !isProcessing && !isLoadingSuggestions) {
        const suggestions = await generateSuggestions(userData);
        if (suggestions.length > 0) {
          onUpdateField('career.suggestions', suggestions);
        }
      }
    };
    
    fetchSuggestions();
  }, [userData, generateSuggestions, onUpdateField, isProcessing, isLoadingSuggestions]);
  
  const handleDesignCareer = () => {
    navigate('/career-designer');
  };
  
  const handleViewProgress = () => {
    navigate('/career-progress');
  };
  
  const handleExportRoadmap = async () => {
    if (!userData.career.roadmap) {
      toast({
        title: "No roadmap available",
        description: "Complete your career design first to generate a roadmap.",
        variant: "destructive"
      });
      return;
    }
    
    if (!roadmapRef) {
      toast({
        title: "Error",
        description: "Cannot export roadmap at this time.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await exportElementToPDF(roadmapRef, 'CareerForge-Roadmap.pdf');
      toast({
        title: "PDF Downloaded",
        description: "Your career roadmap has been downloaded."
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your roadmap.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card className="glass-morphism shadow-[0_0_15px_rgba(168,85,247,0.2)]">
      <CardHeader>
        <CardTitle className="text-gradient">Career Progress</CardTitle>
        <CardDescription>Your progress toward career goals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProgressBar progress={progress} />
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-white/70">Suggested Roles</h4>
          
          {isProcessing || isLoadingSuggestions ? (
            <div className="flex justify-center py-2">
              <div className="w-6 h-6 border-2 border-t-brand-400 border-white/20 rounded-full animate-spin"></div>
            </div>
          ) : userData.career.suggestions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {userData.career.suggestions.map((suggestion, index) => (
                <SuggestionChip key={index} label={suggestion} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/60 italic">
              Complete your career design to get personalized suggestions
            </p>
          )}
        </div>
        
        {isLoadingRoadmap ? (
          <div className="flex justify-center py-2">
            <div className="w-6 h-6 border-2 border-t-brand-400 border-white/20 rounded-full animate-spin"></div>
          </div>
        ) : latestRoadmap ? (
          <div 
            className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10"
            ref={(ref) => setRoadmapRef(ref)}
          >
            <h4 className="text-sm font-semibold text-gradient mb-2">
              Latest Roadmap: {latestRoadmap.title}
            </h4>
            
            <Tabs defaultValue="skills" className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-2">
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="tools">Tools</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>
              
              <TabsContent value="skills" className="mt-2 space-y-2">
                {latestRoadmap.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {latestRoadmap.skills.map((skill, index) => (
                      <Badge key={index} className="bg-purple-800/50 hover:bg-purple-700/60 text-white">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-white/60 italic">No skills defined in this roadmap</p>
                )}
              </TabsContent>
              
              <TabsContent value="tools" className="mt-2 space-y-2">
                {latestRoadmap.tools.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {latestRoadmap.tools.map((tool, index) => (
                      <Badge key={index} className="bg-blue-800/50 hover:bg-blue-700/60 text-white">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-white/60 italic">No tools defined in this roadmap</p>
                )}
              </TabsContent>
              
              <TabsContent value="resources" className="mt-2 space-y-2">
                {latestRoadmap.resources.length > 0 ? (
                  <div className="space-y-2">
                    {latestRoadmap.resources.map((resource, index) => (
                      <div key={index} className="text-xs">
                        {resource.url ? (
                          <a 
                            href={resource.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-400 hover:text-blue-300 underline"
                          >
                            {resource.label}
                          </a>
                        ) : (
                          <span>{resource.label}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-white/60 italic">No resources defined in this roadmap</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        ) : userData.career.roadmap && (
          <div 
            className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10"
            ref={(ref) => setRoadmapRef(ref)}
          >
            <h4 className="text-sm font-medium text-gradient mb-2">Your Career Roadmap</h4>
            <div className="text-xs text-white/70">
              {userData.career.roadmap}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleDesignCareer} className="flex-1 mr-2">
          {userData.career.roadmap ? "Update Career Design" : "Design My Career"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        
        <Button 
          onClick={handleViewProgress} 
          variant="outline" 
          className="ml-2"
        >
          {latestRoadmap ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Track Progress
            </>
          ) : (
            <>
              View Progress
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
