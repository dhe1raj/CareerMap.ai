
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
        <Button onClick={() => navigate("/career-designer")} className="glowing-purple">
          Create Your First Roadmap
        </Button>
      </CardContent>
    </Card>
  );
};
