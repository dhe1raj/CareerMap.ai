
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Link, Check, Video, FileText, Code } from "lucide-react";
import "../styles/glassmorphism.css";
import { ResourceRow, UserResourceProgressRow } from "@/utils/supabase-types-helper";

// Resource type icons mapping
const resourceTypeIcons: Record<string, React.ReactNode> = {
  "video": <Video className="h-5 w-5" />,
  "article": <FileText className="h-5 w-5" />,
  "course": <BookOpen className="h-5 w-5" />,
  "tool": <Code className="h-5 w-5" />
};

// Helper function to get color class based on skill tag
const getSkillTagColor = (tag: string): string => {
  const tagMap: Record<string, string> = {
    "frontend": "bg-blue-500/20 text-blue-200",
    "backend": "bg-green-500/20 text-green-200",
    "design": "bg-pink-500/20 text-pink-200",
    "ai": "bg-purple-500/20 text-purple-200",
    "soft": "bg-yellow-500/20 text-yellow-200",
    "data": "bg-orange-500/20 text-orange-200"
  };

  return tagMap[tag.toLowerCase()] || "bg-gray-500/20 text-gray-200";
};

export default function CareerResources() {
  const [resources, setResources] = useState<ResourceRow[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchResources = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Fetch resources
        const { data: existingResources, error: resourcesError } = await supabase
          .from('resources')
          .select('*');
        
        if (resourcesError) throw resourcesError;
        
        if (existingResources && existingResources.length > 0) {
          // Resources exist
          setResources(existingResources as unknown as ResourceRow[]);
          
          // Fetch user progress
          const { data: progressData, error: progressError } = await supabase
            .from('user_resource_progress')
            .select('*')
            .eq('user_id', user.id);
          
          if (!progressError && progressData) {
            // Create a map of resource_id -> completed status
            const progressMap: Record<string, boolean> = {};
            (progressData as unknown as UserResourceProgressRow[]).forEach(item => {
              progressMap[item.resource_id] = !!item.completed;
            });
            setUserProgress(progressMap);
          }
        } else {
          // No resources, create mock data
          await createMockResources();
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
        toast({
          title: "Error",
          description: "Failed to load learning resources. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResources();
  }, [user, toast]);
  
  // Create mock resources
  const createMockResources = async () => {
    const mockResources = [
      {
        type: "course",
        title: "React Frontend Masterclass",
        url: "https://example.com/react-course",
        thumbnail: "/placeholder.svg",
        skill_tag: "frontend",
        description: "Learn modern React including hooks, context API, and advanced patterns."
      },
      {
        type: "video",
        title: "Docker for Beginners",
        url: "https://example.com/docker-basics",
        thumbnail: "/placeholder.svg",
        skill_tag: "backend",
        description: "Quick start guide to containerizing your applications with Docker."
      },
      {
        type: "article",
        title: "UI/UX Design Principles",
        url: "https://example.com/ui-ux-article",
        thumbnail: "/placeholder.svg",
        skill_tag: "design",
        description: "Core principles of effective user interface and experience design."
      },
      {
        type: "tool",
        title: "TensorFlow Tutorials",
        url: "https://example.com/tensorflow",
        thumbnail: "/placeholder.svg",
        skill_tag: "ai",
        description: "Hands-on tutorials for machine learning with TensorFlow."
      },
      {
        type: "course",
        title: "Communication for Tech Leaders",
        url: "https://example.com/tech-communication",
        thumbnail: "/placeholder.svg",
        skill_tag: "soft",
        description: "Improve your communication skills in technical environments."
      },
      {
        type: "article",
        title: "Data Visualization with D3",
        url: "https://example.com/d3-visualization",
        thumbnail: "/placeholder.svg",
        skill_tag: "data",
        description: "Create stunning data visualizations with D3.js library."
      }
    ];

    try {
      // Insert mock resources and get inserted data
      const insertedResources: ResourceRow[] = [];
      
      for (const resource of mockResources) {
        const { data, error } = await supabase
          .from('resources')
          .insert(resource)
          .select();
          
        if (error) {
          console.error("Error inserting resource:", error);
        } else if (data && data.length > 0) {
          insertedResources.push(data[0] as unknown as ResourceRow);
        }
      }
      
      setResources(insertedResources);
    } catch (error) {
      console.error("Error creating mock resources:", error);
    }
  };

  // Mark resource as complete/incomplete
  const toggleResourceCompletion = async (resourceId: string, currentStatus: boolean) => {
    if (!user) return;
    
    try {
      const newStatus = !currentStatus;
      
      // Update user progress in database
      const { error } = await supabase
        .from('user_resource_progress')
        .upsert({
          user_id: user.id,
          resource_id: resourceId,
          completed: newStatus,
          completed_at: newStatus ? new Date().toISOString() : null
        } as any); // Type assertion to bypass TS check temporarily
      
      if (error) throw error;
      
      // Update local state
      setUserProgress(prev => ({
        ...prev,
        [resourceId]: newStatus
      }));
      
      toast({
        title: newStatus ? "Resource Completed!" : "Resource Marked as Incomplete",
        description: newStatus 
          ? "Your progress has been saved." 
          : "Resource marked as not completed.",
      });
    } catch (error) {
      console.error("Error updating resource status:", error);
      toast({
        title: "Error",
        description: "Failed to update resource status. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Filter resources by type or show all
  const filteredResources = selectedFilter === "all" 
    ? resources 
    : resources.filter(resource => resource.type === selectedFilter);

  // Calculate completion percentage
  const completedCount = resources.filter(r => userProgress[r.id]).length;
  const completionPercentage = resources.length > 0 
    ? Math.round((completedCount / resources.length) * 100) 
    : 0;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg">Loading learning resources...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">Career Resources</h1>
            <p className="text-white/70">Curated learning resources to help you succeed in your career path.</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <div className="flex items-center mr-4">
              <div className="h-3 w-3 rounded-full bg-primary mr-2"></div>
              <span className="text-sm text-white/70">Completed: {completedCount}/{resources.length} ({completionPercentage}%)</span>
            </div>
          </div>
        </div>
        
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button 
            variant={selectedFilter === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedFilter("all")}
          >
            All
          </Button>
          <Button 
            variant={selectedFilter === "course" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("course")}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Courses
          </Button>
          <Button 
            variant={selectedFilter === "video" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("video")}
          >
            <Video className="h-4 w-4 mr-2" />
            Videos
          </Button>
          <Button 
            variant={selectedFilter === "article" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("article")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Articles
          </Button>
          <Button 
            variant={selectedFilter === "tool" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("tool")}
          >
            <Code className="h-4 w-4 mr-2" />
            Tools
          </Button>
        </div>

        {/* Resources grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="glass-morphism overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center mb-2">
                  <Badge className={`${getSkillTagColor(resource.skill_tag)}`}>
                    {resource.skill_tag}
                  </Badge>
                  <div className="flex items-center text-white/50 text-sm">
                    {resourceTypeIcons[resource.type] || <BookOpen className="h-5 w-5" />}
                  </div>
                </div>
                <CardTitle className="text-lg text-gradient-primary">{resource.title}</CardTitle>
                <CardDescription className="text-white/70">
                  {resource.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(resource.url, '_blank')}
                  >
                    <Link className="h-4 w-4 mr-2" />
                    View Resource
                  </Button>
                  <Button
                    variant={userProgress[resource.id] ? "default" : "secondary"}
                    size="sm"
                    className="flex-1"
                    onClick={() => toggleResourceCompletion(resource.id, !!userProgress[resource.id])}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    {userProgress[resource.id] ? "Completed" : "Mark Complete"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
