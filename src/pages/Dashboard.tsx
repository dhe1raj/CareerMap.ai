
import React, { useEffect, useState } from 'react';
import { SEOMetadata } from '@/components/SEOMetadata';
import DashboardLayout from '@/components/DashboardLayout';
import { RoadmapProgress } from '@/components/dashboard/RoadmapProgress';
import { CareerChat } from '@/components/dashboard/CareerChat';
import { ResumeAnalysis } from '@/components/dashboard/ResumeAnalysis';
import { SuggestionChip } from '@/components/dashboard/SuggestionChip';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRoadmaps } from '@/hooks/use-roadmaps';
import { RoadmapCard } from '@/components/roadmap/RoadmapCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { roadmaps, userProgress, isLoading } = useRoadmaps();
  const [inProgressRoadmaps, setInProgressRoadmaps] = useState<any[]>([]);
  
  // Find the progress for a particular roadmap
  const getProgress = (roadmapId: string) => {
    const progress = userProgress.find((p) => p.roadmap_id === roadmapId);
    return progress ? progress.progress_pct : 0;
  };

  useEffect(() => {
    if (roadmaps.length > 0 && userProgress.length > 0) {
      // Get roadmaps with progress between 1% and 99%
      const inProgress = roadmaps
        .filter((roadmap) => {
          const progress = getProgress(roadmap.id!);
          return progress > 0 && progress < 100;
        })
        .sort((a, b) => getProgress(b.id!) - getProgress(a.id!))
        .slice(0, 3);
      
      setInProgressRoadmaps(inProgress);
    }
  }, [roadmaps, userProgress]);

  return (
    <DashboardLayout>
      <SEOMetadata 
        title="Dashboard | CareerMapAI" 
        description="Welcome to your CareerMap dashboard. Track your career progress, design roadmaps, and analyze your resume."
      />
      
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <RoadmapProgress />
          </div>
          
          <div className="space-y-6">
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle>Career Suggestions</CardTitle>
                <CardDescription>Personalized for your journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <SuggestionChip label="Create Career Roadmap" icon="map" href="/career-designer" />
                  <SuggestionChip label="Upload Resume" icon="file" href="/resume-analysis" />
                  <SuggestionChip label="Track Progress" icon="checklist" href="/career-progress" />
                  <SuggestionChip label="Find Career Matches" icon="search" href="/career-matches" />
                </div>
              </CardContent>
            </Card>
            
            <CareerChat />
          </div>
        </div>
        
        <ResumeAnalysis />
        
        {/* My Roadmaps Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">My Roadmaps</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/career-progress')}
            >
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          ) : inProgressRoadmaps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressRoadmaps.map((roadmap) => (
                <RoadmapCard
                  key={roadmap.id}
                  roadmap={roadmap}
                  progress={getProgress(roadmap.id!)}
                />
              ))}
            </div>
          ) : roadmaps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roadmaps.slice(0, 3).map((roadmap) => (
                <RoadmapCard
                  key={roadmap.id}
                  roadmap={roadmap}
                  progress={getProgress(roadmap.id!)}
                />
              ))}
            </div>
          ) : (
            <Card className="glass-morphism text-center">
              <CardContent className="pt-6 pb-6">
                <p className="mb-4">You don't have any roadmaps yet. Create one to start tracking your career progress.</p>
                <Button onClick={() => navigate('/career-designer')} className="glowing-purple">
                  Create My First Roadmap
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
