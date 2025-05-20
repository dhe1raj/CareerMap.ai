
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Route } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CareerDesignCardProps {
  userRoadmap: any;
  roadmapProgress: number;
}

export function CareerDesignCard({ userRoadmap, roadmapProgress }: CareerDesignCardProps) {
  const navigate = useNavigate();
  
  return (
    <Card className="glass-morphism card-hover">
      <CardHeader>
        <CardTitle>Career Design</CardTitle>
        <CardDescription>
          Build your personalized career roadmap
        </CardDescription>
      </CardHeader>
      <CardContent>
        {userRoadmap ? (
          <div>
            <p className="text-white/70">
              You have a {userRoadmap.title} roadmap with {roadmapProgress}% progress.
            </p>
            <div className="w-full bg-white/10 rounded-full h-2.5 mt-3">
              <div 
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${roadmapProgress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <p className="text-white/70">
            Create a step-by-step roadmap for your career with our interactive tool.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => navigate("/career-design")}
          className="w-full"
          variant="outline"
        >
          <Route className="mr-2 h-4 w-4" />
          {userRoadmap ? "View My Roadmap" : "Create Roadmap"}
          <ChevronRight className="ml-auto h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
