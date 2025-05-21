
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useGeminiCareer } from "@/hooks/use-gemini-career";
import { Briefcase, BookOpen, ArrowRight } from "lucide-react";
import "../styles/glassmorphism.css";

interface CareerMatch {
  id: string;
  role: string;
  short_desc: string;
  icon: string;
  match_pct: number;
  bullets: string[];
  created_at: string;
}

export default function CareerMatches() {
  const [matches, setMatches] = useState<CareerMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isProcessing, generateSuggestions } = useGeminiCareer();

  useEffect(() => {
    const fetchMatches = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Check if user already has matches
        const { data: userMatches, error: matchesError } = await supabase
          .from('user_matches')
          .select(`
            match_id,
            matches (*)
          `)
          .eq('user_id', user.id);
        
        if (matchesError) throw matchesError;
        
        if (userMatches && userMatches.length > 0) {
          const formattedMatches = userMatches.map(item => item.matches);
          setMatches(formattedMatches);
        } else {
          // Need to generate matches with AI
          await generateMatchesWithAI();
        }
      } catch (error) {
        console.error("Error fetching career matches:", error);
        toast({
          title: "Error",
          description: "Failed to load career matches. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMatches();
  }, [user, toast]);
  
  // Generate matches using AI
  const generateMatchesWithAI = async () => {
    if (!user) return;
    
    try {
      // Get user profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      
      // Mock data for demonstration (replace with actual AI call)
      const mockMatches = [
        {
          id: "1",
          role: "Software Engineer",
          short_desc: "Develop applications and systems using various programming languages",
          icon: "code",
          match_pct: 95,
          bullets: ["Strong coding skills", "Problem-solving aptitude", "Avg salary: $120K"],
          created_at: new Date().toISOString()
        },
        {
          id: "2",
          role: "Data Scientist",
          short_desc: "Extract insights from large datasets and create predictive models",
          icon: "database",
          match_pct: 92,
          bullets: ["Statistical analysis", "Machine learning", "Avg salary: $130K"],
          created_at: new Date().toISOString()
        },
        {
          id: "3",
          role: "UX Designer",
          short_desc: "Design user interfaces and experiences for digital products",
          icon: "layout",
          match_pct: 88,
          bullets: ["Creative thinking", "User empathy", "Avg salary: $110K"],
          created_at: new Date().toISOString()
        },
        {
          id: "4",
          role: "Product Manager",
          short_desc: "Lead development of products from conception to launch",
          icon: "briefcase",
          match_pct: 85,
          bullets: ["Strategic planning", "Team leadership", "Avg salary: $140K"],
          created_at: new Date().toISOString()
        },
        {
          id: "5",
          role: "DevOps Engineer",
          short_desc: "Manage infrastructure and deployment pipelines",
          icon: "server",
          match_pct: 82,
          bullets: ["CI/CD experience", "Cloud platforms", "Avg salary: $125K"],
          created_at: new Date().toISOString()
        },
        {
          id: "6",
          role: "AI Engineer",
          short_desc: "Build AI models and systems that can perform tasks requiring human intelligence",
          icon: "cpu",
          match_pct: 79,
          bullets: ["Deep learning", "Neural networks", "Avg salary: $135K"],
          created_at: new Date().toISOString()
        }
      ];
      
      setMatches(mockMatches);
      
      // In a real implementation, we would:
      // 1. Call Gemini API with user profile data
      // 2. Insert results into the matches table
      // 3. Link matches to user in user_matches table
    } catch (error) {
      console.error("Error generating AI matches:", error);
      toast({
        title: "Error",
        description: "Failed to generate career matches. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Add role to user's saved paths
  const addToMyPaths = async (matchId: string) => {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please log in to save career paths",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Insert into user_matches table
      const { error } = await supabase
        .from('user_matches')
        .upsert({
          user_id: user.id,
          match_id: matchId,
          saved_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Career path added to your saved paths",
      });
      
      // Navigate to Career Designer with this role pre-selected
      navigate(`/career-designer?role=${matchId}`);
    } catch (error) {
      console.error("Error saving career path:", error);
      toast({
        title: "Error",
        description: "Failed to save career path. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg">Finding your perfect career matches...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">Matched Roles for You</h1>
        <p className="text-white/70 mb-8">These careers align with your skills, interests, and goals.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <Card key={match.id} className="card-hover glass-morphism">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="secondary" className="bg-primary/20 text-white">
                    {match.match_pct}% match
                  </Badge>
                  <Briefcase className="h-6 w-6 text-purple-400" />
                </div>
                <CardTitle className="text-xl text-gradient-primary mt-2">{match.role}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-4">{match.short_desc}</p>
                <ul className="space-y-1 mb-4">
                  {match.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-purple-400">•</span>
                      <span className="text-white/70">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                  onClick={() => navigate(`/role-details/${match.id}`)}
                >
                  Explore Role
                </Button>
                <Button 
                  size="sm"
                  className="flex-1"
                  onClick={() => addToMyPaths(match.id)}
                >
                  Add to My Paths
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
