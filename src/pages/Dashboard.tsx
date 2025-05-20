
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload } from "lucide-react";

interface CareerSuggestion {
  id: string;
  title: string;
  match_percentage: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [progress, setProgress] = useState(0);
  
  // Fetch user's roadmap progress
  const { data: userRoadmaps } = useQuery({
    queryKey: ['userRoadmaps', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('roadmaps')
        .select('*, roadmap_steps(*)')
        .eq('user_id', user.id);
        
      if (error) {
        console.error("Error fetching roadmaps:", error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user?.id
  });
  
  // Fetch career suggestions
  const { data: careerSuggestions } = useQuery({
    queryKey: ['careerSuggestions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('career_roles')
        .select('id, title')
        .limit(2);
        
      if (error) {
        console.error("Error fetching career roles:", error);
        return [];
      }
      
      // Add mock match percentages (in a real app, this would be calculated based on user skills)
      return data.map(role => ({
        ...role,
        match_percentage: Math.floor(Math.random() * (95 - 60) + 60)
      })).sort((a, b) => b.match_percentage - a.match_percentage);
    }
  });

  useEffect(() => {
    // Calculate roadmap progress
    if (userRoadmaps && userRoadmaps.length > 0) {
      const allSteps = userRoadmaps.flatMap(roadmap => roadmap.roadmap_steps);
      const completedSteps = allSteps.filter(step => step.completed);
      const progressValue = allSteps.length > 0 
        ? (completedSteps.length / allSteps.length) * 100 
        : 0;
      
      setProgress(progressValue);
    }
  }, [userRoadmaps]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {profile?.full_name || 'there'}!</h1>
          <p className="text-muted-foreground">
            Here's an overview of your career journey progress.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-brand-100 border-brand-300">
            <CardHeader>
              <CardTitle>Start Your Career Journey Today</CardTitle>
              <CardDescription>
                Take our questionnaire to discover your ideal career path.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="bg-brand-500 hover:bg-brand-600"
                onClick={() => navigate("/career-designer")}
              >
                Design My Career
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle>Resume Analysis</CardTitle>
              <CardDescription>
                Get smart, AI-powered career guidance based on your resume.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline"
                className="border-blue-400 text-blue-700 hover:bg-blue-100"
                onClick={() => navigate("/resume-analysis")}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Resume
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Your Progress</CardTitle>
              <CardDescription>Career path completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Career Suggestions</CardTitle>
              <CardDescription>Based on your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 pt-2">
                {careerSuggestions && careerSuggestions.length > 0 ? (
                  careerSuggestions.map((suggestion) => (
                    <Button 
                      key={suggestion.id}
                      variant="outline" 
                      className="w-full justify-start text-left" 
                      onClick={() => navigate(`/role/${suggestion.id}`)}
                      asChild
                    >
                      <div>
                        <p>{suggestion.title}</p>
                        <p className="text-xs text-muted-foreground">{suggestion.match_percentage}% match</p>
                      </div>
                    </Button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Complete the career designer to get personalized suggestions.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Career Chat</CardTitle>
              <CardDescription>Ask our AI assistant</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Need guidance on your next career step?
              </p>
              <Button onClick={() => navigate("/career-chat")}>
                Start Chatting
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Roadmap</CardTitle>
            <CardDescription>
              Your personalized learning path
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userRoadmaps && userRoadmaps.length > 0 ? (
              <div className="space-y-4">
                {userRoadmaps.map((roadmap) => (
                  <Button
                    key={roadmap.id}
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => navigate(`/roadmap/${roadmap.id}`)}
                  >
                    <span>{roadmap.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {roadmap.roadmap_steps.filter(step => step.completed).length} / {roadmap.roadmap_steps.length} steps
                    </span>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  You haven't created a roadmap yet. Complete the career designer questionnaire to generate your roadmap.
                </p>
                <Button 
                  className="mt-4"
                  variant="outline"
                  onClick={() => navigate("/career-designer")}
                >
                  Design My Career
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
