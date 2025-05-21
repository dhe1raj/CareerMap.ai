
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/hooks/use-user-data";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportElementToPDF } from "@/utils/pdfExport";
import { toast } from "sonner";
import { ArrowRight, FileDown, Trash2, Calendar, CheckCircle, BookOpen, Wrench, Clock, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface RoadmapResource {
  id: string;
  label: string;
  url: string | null;
  completed: boolean;
}

interface RoadmapSkill {
  id: string;
  label: string;
  completed: boolean;
}

interface RoadmapTool {
  id: string;
  label: string;
  completed: boolean;
}

interface RoadmapTimelineItem {
  id: string;
  step: string;
  order_number: number;
  completed: boolean;
}

interface RoadmapDetails {
  resources: RoadmapResource[];
  skills: RoadmapSkill[];
  tools: RoadmapTool[];
  timeline: RoadmapTimelineItem[];
}

export default function CareerProgress() {
  const navigate = useNavigate();
  const { userData, isLoading, fetchUserData } = useUserData();
  const { user } = useAuth();
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [isRoadmapsLoading, setIsRoadmapsLoading] = useState(true);
  const [roadmapDetails, setRoadmapDetails] = useState<Record<string, RoadmapDetails>>({});
  const [activeTab, setActiveTab] = useState<string>('main');
  
  useEffect(() => {
    // First try to get roadmaps from Supabase if the user is logged in
    const fetchRoadmaps = async () => {
      setIsRoadmapsLoading(true);
      
      if (user) {
        try {
          // Fetch all user roadmaps with their steps
          const { data, error } = await supabase
            .from('user_roadmaps')
            .select('*, user_roadmap_steps(*)')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });
          
          if (error) {
            console.error("Error fetching roadmaps from Supabase:", error);
            loadFromLocalStorage();
          } else if (data && data.length > 0) {
            // Transform the data to match our expected format
            const formattedRoadmaps = data.map(roadmap => ({
              id: roadmap.id,
              title: roadmap.title,
              lastUpdated: roadmap.updated_at,
              category: roadmap.category,
              steps: roadmap.user_roadmap_steps.map((step: any) => ({
                order: step.order_number,
                label: step.label,
                estTime: step.est_time,
                completed: step.completed
              }))
            }));
            
            setRoadmaps(formattedRoadmaps);
            
            // Fetch detailed roadmap data for each roadmap
            formattedRoadmaps.forEach(roadmap => {
              fetchRoadmapDetails(roadmap.id);
            });
          } else {
            loadFromLocalStorage();
          }
        } catch (error) {
          console.error("Failed to fetch roadmaps:", error);
          loadFromLocalStorage();
        } finally {
          setIsRoadmapsLoading(false);
        }
      } else {
        // If not logged in, fall back to localStorage
        loadFromLocalStorage();
        setIsRoadmapsLoading(false);
      }
    };
    
    const fetchRoadmapDetails = async (roadmapId: string) => {
      if (!user) return;
      
      try {
        // Fetch resources
        const { data: resources, error: resourcesError } = await supabase
          .from('roadmap_resources')
          .select('*')
          .eq('roadmap_id', roadmapId);
          
        if (resourcesError) throw resourcesError;
        
        // Fetch skills
        const { data: skills, error: skillsError } = await supabase
          .from('roadmap_skills')
          .select('*')
          .eq('roadmap_id', roadmapId);
          
        if (skillsError) throw skillsError;
        
        // Fetch tools
        const { data: tools, error: toolsError } = await supabase
          .from('roadmap_tools')
          .select('*')
          .eq('roadmap_id', roadmapId);
          
        if (toolsError) throw toolsError;
        
        // Fetch timeline
        const { data: timeline, error: timelineError } = await supabase
          .from('roadmap_timeline')
          .select('*')
          .eq('roadmap_id', roadmapId)
          .order('order_number', { ascending: true });
          
        if (timelineError) throw timelineError;
        
        setRoadmapDetails(prev => ({
          ...prev,
          [roadmapId]: {
            resources: resources || [],
            skills: skills || [],
            tools: tools || [],
            timeline: timeline || []
          }
        }));
      } catch (error) {
        console.error(`Error fetching details for roadmap ${roadmapId}:`, error);
      }
    };
    
    // Fallback to localStorage if Supabase fails or user is not logged in
    const loadFromLocalStorage = () => {
      // Get saved roadmaps from localStorage for now
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          if (parsedData.userRoadmaps && Array.isArray(parsedData.userRoadmaps)) {
            setRoadmaps(parsedData.userRoadmaps);
          } else if (parsedData.userRoadmap) {
            // Handle single roadmap case
            setRoadmaps([parsedData.userRoadmap]);
          }
        } catch (error) {
          console.error("Failed to parse saved roadmaps:", error);
        }
      }
    };
    
    fetchRoadmaps();
    
    // Set up realtime subscription for roadmap updates
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
            // When steps change, refetch the roadmaps
            fetchRoadmaps();
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);
  
  const calculateProgress = (roadmap: any) => {
    if (!roadmap?.steps || roadmap.steps.length === 0) return 0;
    const completed = roadmap.steps.filter((step: any) => step.completed).length;
    return Math.round((completed / roadmap.steps.length) * 100);
  };
  
  const calculateDetailedProgress = (roadmapId: string) => {
    const details = roadmapDetails[roadmapId];
    if (!details) return 0;
    
    let totalItems = 0;
    let completedItems = 0;
    
    if (details.resources.length) {
      totalItems += details.resources.length;
      completedItems += details.resources.filter(r => r.completed).length;
    }
    
    if (details.skills.length) {
      totalItems += details.skills.length;
      completedItems += details.skills.filter(s => s.completed).length;
    }
    
    if (details.tools.length) {
      totalItems += details.tools.length;
      completedItems += details.tools.filter(t => t.completed).length;
    }
    
    if (details.timeline.length) {
      totalItems += details.timeline.length;
      completedItems += details.timeline.filter(t => t.completed).length;
    }
    
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };
  
  const handleToggleDetailItem = async (roadmapId: string, itemType: 'resources' | 'skills' | 'tools' | 'timeline', itemId: string) => {
    if (!user) return;
    
    const details = roadmapDetails[roadmapId];
    if (!details) return;
    
    const item = details[itemType].find(i => i.id === itemId);
    if (!item) return;
    
    const newCompletedStatus = !item.completed;
    
    try {
      // Update the item in Supabase
      let tableName;
      if (itemType === 'resources') tableName = 'roadmap_resources';
      else if (itemType === 'skills') tableName = 'roadmap_skills';
      else if (itemType === 'tools') tableName = 'roadmap_tools';
      else if (itemType === 'timeline') tableName = 'roadmap_timeline';
      
      if (tableName) {
        const { error } = await supabase
          .from(tableName)
          .update({ completed: newCompletedStatus })
          .eq('id', itemId);
          
        if (error) throw error;
      }
      
      // Update local state
      setRoadmapDetails(prev => {
        const updatedDetails = { ...prev };
        const itemIndex = updatedDetails[roadmapId][itemType].findIndex(i => i.id === itemId);
        if (itemIndex >= 0) {
          updatedDetails[roadmapId][itemType][itemIndex].completed = newCompletedStatus;
        }
        return updatedDetails;
      });
      
      // Show toast
      if (newCompletedStatus) {
        toast.success("Item marked as complete!");
      } else {
        toast.success("Item marked as incomplete");
      }
      
    } catch (error) {
      console.error("Error updating item status:", error);
      toast.error("Failed to update item status");
    }
  };
  
  const handleToggleStep = async (roadmapId: string, stepId: string, completed: boolean) => {
    try {
      if (user) {
        // Update in Supabase
        const { error } = await supabase
          .from('user_roadmap_steps')
          .update({ completed: !completed })
          .eq('id', stepId);
          
        if (error) throw error;
      }
      
      // Update local state
      setRoadmaps(prevRoadmaps => {
        return prevRoadmaps.map(roadmap => {
          if (roadmap.id === roadmapId) {
            const updatedSteps = roadmap.steps.map((step: any) => {
              if (step.id === stepId) {
                return { ...step, completed: !completed };
              }
              return step;
            });
            return { ...roadmap, steps: updatedSteps };
          }
          return roadmap;
        });
      });
      
      if (!completed) {
        toast.success("Step marked as complete!");
      } else {
        toast.success("Step marked as incomplete");
      }
      
      // Refresh user data to update dashboard
      fetchUserData();
    } catch (error) {
      console.error("Error updating step status:", error);
      toast.error("Failed to update step status");
    }
  };
  
  const handleExportPDF = (roadmap: any) => {
    try {
      const element = document.getElementById(`roadmap-${roadmap.id}`);
      if (!element) return;
      
      exportElementToPDF(element, `${roadmap.title}-roadmap.pdf`)
        .then(() => toast.success("PDF exported successfully"))
        .catch(() => toast.error("Failed to export PDF"));
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF");
    }
  };
  
  const handleDeleteRoadmap = async (id: string) => {
    if (user) {
      try {
        // Delete related data first
        await Promise.all([
          supabase.from('roadmap_resources').delete().eq('roadmap_id', id),
          supabase.from('roadmap_skills').delete().eq('roadmap_id', id),
          supabase.from('roadmap_tools').delete().eq('roadmap_id', id),
          supabase.from('roadmap_timeline').delete().eq('roadmap_id', id),
          supabase.from('user_roadmap_steps').delete().eq('roadmap_id', id)
        ]);
        
        // Then delete the main roadmap
        const { error } = await supabase
          .from('user_roadmaps')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        // Update local state
        setRoadmaps(prevRoadmaps => prevRoadmaps.filter(roadmap => roadmap.id !== id));
        toast.success("Roadmap deleted");
        
        // Remove from roadmapDetails state
        setRoadmapDetails(prev => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
        
        // Refresh user data to update dashboard
        fetchUserData();
      } catch (error) {
        console.error("Error deleting roadmap:", error);
        toast.error("Failed to delete roadmap");
      }
    } else {
      // Fallback to localStorage for non-logged in users
      const updatedRoadmaps = roadmaps.filter(roadmap => roadmap.id !== id);
      setRoadmaps(updatedRoadmaps);
      
      // Update localStorage
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          parsedData.userRoadmaps = updatedRoadmaps;
          localStorage.setItem('userData', JSON.stringify(parsedData));
          toast.success("Roadmap deleted");
          
          // Refresh user data to update dashboard
          fetchUserData();
        } catch (error) {
          console.error("Failed to update localStorage:", error);
          toast.error("Failed to delete roadmap");
        }
      }
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return 'Unknown date';
    }
  };
  
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Career Progress</h1>
          <p className="text-muted-foreground mt-2">Track and manage your career roadmaps</p>
        </div>
        
        {isRoadmapsLoading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-lg">Loading your roadmaps...</p>
            </div>
          </div>
        ) : roadmaps.length === 0 ? (
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>No Roadmaps Found</CardTitle>
              <CardDescription>
                You haven't created any roadmaps yet. Start one from the Career Design page!
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <Button onClick={() => navigate("/career-designer")} className="glowing-purple">
                Create Your First Roadmap
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {roadmaps.map((roadmap, index) => (
              <Card 
                key={roadmap.id || index} 
                className="glass-morphism transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]" 
                id={`roadmap-${roadmap.id}`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{roadmap.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <CardDescription className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {roadmap.lastUpdated ? formatDate(roadmap.lastUpdated) : 'No date available'}
                        </CardDescription>
                        {roadmap.category && (
                          <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                            {roadmap.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Badge className="bg-purple-500/20 text-white border-purple-500/30 backdrop-blur-sm">
                      {calculateProgress(roadmap)}% Complete
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress 
                    value={roadmapDetails[roadmap.id] ? calculateDetailedProgress(roadmap.id) : calculateProgress(roadmap)} 
                    className="h-2 mb-6" 
                  />
                  
                  <Tabs defaultValue="steps" className="w-full">
                    <TabsList className="w-full grid grid-cols-5">
                      <TabsTrigger value="steps">Steps</TabsTrigger>
                      <TabsTrigger 
                        value="timeline" 
                        disabled={!roadmapDetails[roadmap.id]?.timeline?.length}
                      >
                        Timeline
                      </TabsTrigger>
                      <TabsTrigger 
                        value="skills" 
                        disabled={!roadmapDetails[roadmap.id]?.skills?.length}
                      >
                        Skills
                      </TabsTrigger>
                      <TabsTrigger 
                        value="tools" 
                        disabled={!roadmapDetails[roadmap.id]?.tools?.length}
                      >
                        Tools
                      </TabsTrigger>
                      <TabsTrigger 
                        value="resources" 
                        disabled={!roadmapDetails[roadmap.id]?.resources?.length}
                      >
                        Resources
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="steps" className="space-y-4 mt-4">
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {roadmap.steps && roadmap.steps.map((step: any, stepIndex: number) => (
                          <div 
                            key={step.id || stepIndex} 
                            className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                              step.completed 
                                ? "bg-brand-500/20 shadow-[0_0_10px_rgba(168,85,247,0.3)]" 
                                : "bg-white/5"
                            }`}
                          >
                            <Checkbox 
                              checked={step.completed} 
                              onCheckedChange={() => handleToggleStep(roadmap.id, step.id, !!step.completed)}
                              className={step.completed ? "text-brand-500" : ""}
                            />
                            <div className="flex-1">
                              <div className="font-medium">{step.label}</div>
                              {step.estTime && (
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                  <Clock className="h-3 w-3 mr-1" /> {step.estTime}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="timeline" className="space-y-4 mt-4">
                      {roadmapDetails[roadmap.id]?.timeline?.length > 0 ? (
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                          {roadmapDetails[roadmap.id].timeline.map(item => (
                            <div 
                              key={item.id} 
                              className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                                item.completed 
                                  ? "bg-brand-500/20 shadow-[0_0_10px_rgba(168,85,247,0.3)]" 
                                  : "bg-white/5"
                              }`}
                            >
                              <Checkbox 
                                checked={item.completed} 
                                onCheckedChange={() => handleToggleDetailItem(roadmap.id, 'timeline', item.id)}
                                className={item.completed ? "text-brand-500" : ""}
                              />
                              <div className="flex-1">
                                <div className="font-medium">
                                  <Badge className="bg-blue-500/20 text-white border-blue-500/30 mr-2">
                                    {item.order_number}
                                  </Badge>
                                  {item.step}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">No timeline data available</p>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="skills" className="mt-4">
                      {roadmapDetails[roadmap.id]?.skills?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                          {roadmapDetails[roadmap.id].skills.map(skill => (
                            <div 
                              key={skill.id} 
                              className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                                skill.completed 
                                  ? "bg-brand-500/20 shadow-[0_0_10px_rgba(168,85,247,0.3)]" 
                                  : "bg-white/5"
                              }`}
                            >
                              <Checkbox 
                                checked={skill.completed} 
                                onCheckedChange={() => handleToggleDetailItem(roadmap.id, 'skills', skill.id)}
                                className={skill.completed ? "text-brand-500" : ""}
                              />
                              <div className="flex-1">
                                <div className="font-medium">{skill.label}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">No skills data available</p>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="tools" className="mt-4">
                      {roadmapDetails[roadmap.id]?.tools?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                          {roadmapDetails[roadmap.id].tools.map(tool => (
                            <div 
                              key={tool.id} 
                              className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                                tool.completed 
                                  ? "bg-brand-500/20 shadow-[0_0_10px_rgba(168,85,247,0.3)]" 
                                  : "bg-white/5"
                              }`}
                            >
                              <Checkbox 
                                checked={tool.completed} 
                                onCheckedChange={() => handleToggleDetailItem(roadmap.id, 'tools', tool.id)}
                                className={tool.completed ? "text-brand-500" : ""}
                              />
                              <div className="flex-1">
                                <div className="font-medium">{tool.label}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">No tools data available</p>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="resources" className="mt-4">
                      {roadmapDetails[roadmap.id]?.resources?.length > 0 ? (
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                          {roadmapDetails[roadmap.id].resources.map(resource => (
                            <div 
                              key={resource.id} 
                              className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                                resource.completed 
                                  ? "bg-brand-500/20 shadow-[0_0_10px_rgba(168,85,247,0.3)]" 
                                  : "bg-white/5"
                              }`}
                            >
                              <Checkbox 
                                checked={resource.completed} 
                                onCheckedChange={() => handleToggleDetailItem(roadmap.id, 'resources', resource.id)}
                                className={resource.completed ? "text-brand-500" : ""}
                              />
                              <div className="flex-1">
                                <div className="font-medium">{resource.label}</div>
                                {resource.url && (
                                  <a 
                                    href={resource.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center text-xs text-blue-400 hover:text-blue-300 mt-1"
                                  >
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    {resource.url}
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">No resources data available</p>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-white/10 pt-4">
                  <div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleExportPDF(roadmap)}
                    >
                      <FileDown className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                  </div>
                  <div className="space-x-2">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteRoadmap(roadmap.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
