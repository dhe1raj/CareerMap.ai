
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { RoadmapResource } from "@/utils/supabase-helpers";
import { supabaseCustom } from "@/utils/supabase-helpers";
import { ExternalLink, FileText, Settings, Book } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

// Define resource types and categories
type ResourceType = "course" | "tool" | "book" | "article" | "video" | "other";
type SkillCategory = "frontend" | "backend" | "design" | "ai" | "data" | "soft" | "other";

interface ResourceCardProps {
  id: string;
  title: string;
  description?: string;
  type: ResourceType;
  category: SkillCategory;
  url: string;
  skillName?: string;
  completed: boolean;
  roadmapId: string;
  onComplete: (id: string, completed: boolean) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ 
  id, 
  title, 
  description, 
  type, 
  category, 
  url, 
  skillName, 
  completed, 
  onComplete,
  roadmapId 
}) => {
  const renderIcon = () => {
    switch (type) {
      case "course":
      case "video":
        return <ExternalLink className="h-5 w-5 text-purple-400" />;
      case "tool":
        return <Settings className="h-5 w-5 text-blue-400" />;
      case "book":
        return <Book className="h-5 w-5 text-amber-400" />;
      default:
        return <FileText className="h-5 w-5 text-green-400" />;
    }
  };

  const handleToggleComplete = async () => {
    try {
      onComplete(id, !completed);
    } catch (error) {
      console.error("Error toggling resource completion:", error);
      toast.error("Failed to update progress");
    }
  };

  return (
    <Card className={`transition-all duration-300 ${completed ? "bg-brand-500/10 border-brand-400/30" : "bg-white/5"}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {renderIcon()}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Badge variant={completed ? "default" : "outline"} className="ml-2">
            {type}
          </Badge>
        </div>
        {skillName && (
          <CardDescription>
            Skill: {skillName}
          </CardDescription>
        )}
      </CardHeader>
      {description && (
        <CardContent className="pt-0">
          <p className="text-sm text-white/70">{description}</p>
        </CardContent>
      )}
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => window.open(url, "_blank")}
        >
          <ExternalLink className="h-4 w-4" /> Open
        </Button>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={completed}
            onChange={handleToggleComplete}
            className="h-4 w-4 rounded border-white/30 bg-white/10 text-brand-500 focus:ring-brand-500/30"
          />
          <span className="text-xs">{completed ? "Completed" : "Mark as completed"}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default function CareerResources() {
  const { roadmapId } = useParams<{ roadmapId?: string }>();
  const [resources, setResources] = useState<ResourceCardProps[]>([]);
  const [filteredResources, setFilteredResources] = useState<ResourceCardProps[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        // Fetch user's roadmaps to get the latest one if no ID provided
        let targetRoadmapId = roadmapId;

        if (!targetRoadmapId) {
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          if (currentUser) {
            const { data: userRoadmaps, error } = await supabase
              .from('user_roadmaps')
              .select('*')
              .eq('user_id', currentUser.id)
              .order('updated_at', { ascending: false })
              .limit(1);
            
            if (error) throw error;
            if (userRoadmaps && userRoadmaps.length > 0) {
              targetRoadmapId = userRoadmaps[0].id;
            }
          }
        }

        if (!targetRoadmapId) {
          setIsLoading(false);
          return;
        }

        // Fetch resources for the roadmap
        const { data: resourcesData, error: resourcesError } = await supabaseCustom.resources.getByRoadmapId(targetRoadmapId);
        
        if (resourcesError) throw resourcesError;
        
        // Map resources to component props
        if (resourcesData) {
          const handleResourceComplete = async (id: string, completed: boolean) => {
            try {
              // Update the resource completion status in Supabase
              const { error } = await supabaseCustom.resources.update({ id, completed }).eq('id', id);
              
              if (error) throw error;
              
              // Update local state
              const updatedResources = resources.map(r => 
                r.id === id ? { ...r, completed } : r
              );
              
              setResources(updatedResources);
              
              // Update progress calculation
              if (updatedResources.length > 0) {
                const completedCount = updatedResources.filter(r => r.completed).length;
                const newProgress = Math.round((completedCount / updatedResources.length) * 100);
                setProgress(newProgress);
              }
              
              toast.success(completed ? "Resource marked as completed!" : "Resource marked as incomplete");
            } catch (error) {
              console.error("Error updating resource:", error);
              toast.error("Failed to update progress");
            }
          };

          const mappedResources = resourcesData.map(r => ({
            id: r.id,
            title: r.label,
            description: `Resource for your career path. ${r.url ? 'Click to open.' : ''}`,
            type: determineResourceType(r.label, r.url || ""),
            category: determineResourceCategory(r.label),
            url: r.url || "#",
            completed: r.completed,
            roadmapId: r.roadmap_id,
            onComplete: handleResourceComplete
          }));
          
          setResources(mappedResources);
          setFilteredResources(mappedResources);
          
          // Calculate progress
          if (mappedResources.length > 0) {
            const completedCount = mappedResources.filter(r => r.completed).length;
            setProgress(Math.round((completedCount / mappedResources.length) * 100));
          }
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
        toast.error("Failed to load resources");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResources();
  }, [roadmapId, user]);

  useEffect(() => {
    // Filter resources based on active tab and search query
    const filtered = resources.filter(resource => {
      const matchesTab = activeTab === "all" || resource.type === activeTab;
      const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (resource.description && resource.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTab && matchesSearch;
    });
    
    setFilteredResources(filtered);
  }, [activeTab, searchQuery, resources]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleResourceComplete = async (id: string, completed: boolean) => {
    try {
      // Update the resource completion status in Supabase
      const { error } = await supabaseCustom.resources.update({ id, completed }).eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      const updatedResources = resources.map(r => 
        r.id === id ? { ...r, completed } : r
      );
      
      setResources(updatedResources);
      
      // Update progress calculation
      if (updatedResources.length > 0) {
        const completedCount = updatedResources.filter(r => r.completed).length;
        const newProgress = Math.round((completedCount / updatedResources.length) * 100);
        setProgress(newProgress);
      }
      
      toast.success(completed ? "Resource marked as completed!" : "Resource marked as incomplete");
    } catch (error) {
      console.error("Error updating resource:", error);
      toast.error("Failed to update progress");
    }
  };

  // Helper function to determine resource type
  const determineResourceType = (label: string, url: string): ResourceType => {
    const lowerLabel = label.toLowerCase();
    const lowerUrl = url.toLowerCase();
    
    if (lowerLabel.includes("course") || 
        lowerUrl.includes("coursera") || 
        lowerUrl.includes("udemy") ||
        lowerUrl.includes("edx") || 
        lowerUrl.includes("udacity")) {
      return "course";
    }
    
    if (lowerLabel.includes("book") || 
        lowerUrl.includes("amazon") || 
        lowerUrl.includes("goodreads")) {
      return "book";
    }
    
    if (lowerLabel.includes("tool") || 
        lowerLabel.includes("software") || 
        lowerUrl.includes("github") ||
        lowerUrl.includes("figma")) {
      return "tool";
    }
    
    if (lowerUrl.includes("youtube") || 
        lowerUrl.includes("vimeo") || 
        lowerLabel.includes("video")) {
      return "video";
    }
    
    if (lowerLabel.includes("article") || 
        lowerUrl.includes("medium") || 
        lowerUrl.includes("blog")) {
      return "article";
    }
    
    return "other";
  };

  // Helper function to determine resource category
  const determineResourceCategory = (label: string): SkillCategory => {
    const lowerLabel = label.toLowerCase();
    
    if (lowerLabel.includes("frontend") || 
        lowerLabel.includes("react") || 
        lowerLabel.includes("vue") ||
        lowerLabel.includes("angular") ||
        lowerLabel.includes("css") ||
        lowerLabel.includes("html")) {
      return "frontend";
    }
    
    if (lowerLabel.includes("backend") || 
        lowerLabel.includes("node") || 
        lowerLabel.includes("server") ||
        lowerLabel.includes("api") ||
        lowerLabel.includes("database")) {
      return "backend";
    }
    
    if (lowerLabel.includes("design") || 
        lowerLabel.includes("ui") || 
        lowerLabel.includes("ux") ||
        lowerLabel.includes("figma") ||
        lowerLabel.includes("sketch")) {
      return "design";
    }
    
    if (lowerLabel.includes("ai") || 
        lowerLabel.includes("machine learning") || 
        lowerLabel.includes("deep learning")) {
      return "ai";
    }
    
    if (lowerLabel.includes("data") || 
        lowerLabel.includes("analytics") || 
        lowerLabel.includes("visualization")) {
      return "data";
    }
    
    if (lowerLabel.includes("soft skill") || 
        lowerLabel.includes("communication") || 
        lowerLabel.includes("leadership")) {
      return "soft";
    }
    
    return "other";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Career Resources</h1>
            <p className="text-muted-foreground">
              Curated resources to help you achieve your career goals
            </p>
          </div>
          <Card className="w-full md:w-auto">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{progress}%</div>
                <div className="text-sm text-muted-foreground">Resources completed</div>
              </div>
              <div className="mt-2 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-500 transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <Tabs 
              defaultValue="all" 
              value={activeTab}
              onValueChange={handleTabChange} 
              className="w-full md:w-auto"
            >
              <TabsList className="grid grid-cols-3 md:grid-cols-7 w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="course">Courses</TabsTrigger>
                <TabsTrigger value="video">Videos</TabsTrigger>
                <TabsTrigger value="tool">Tools</TabsTrigger>
                <TabsTrigger value="book">Books</TabsTrigger>
                <TabsTrigger value="article">Articles</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Input 
              placeholder="Search resources..." 
              value={searchQuery} 
              onChange={handleSearchChange} 
              className="w-full md:w-auto md:max-w-xs bg-white/5 border-white/10"
            />
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="bg-white/5 animate-pulse h-[180px]">
                  <CardHeader className="pb-2">
                    <div className="h-6 bg-white/10 rounded w-3/4"></div>
                    <div className="h-4 bg-white/10 rounded w-1/2 mt-2"></div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-4 bg-white/10 rounded w-full mt-2"></div>
                    <div className="h-4 bg-white/10 rounded w-5/6 mt-2"></div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-8 bg-white/10 rounded w-1/4"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {filteredResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  {...resource}
                  onComplete={handleResourceComplete}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-white/5 p-8">
              <div className="text-center">
                <h3 className="text-lg font-medium">No resources found</h3>
                <p className="text-muted-foreground mt-2">
                  {resources.length === 0 
                    ? "You don't have any resources in your career roadmap yet." 
                    : "No resources match your current filters."}
                </p>
                {resources.length === 0 && (
                  <Button className="mt-4" onClick={() => window.history.back()}>
                    Go Back to Dashboard
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
