
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/hooks/use-user-data";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { exportElementToPDF } from "@/utils/pdfExport";
import { toast } from "sonner";
import { ArrowRight, FileDown, Trash2, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export default function CareerProgress() {
  const navigate = useNavigate();
  const { userData, isLoading, fetchUserData } = useUserData();
  const { user } = useAuth();
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [isRoadmapsLoading, setIsRoadmapsLoading] = useState(true);
  
  useEffect(() => {
    // First try to get roadmaps from Supabase if the user is logged in
    const fetchRoadmaps = async () => {
      setIsRoadmapsLoading(true);
      
      if (user) {
        try {
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
              steps: roadmap.user_roadmap_steps.map((step: any) => ({
                order: step.order_number,
                label: step.label,
                estTime: step.est_time,
                completed: step.completed
              }))
            }));
            
            setRoadmaps(formattedRoadmaps);
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
  }, [user]);
  
  const calculateProgress = (roadmap: any) => {
    if (!roadmap?.steps || roadmap.steps.length === 0) return 0;
    const completed = roadmap.steps.filter((step: any) => step.completed).length;
    return Math.round((completed / roadmap.steps.length) * 100);
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
        // Delete from Supabase
        const { error } = await supabase
          .from('user_roadmaps')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        // Update local state
        setRoadmaps(prevRoadmaps => prevRoadmaps.filter(roadmap => roadmap.id !== id));
        toast.success("Roadmap deleted");
        
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <CardDescription className="flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {roadmap.lastUpdated ? formatDate(roadmap.lastUpdated) : 'No date available'}
                      </CardDescription>
                    </div>
                    <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                      {calculateProgress(roadmap)}% Complete
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={calculateProgress(roadmap)} className="h-2 mb-6" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Steps:</span>
                      <span>{roadmap.steps?.length || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Completed Steps:</span>
                      <span>
                        {roadmap.steps?.filter((step: any) => step.completed).length || 0}
                      </span>
                    </div>
                  </div>
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
                    <Button 
                      size="sm" 
                      onClick={() => navigate(`/roadmap/${roadmap.id}`)}
                    >
                      Track Progress
                      <ArrowRight className="ml-2 h-4 w-4" />
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
