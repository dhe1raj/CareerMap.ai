
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Calendar, CheckCircle, BookOpen, Wrench } from "lucide-react";
import { toast } from "sonner";
import { RoadmapResource, RoadmapSkill, RoadmapTool, RoadmapTimeline, supabaseCustom } from "@/utils/supabase-helpers";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import confetti from 'canvas-confetti';

interface RoadmapProgressTrackerProps {
  roadmapId: string;
  title: string;
  onProgressUpdate?: (progress: number) => void;
}

export function RoadmapProgressTracker({ roadmapId, title, onProgressUpdate }: RoadmapProgressTrackerProps) {
  const { user } = useAuth();
  const [resources, setResources] = useState<RoadmapResource[]>([]);
  const [skills, setSkills] = useState<RoadmapSkill[]>([]);
  const [tools, setTools] = useState<RoadmapTool[]>([]);
  const [timeline, setTimeline] = useState<RoadmapTimeline[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState("skills");
  
  // Fetch all roadmap data
  useEffect(() => {
    if (!roadmapId) return;
    
    const fetchRoadmapData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch skills
        const { data: skillsData, error: skillsError } = await supabaseCustom.skills.getByRoadmapId(roadmapId);
        if (skillsError) throw skillsError;
        setSkills(skillsData || []);
        
        // Fetch tools
        const { data: toolsData, error: toolsError } = await supabaseCustom.tools.getByRoadmapId(roadmapId);
        if (toolsError) throw toolsError;
        setTools(toolsData || []);
        
        // Fetch resources
        const { data: resourcesData, error: resourcesError } = await supabaseCustom.resources.getByRoadmapId(roadmapId);
        if (resourcesError) throw resourcesError;
        setResources(resourcesData || []);
        
        // Fetch timeline
        const { data: timelineData, error: timelineError } = await supabaseCustom.timeline.getByRoadmapId(roadmapId);
        if (timelineError) throw timelineError;
        setTimeline(timelineData || []);
        
      } catch (error) {
        console.error("Error fetching roadmap data:", error);
        toast.error("Failed to load roadmap data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRoadmapData();
    
    // Set up realtime subscriptions for updates
    const skillsChannel = supabase
      .channel('roadmap-skills-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'roadmap_skills', filter: `roadmap_id=eq.${roadmapId}` },
        () => refreshSkills()
      )
      .subscribe();
      
    const toolsChannel = supabase
      .channel('roadmap-tools-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'roadmap_tools', filter: `roadmap_id=eq.${roadmapId}` },
        () => refreshTools()
      )
      .subscribe();
      
    const resourcesChannel = supabase
      .channel('roadmap-resources-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'roadmap_resources', filter: `roadmap_id=eq.${roadmapId}` },
        () => refreshResources()
      )
      .subscribe();
      
    const timelineChannel = supabase
      .channel('roadmap-timeline-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'roadmap_timeline', filter: `roadmap_id=eq.${roadmapId}` },
        () => refreshTimeline()
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(skillsChannel);
      supabase.removeChannel(toolsChannel);
      supabase.removeChannel(resourcesChannel);
      supabase.removeChannel(timelineChannel);
    };
  }, [roadmapId]);
  
  // Calculate overall progress whenever data changes
  useEffect(() => {
    calculateProgress();
  }, [skills, tools, resources, timeline]);

  // Helper functions to refresh data
  const refreshSkills = async () => {
    const { data, error } = await supabaseCustom.skills.getByRoadmapId(roadmapId);
    if (!error && data) {
      setSkills(data);
    }
  };
  
  const refreshTools = async () => {
    const { data, error } = await supabaseCustom.tools.getByRoadmapId(roadmapId);
    if (!error && data) {
      setTools(data);
    }
  };
  
  const refreshResources = async () => {
    const { data, error } = await supabaseCustom.resources.getByRoadmapId(roadmapId);
    if (!error && data) {
      setResources(data);
    }
  };
  
  const refreshTimeline = async () => {
    const { data, error } = await supabaseCustom.timeline.getByRoadmapId(roadmapId);
    if (!error && data) {
      setTimeline(data);
    }
  };
  
  // Calculate progress based on completed items
  const calculateProgress = () => {
    const totalItems = skills.length + tools.length + resources.length + timeline.length;
    if (totalItems === 0) {
      setProgress(0);
      if (onProgressUpdate) onProgressUpdate(0);
      return;
    }
    
    const completedItems = 
      skills.filter(s => s.completed).length + 
      tools.filter(t => t.completed).length + 
      resources.filter(r => r.completed).length + 
      timeline.filter(t => t.completed).length;
    
    const newProgress = Math.round((completedItems / totalItems) * 100);
    setProgress(newProgress);
    
    if (onProgressUpdate) onProgressUpdate(newProgress);
    
    // Trigger confetti on milestones
    const prevProgress = progress;
    if ((prevProgress < 50 && newProgress >= 50) || (prevProgress < 100 && newProgress === 100)) {
      triggerConfetti();
    }
  };
  
  // Trigger confetti animation
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Show toast on 100% completion
    if (progress === 100) {
      toast.success("Congratulations! You've completed your roadmap! 🎉");
    } else {
      toast.success("You've reached a milestone! Keep going! 🎉");
    }
  };
  
  // Handle toggling item completion status
  const handleToggleSkill = async (item: RoadmapSkill) => {
    try {
      const { error } = await supabaseCustom.skills.update({
        id: item.id, 
        completed: !item.completed
      }).eq('id', item.id);
      
      if (error) throw error;
      
      // Update local state
      setSkills(skills.map(skill => 
        skill.id === item.id ? { ...skill, completed: !item.completed } : skill
      ));
      
      showCompletionToast(item.completed);
    } catch (error) {
      console.error("Error updating skill:", error);
      toast.error("Failed to update skill status");
    }
  };
  
  const handleToggleTool = async (item: RoadmapTool) => {
    try {
      const { error } = await supabaseCustom.tools.update({
        id: item.id, 
        completed: !item.completed
      }).eq('id', item.id);
      
      if (error) throw error;
      
      // Update local state
      setTools(tools.map(tool => 
        tool.id === item.id ? { ...tool, completed: !item.completed } : tool
      ));
      
      showCompletionToast(item.completed);
    } catch (error) {
      console.error("Error updating tool:", error);
      toast.error("Failed to update tool status");
    }
  };
  
  const handleToggleResource = async (item: RoadmapResource) => {
    try {
      const { error } = await supabaseCustom.resources.update({
        id: item.id, 
        completed: !item.completed
      }).eq('id', item.id);
      
      if (error) throw error;
      
      // Update local state
      setResources(resources.map(resource => 
        resource.id === item.id ? { ...resource, completed: !item.completed } : resource
      ));
      
      showCompletionToast(item.completed);
    } catch (error) {
      console.error("Error updating resource:", error);
      toast.error("Failed to update resource status");
    }
  };
  
  const handleToggleTimeline = async (item: RoadmapTimeline) => {
    try {
      const { error } = await supabaseCustom.timeline.update({
        id: item.id, 
        completed: !item.completed
      }).eq('id', item.id);
      
      if (error) throw error;
      
      // Update local state
      setTimeline(timeline.map(timelineItem => 
        timelineItem.id === item.id ? { ...timelineItem, completed: !item.completed } : timelineItem
      ));
      
      showCompletionToast(item.completed);
    } catch (error) {
      console.error("Error updating timeline step:", error);
      toast.error("Failed to update timeline status");
    }
  };
  
  const showCompletionToast = (wasCompleted: boolean) => {
    if (!wasCompleted) {
      toast.success("Item marked as complete!");
    } else {
      toast.info("Item marked as incomplete");
    }
  };
  
  if (isLoading) {
    return (
      <Card className="glass-morphism">
        <CardHeader>
          <div className="h-6 bg-white/10 rounded w-1/2 animate-pulse"></div>
          <div className="h-4 bg-white/10 rounded w-2/3 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-4 bg-white/10 rounded w-full mb-4 animate-pulse"></div>
          <div className="h-24 bg-white/5 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="glass-morphism">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>Track your progress</CardDescription>
          </div>
          <Badge className="bg-purple-500/20 text-white border-purple-500/30 backdrop-blur-sm">
            {progress}% Complete
          </Badge>
        </div>
        <Progress 
          value={progress} 
          className="h-2 mt-2" 
        />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Skills
              {skills.length > 0 && (
                <Badge className="ml-auto bg-white/10 text-xs">{skills.filter(s => s.completed).length}/{skills.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" /> Tools
              {tools.length > 0 && (
                <Badge className="ml-auto bg-white/10 text-xs">{tools.filter(t => t.completed).length}/{tools.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" /> Resources
              {resources.length > 0 && (
                <Badge className="ml-auto bg-white/10 text-xs">{resources.filter(r => r.completed).length}/{resources.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Timeline
              {timeline.length > 0 && (
                <Badge className="ml-auto bg-white/10 text-xs">{timeline.filter(t => t.completed).length}/{timeline.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="skills" className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {skills.length === 0 ? (
              <p className="text-center text-white/70">No skills have been added to this roadmap yet.</p>
            ) : (
              skills.map((skill) => (
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
                    onCheckedChange={() => handleToggleSkill(skill)}
                    className={skill.completed ? "text-brand-500" : ""}
                  />
                  <div className="flex-1">
                    <div className={`font-medium ${skill.completed ? "line-through opacity-70" : ""}`}>
                      {skill.label}
                    </div>
                  </div>
                  {skill.completed && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="tools" className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {tools.length === 0 ? (
              <p className="text-center text-white/70">No tools have been added to this roadmap yet.</p>
            ) : (
              tools.map((tool) => (
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
                    onCheckedChange={() => handleToggleTool(tool)}
                    className={tool.completed ? "text-brand-500" : ""}
                  />
                  <div className="flex-1">
                    <div className={`font-medium ${tool.completed ? "line-through opacity-70" : ""}`}>
                      {tool.label}
                    </div>
                  </div>
                  {tool.completed && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {resources.length === 0 ? (
              <p className="text-center text-white/70">No resources have been added to this roadmap yet.</p>
            ) : (
              resources.map((resource) => (
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
                    onCheckedChange={() => handleToggleResource(resource)}
                    className={resource.completed ? "text-brand-500" : ""}
                  />
                  <div className="flex-1">
                    <div className={`font-medium ${resource.completed ? "line-through opacity-70" : ""}`}>
                      {resource.label}
                    </div>
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
                  {resource.completed && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="timeline" className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {timeline.length === 0 ? (
              <p className="text-center text-white/70">No timeline has been added to this roadmap yet.</p>
            ) : (
              <div className="relative">
                <div className="absolute left-9 top-0 bottom-0 w-px bg-border/50"></div>
                {timeline
                  .sort((a, b) => a.order_number - b.order_number)
                  .map((item) => (
                    <div 
                      key={item.id} 
                      className={`flex items-start gap-3 p-3 mb-4 rounded-lg transition-all relative ${
                        item.completed 
                          ? "bg-brand-500/20 shadow-[0_0_10px_rgba(168,85,247,0.3)]" 
                          : "bg-white/5"
                      }`}
                    >
                      <div className={`absolute left-0 top-3 flex h-8 w-8 items-center justify-center rounded-full border ${
                        item.completed 
                          ? "border-green-500 bg-green-500/20 text-green-500" 
                          : "border-white/20 bg-background text-white/70"
                      } z-10 font-bold text-sm`}>
                        {item.order_number}
                      </div>
                      <div className="ml-12">
                        <Checkbox 
                          checked={item.completed} 
                          onCheckedChange={() => handleToggleTimeline(item)}
                          className={item.completed ? "text-brand-500" : ""}
                        />
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${item.completed ? "line-through opacity-70" : ""}`}>
                          {item.step}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Week {item.order_number}
                        </div>
                      </div>
                      {item.completed && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  ))
                }
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
