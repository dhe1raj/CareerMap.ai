
import React, { useEffect } from 'react';
import SEOMetadata from '@/components/SEOMetadata';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { RoadmapCard } from '@/components/roadmap/RoadmapCard';
import { useRoadmaps } from '@/hooks/use-roadmaps';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PlusCircle } from 'lucide-react';

export default function CareerProgress() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { roadmaps, userProgress, fetchRoadmaps, deleteRoadmap, toggleRoadmapPublic, isLoading } = useRoadmaps();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleDeleteRoadmap = (id: string) => {
    toast("Are you sure you want to delete this roadmap?", {
      action: {
        label: "Delete",
        onClick: () => {
          deleteRoadmap(id);
          toast.success("Roadmap deleted successfully");
        }
      },
      cancel: {
        label: "Cancel",
        onClick: () => {}
      }
    });
  };

  // Find the progress for a particular roadmap
  const getProgress = (roadmapId: string) => {
    const progress = userProgress.find((p) => p.roadmap_id === roadmapId);
    return progress ? progress.progress_pct : 0;
  };

  // Filter roadmaps to only show the user's roadmaps
  const userRoadmaps = roadmaps.filter((roadmap) => roadmap.user_id === user?.id);

  return (
    <DashboardLayout>
      <SEOMetadata 
        title="Career Progress | CareerMap"
        description="Track your learning progress across all your career roadmaps and skills."
        keywords="career progress, roadmaps, learning progress"
        canonicalPath="/career-progress"
      />
      
      <div className="container py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Career Progress</h1>
            <p className="text-muted-foreground">Track your progress across all your roadmaps</p>
          </div>
          
          <Button onClick={() => navigate('/career-designer')} className="glowing-purple">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Roadmap
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="glass-morphism">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : userRoadmaps.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userRoadmaps.map((roadmap) => (
              <RoadmapCard
                key={roadmap.id}
                roadmap={roadmap}
                progress={getProgress(roadmap.id!)}
                onDelete={handleDeleteRoadmap}
                onTogglePublic={toggleRoadmapPublic}
              />
            ))}
          </div>
        ) : (
          <Card className="glass-morphism text-center">
            <CardHeader>
              <CardTitle>No Roadmaps Found</CardTitle>
              <CardDescription>
                You don't have any career roadmaps yet. Create one to start tracking your progress.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <Button onClick={() => navigate('/career-designer')} className="glowing-purple">
                Design My Career Path
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
