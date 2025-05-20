
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CareerRole {
  id: string;
  title: string;
  description: string;
  avg_salary: number;
  job_demand: string;
  work_environment: string;
}

interface CareerMatch extends CareerRole {
  matchPercentage: number;
  skills: string[];
}

export default function CareerMatches() {
  const navigate = useNavigate();

  // Fetch career roles from Supabase
  const { data: careerRoles, isLoading } = useQuery({
    queryKey: ['careerRoles'],
    queryFn: async () => {
      const { data: roles, error: rolesError } = await supabase
        .from('career_roles')
        .select('*');
        
      if (rolesError) {
        console.error("Error fetching career roles:", rolesError);
        return [];
      }
      
      // For each role, fetch the associated skills
      const rolesWithSkills = await Promise.all(
        roles.map(async (role) => {
          const { data: roleSkills, error: skillsError } = await supabase
            .from('role_skills')
            .select('skills(name)')
            .eq('role_id', role.id);
            
          if (skillsError) {
            console.error("Error fetching skills for role:", skillsError);
            return {
              ...role,
              skills: [],
              matchPercentage: Math.floor(Math.random() * (95 - 70) + 70)
            };
          }
          
          const skills = roleSkills.map(item => item.skills.name);
          
          return {
            ...role,
            skills,
            // In a real app, this would be calculated based on user skills and preferences
            matchPercentage: Math.floor(Math.random() * (95 - 70) + 70)
          };
        })
      );
      
      // Sort by match percentage in descending order
      return rolesWithSkills.sort((a, b) => b.matchPercentage - a.matchPercentage);
    }
  });

  // Fallback data for initial render or loading state
  const careerMatches = careerRoles || [];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Career Matches</h1>
          <p className="text-muted-foreground">
            Based on your answers, here are your top career matches
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Loading your career matches...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {careerMatches.map((career, index) => (
              <Card key={career.id} className={index === 0 ? "border-primary" : ""}>
                {index === 0 && (
                  <div className="bg-primary text-primary-foreground py-1 px-4 text-sm font-medium text-center">
                    Top Match
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{career.title}</CardTitle>
                      <CardDescription>Match: {career.matchPercentage}%</CardDescription>
                    </div>
                    <Badge variant={index === 0 ? "default" : "outline"} className={index === 0 ? "bg-primary" : ""}>
                      {career.matchPercentage}% Match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Overview</h3>
                    <p className="text-sm text-muted-foreground">{career.description}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Key Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {career.skills && career.skills.map((skill, i) => (
                        <Badge key={i} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-1">Salary Range</h3>
                      <p className="text-sm">${career.avg_salary.toLocaleString()}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Growth Outlook</h3>
                      <p className="text-sm">{career.job_demand}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => navigate(`/role/${career.id}`)}
                    className={index === 0 ? "bg-primary hover:bg-primary/90" : ""}
                  >
                    View Career Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
