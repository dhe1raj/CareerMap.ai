
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ExternalLink, BookOpen, Book, Video, File, Users, Briefcase, Search, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import confetti from 'canvas-confetti';
import "../styles/glassmorphism.css";

interface Resource {
  id: string;
  type: string;
  title: string;
  url: string;
  thumbnail?: string;
  skill_tag: string;
  description: string;
  completed: boolean;
}

type FilterType = 'all' | 'skills' | 'tools' | 'books' | 'videos' | 'communities';

export default function CareerResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCounts, setFilterCounts] = useState({
    all: 0,
    skills: 0,
    tools: 0,
    books: 0,
    videos: 0,
    communities: 0
  });
  const [progress, setProgress] = useState(0);
  const { roadmapId } = useParams<{ roadmapId?: string }>();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchResources();
  }, [user, roadmapId]);

  useEffect(() => {
    if (resources.length > 0) {
      applyFilters();
      updateCounts();
    }
  }, [resources, activeFilter, searchQuery]);

  const fetchResources = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Get user's active roadmap if not provided in URL
      let targetRoadmapId = roadmapId;
      
      if (!targetRoadmapId) {
        const { data: userRoadmaps, error: roadmapError } = await supabase
          .from('user_roadmaps')
          .select('id')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1);
        
        if (roadmapError) throw roadmapError;
        if (userRoadmaps && userRoadmaps.length > 0) {
          targetRoadmapId = userRoadmaps[0].id;
        }
      }
      
      if (!targetRoadmapId) {
        setIsLoading(false);
        return;
      }
      
      // Get resources for the roadmap
      // Pull from 'resources' table where the skill tags match the roadmap skills
      const { data: roadmapData, error: roadmapError } = await supabase
        .from('user_roadmaps')
        .select(`
          id,
          title,
          user_roadmap_steps (*)
        `)
        .eq('id', targetRoadmapId)
        .single();
      
      if (roadmapError) throw roadmapError;
      
      // Extract skills from roadmap steps
      const skillTags = roadmapData.user_roadmap_steps.map((step: any) => 
        step.label.toLowerCase().replace(/[^a-z0-9]/g, '')
      );
      
      // Fetch user's completed resources
      const { data: userProgress, error: progressError } = await supabase
        .from('user_resource_progress')
        .select('*')
        .eq('user_id', user.id);
      
      if (progressError) throw progressError;
      
      // For demo purposes, let's use mock data
      const mockResources: Resource[] = [
        {
          id: "1",
          type: "video",
          title: "Introduction to React",
          url: "https://www.youtube.com/watch?v=reactintro",
          thumbnail: "https://via.placeholder.com/150",
          skill_tag: "react",
          description: "Learn the basics of React framework for modern web development",
          completed: false
        },
        {
          id: "2",
          type: "course",
          title: "Advanced JavaScript Patterns",
          url: "https://www.coursera.org/js-patterns",
          thumbnail: "https://via.placeholder.com/150",
          skill_tag: "javascript",
          description: "Master advanced JavaScript patterns and techniques",
          completed: false
        },
        {
          id: "3",
          type: "book",
          title: "Clean Code: A Handbook of Agile Software",
          url: "https://www.amazon.com/clean-code",
          thumbnail: "https://via.placeholder.com/150",
          skill_tag: "coding",
          description: "Learn principles of writing clean, maintainable code",
          completed: true
        },
        {
          id: "4",
          type: "tool",
          title: "Figma for Developers",
          url: "https://www.figma.com/developers",
          thumbnail: "https://via.placeholder.com/150",
          skill_tag: "design",
          description: "Learn how to use Figma as a developer",
          completed: false
        },
        {
          id: "5",
          type: "video",
          title: "CSS Grid Layout Mastery",
          url: "https://www.youtube.com/watch?v=css-grid",
          thumbnail: "https://via.placeholder.com/150",
          skill_tag: "css",
          description: "Master CSS Grid for complex layouts",
          completed: false
        },
        {
          id: "6",
          type: "community",
          title: "Frontend Developers Community",
          url: "https://discord.gg/frontend",
          thumbnail: "https://via.placeholder.com/150",
          skill_tag: "networking",
          description: "Join a community of frontend developers",
          completed: false
        },
        {
          id: "7",
          type: "book",
          title: "System Design Interview",
          url: "https://www.amazon.com/system-design",
          thumbnail: "https://via.placeholder.com/150",
          skill_tag: "architecture",
          description: "Prepare for system design interviews",
          completed: true
        },
        {
          id: "8",
          type: "tool",
          title: "VSCode Setup for Full-Stack Development",
          url: "https://code.visualstudio.com/docs",
          thumbnail: "https://via.placeholder.com/150",
          skill_tag: "tools",
          description: "Optimize VSCode for full-stack development",
          completed: false
        }
      ];
      
      // Mark resources as completed based on user progress
      const resourcesWithProgress = mockResources.map(resource => {
        const progressItem = userProgress?.find(p => p.resource_id === resource.id);
        return {
          ...resource,
          completed: progressItem ? progressItem.completed : resource.completed
        };
      });
      
      setResources(resourcesWithProgress);
      setFilteredResources(resourcesWithProgress);
      
      // Calculate progress
      const completedCount = resourcesWithProgress.filter(r => r.completed).length;
      const progressPercentage = Math.round((completedCount / resourcesWithProgress.length) * 100);
      setProgress(progressPercentage);
      
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast({
        title: "Error",
        description: "Failed to load resources. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const applyFilters = () => {
    let filtered = resources;
    
    // Apply type filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(resource => {
        if (activeFilter === 'skills') return ['course', 'video', 'article'].includes(resource.type);
        if (activeFilter === 'tools') return resource.type === 'tool';
        if (activeFilter === 'books') return resource.type === 'book';
        if (activeFilter === 'videos') return resource.type === 'video';
        if (activeFilter === 'communities') return resource.type === 'community';
        return true;
      });
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(resource => 
        resource.title.toLowerCase().includes(query) || 
        resource.description.toLowerCase().includes(query) ||
        resource.skill_tag.toLowerCase().includes(query)
      );
    }
    
    setFilteredResources(filtered);
  };
  
  const updateCounts = () => {
    const counts = {
      all: resources.length,
      skills: resources.filter(r => ['course', 'video', 'article'].includes(r.type)).length,
      tools: resources.filter(r => r.type === 'tool').length,
      books: resources.filter(r => r.type === 'book').length,
      videos: resources.filter(r => r.type === 'video').length,
      communities: resources.filter(r => r.type === 'community').length
    };
    
    setFilterCounts(counts);
  };
  
  const handleMarkCompleted = async (resource: Resource) => {
    if (!user) return;
    
    try {
      const newCompletedState = !resource.completed;
      
      // Update in Supabase
      const { error } = await supabase
        .from('user_resource_progress')
        .upsert({
          user_id: user.id,
          resource_id: resource.id,
          completed: newCompletedState,
          completed_at: newCompletedState ? new Date().toISOString() : null
        });
      
      if (error) throw error;
      
      // Update local state
      const updatedResources = resources.map(r => 
        r.id === resource.id ? { ...r, completed: newCompletedState } : r
      );
      
      setResources(updatedResources);
      
      // Calculate new progress
      const completedCount = updatedResources.filter(r => r.completed).length;
      const newProgress = Math.round((completedCount / updatedResources.length) * 100);
      setProgress(newProgress);
      
      // Show success toast
      toast({
        title: newCompletedState ? "Resource completed!" : "Resource marked as incomplete",
        description: resource.title,
      });
      
      // Trigger confetti if 100% complete
      if (newProgress === 100 && completedCount > 0) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      
    } catch (error) {
      console.error("Error updating resource progress:", error);
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-5 w-5 text-purple-400" />;
      case 'course': return <BookOpen className="h-5 w-5 text-blue-400" />;
      case 'book': return <Book className="h-5 w-5 text-amber-400" />;
      case 'tool': return <Briefcase className="h-5 w-5 text-green-400" />;
      case 'community': return <Users className="h-5 w-5 text-pink-400" />;
      default: return <File className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-1">Career Resources</h1>
            <p className="text-white/70">Hand-picked courses, books & tools for your roadmap</p>
          </div>
          
          <Card className="w-full md:w-auto mt-4 md:mt-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{progress}%</div>
                <div className="text-sm text-muted-foreground">Resources completed</div>
              </div>
              <div className="mt-2 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 progress-bar-neon transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Badge 
                variant={activeFilter === 'all' ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => setActiveFilter('all')}
              >
                All ({filterCounts.all})
              </Badge>
              <Badge 
                variant={activeFilter === 'skills' ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => setActiveFilter('skills')}
              >
                Skills ({filterCounts.skills})
              </Badge>
              <Badge 
                variant={activeFilter === 'tools' ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => setActiveFilter('tools')}
              >
                Tools ({filterCounts.tools})
              </Badge>
              <Badge 
                variant={activeFilter === 'books' ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => setActiveFilter('books')}
              >
                Books ({filterCounts.books})
              </Badge>
              <Badge 
                variant={activeFilter === 'videos' ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => setActiveFilter('videos')}
              >
                Videos ({filterCounts.videos})
              </Badge>
              <Badge 
                variant={activeFilter === 'communities' ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => setActiveFilter('communities')}
              >
                Communities ({filterCounts.communities})
              </Badge>
            </div>
            
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-input w-full"
              />
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-white/5 animate-pulse h-[200px]">
                <CardHeader className="pb-2">
                  <div className="h-6 bg-white/10 rounded w-3/4"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2 mt-2"></div>
                </CardHeader>
                <CardContent>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <Card 
                key={resource.id} 
                className={`card-hover glass-morphism relative ${resource.completed ? 'border-green-500/30' : ''}`}
              >
                {resource.completed && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <CheckCircle className="h-6 w-6 text-green-500 bg-background rounded-full" />
                  </div>
                )}
                
                <div className="relative h-32 w-full overflow-hidden rounded-t-xl">
                  {resource.thumbnail ? (
                    <img 
                      src={resource.thumbnail} 
                      alt={resource.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center">
                      {getResourceIcon(resource.type)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                  <Badge 
                    variant="outline" 
                    className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm"
                  >
                    {resource.type.toUpperCase()}
                  </Badge>
                </div>
                
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gradient-primary text-lg">{resource.title}</CardTitle>
                  </div>
                  <Badge variant="outline" className="mt-1 text-white/70">
                    {resource.skill_tag}
                  </Badge>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-white/70 line-clamp-2">{resource.description}</p>
                </CardContent>
                
                <CardFooter className="flex justify-between pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => window.open(resource.url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" /> Open Resource
                  </Button>
                  
                  <Button
                    variant={resource.completed ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => handleMarkCompleted(resource)}
                  >
                    {resource.completed ? "Completed" : "Mark Complete"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center">
              <BookOpen className="h-10 w-10 text-white/30 mb-4" />
              <h3 className="text-xl font-medium">No resources found</h3>
              <p className="text-muted-foreground mt-2">
                {resources.length > 0 
                  ? "No resources match your current search or filters." 
                  : "Resources for your career path will appear here."}
              </p>
              {searchQuery && (
                <Button 
                  className="mt-4" 
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
