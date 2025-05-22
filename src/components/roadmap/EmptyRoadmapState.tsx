
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const EmptyRoadmapState = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="glass-morphism">
      <CardHeader>
        <CardTitle>No Roadmaps Found</CardTitle>
        <CardDescription>
          You haven't created any roadmaps yet. Start one from the Career Design page!
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center py-8">
        <div className="mb-8">
          {/* Illustration with neon purple style */}
          <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-brand-500/10 flex items-center justify-center">
            <div className="text-6xl">🧭</div>
          </div>
          <p className="text-muted-foreground">
            Visit Career Design to generate your personalized career roadmap
          </p>
        </div>
        <Button 
          onClick={() => navigate("/career-designer")} 
          className="bg-gradient-to-r from-[#9F68F0] to-purple-600 hover:from-[#8A50DB] hover:to-purple-700"
        >
          Go to Career Design
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};
