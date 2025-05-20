
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, Download, User, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface CareerSuggestion {
  id: string;
  title: string;
  match_percentage: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [progress, setProgress] = useState(0);
  
  // Fade in animation variants
  const fadeInUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };
  
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
      
      // Animate progress
      const animateProgress = () => {
        let startValue = 0;
        const endValue = progressValue;
        const duration = 1500;
        const startTime = performance.now();
        
        const updateProgress = (currentTime: number) => {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          const currentValue = startValue + progress * (endValue - startValue);
          
          setProgress(currentValue);
          
          if (progress < 1) {
            requestAnimationFrame(updateProgress);
          }
        };
        
        requestAnimationFrame(updateProgress);
      };
      
      animateProgress();
    }
  }, [userRoadmaps]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariant}
          custom={0}
          className="futuristic-glass p-8 rounded-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0">
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-400/70 to-transparent"></div>
            <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-brand-400/70 to-transparent"></div>
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/70 to-transparent"></div>
            <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-brand-400/70 to-transparent"></div>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white neon-purple-text">Welcome, {profile?.full_name || 'there'}!</h1>
              <p className="text-white/80 mt-1">
                Here's an overview of your career journey progress.
              </p>
            </div>
            
            <Card className="w-full md:w-auto futuristic-glass border-white/10">
              <CardContent className="p-4 flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-brand-400 shadow-[0_0_10px_rgba(161,123,245,0.5)]">
                  <AvatarImage src={profile?.avatar_url || ''} />
                  <AvatarFallback className="bg-brand-500 text-white">
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-white">{profile?.full_name}</h3>
                  <p className="text-sm text-white/70">{profile?.email}</p>
                  <Button 
                    variant="link" 
                    className="text-brand-300 p-0 h-auto text-sm"
                    onClick={() => navigate("/settings")}
                  >
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariant}
            custom={1}
          >
            <Card className="futuristic-glass relative overflow-hidden h-full border-brand-400/30">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-400/20 blur-[40px] rounded-full"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-white neon-purple-text">Start Your Career Journey Today</CardTitle>
                <CardDescription className="text-white/80">
                  Take our questionnaire to discover your ideal career path.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <Button 
                  className="neon-button"
                  onClick={() => navigate("/career-designer")}
                >
                  Design My Career
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariant}
            custom={2}
          >
            <Card className="futuristic-glass relative overflow-hidden h-full border-blue-400/30">
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/20 blur-[40px] rounded-full"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-white neon-purple-text">Resume Analysis</CardTitle>
                <CardDescription className="text-white/80">
                  Get smart, AI-powered career guidance based on your resume.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <Button 
                  variant="outline"
                  className="border-blue-400/50 text-blue-300 hover:bg-blue-400/20 backdrop-blur-sm"
                  onClick={() => navigate("/resume-analysis")}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Resume
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariant}
            custom={3}
          >
            <Card className="futuristic-glass h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-white neon-purple-text">Your Progress</CardTitle>
                <CardDescription className="text-white/70">Career path completion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white/90">Overall Progress</span>
                    <span className="text-sm text-white/70">{progress.toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={progress} 
                    className="h-2 bg-white/10" 
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariant}
            custom={4}
          >
            <Card className="futuristic-glass h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-white neon-purple-text">Career Suggestions</CardTitle>
                <CardDescription className="text-white/70">Based on your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 pt-2">
                  {careerSuggestions && careerSuggestions.length > 0 ? (
                    careerSuggestions.map((suggestion) => (
                      <Button 
                        key={suggestion.id}
                        variant="outline" 
                        className="w-full justify-between text-left bg-white/5 border-white/10 hover:bg-white/10 text-white backdroup-blur-md" 
                        onClick={() => navigate(`/role/${suggestion.id}`)}
                      >
                        <span>{suggestion.title}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-brand-500/20 text-brand-300 border-brand-400/30">
                            {suggestion.match_percentage}% match
                          </Badge>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </Button>
                    ))
                  ) : (
                    <p className="text-sm text-white/70">Complete the career designer to get personalized suggestions.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariant}
            custom={5}
          >
            <Card className="futuristic-glass h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-white neon-purple-text">Career Chat</CardTitle>
                <CardDescription className="text-white/70">Ask our AI assistant</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-white/80">
                  Need guidance on your next career step?
                </p>
                <Button onClick={() => navigate("/career-chat")} className="neon-button">
                  Start Chatting
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariant}
          custom={6}
        >
          <Card className="futuristic-glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white neon-purple-text">Your Roadmap</CardTitle>
                <CardDescription className="text-white/70">
                  Your personalized learning path
                </CardDescription>
              </div>
              <Button 
                variant="outline"
                className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                onClick={() => {
                  if (userRoadmaps && userRoadmaps.length > 0) {
                    // Export the roadmap data
                    const jsonData = JSON.stringify(userRoadmaps, null, 2);
                    const blob = new Blob([jsonData], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'career-roadmap.json';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }
                }}
                disabled={!userRoadmaps || userRoadmaps.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Roadmap
              </Button>
            </CardHeader>
            <CardContent>
              {userRoadmaps && userRoadmaps.length > 0 ? (
                <div className="space-y-4">
                  {userRoadmaps.map((roadmap) => (
                    <Button
                      key={roadmap.id}
                      variant="outline"
                      className="w-full justify-between bg-white/5 border-white/10 hover:bg-white/10 text-white"
                      onClick={() => navigate(`/roadmap/${roadmap.id}`)}
                    >
                      <span>{roadmap.title}</span>
                      <span className="text-xs text-white/70">
                        {roadmap.roadmap_steps.filter(step => step.completed).length} / {roadmap.roadmap_steps.length} steps
                      </span>
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-white/70">
                    You haven't created a roadmap yet. Complete the career designer questionnaire to generate your roadmap.
                  </p>
                  <Button 
                    className="mt-4 neon-button"
                    onClick={() => navigate("/career-designer")}
                  >
                    Design My Career
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
