
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SEOMetadata from '@/components/SEOMetadata';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Share2, RefreshCw, AlertTriangle } from 'lucide-react';
import { RoadmapTree } from '@/components/roadmap/RoadmapTree';
import { useRoadmaps } from '@/hooks/use-roadmaps';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';

export default function Roadmap() {
  const { roadmapId } = useParams<{ roadmapId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getRoadmap, updateItemStatus, resetProgress, toggleRoadmapPublic } = useRoadmaps();
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [progressData, setProgressData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRoadmap() {
      if (!roadmapId) return;
      
      setIsLoading(true);
      try {
        const result = await getRoadmap(roadmapId);
        
        if (!result || !result.roadmap) {
          navigate('/career-designer');
          return;
        }
        
        setRoadmapData(result.roadmap);
        setProgressData(result.progress);
      } catch (error) {
        console.error("Error fetching roadmap:", error);
        toast.error("Failed to load roadmap");
        navigate('/career-progress');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchRoadmap();
  }, [roadmapId, getRoadmap, navigate]);

  const handleItemStatusChange = async (itemId: string, completed: boolean) => {
    if (!roadmapId || !user) return;
    
    try {
      const updatedProgress = await updateItemStatus(roadmapId, itemId, completed);
      if (updatedProgress) {
        // Update the progress data using the returned result
        setProgressData(prevProgress => {
          if (!prevProgress) return updatedProgress;
          return {
            ...prevProgress,
            progress_pct: updatedProgress.progress_pct,
            completed_items: updatedProgress.completed_items
          };
        });
        
        if (completed) {
          toast.success('Progress updated!');
        }
      }
    } catch (error) {
      console.error("Error updating item status:", error);
      toast.error("Failed to update progress");
    }
  };

  const handleResetProgress = async () => {
    if (!roadmapId || !user) return;
    
    await resetProgress(roadmapId);
    // Reset progress data
    setProgressData({
      ...progressData,
      completed_items: [],
      progress_pct: 0
    });
  };

  const handleTogglePublic = async () => {
    if (!roadmapId || !user || !roadmapData) return;
    
    await toggleRoadmapPublic(roadmapId, !roadmapData.is_public);
    
    // Update local state
    setRoadmapData({
      ...roadmapData,
      is_public: !roadmapData.is_public
    });
  };

  const handleExportPDF = async () => {
    if (!roadmapData) return;
    
    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(22);
      doc.text(`${roadmapData.title} Roadmap`, 20, 20);
      
      // Progress info
      const progressPct = progressData ? Math.round(progressData.progress_pct) : 0;
      doc.setFontSize(12);
      doc.text(`Progress: ${progressPct}%`, 20, 30);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 40);
      doc.text(`Career Map AI - careermapai.in`, 20, 50);
      
      // Create a spacer
      let yPosition = 70;
      
      // Loop through sections and items
      roadmapData.sections.forEach((section: any) => {
        // Check if we need a new page
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Section title
        doc.setFontSize(16);
        doc.text(section.title, 20, yPosition);
        yPosition += 10;
        
        // Section items
        doc.setFontSize(12);
        section.items.forEach((item: any) => {
          // Check if we need a new page
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          
          const checkmark = item.completed ? "✓" : "□";
          doc.text(`${checkmark} ${item.label}`, 25, yPosition);
          
          // Add tooltip as a subtext if it exists
          if (item.tooltip) {
            yPosition += 6;
            doc.setFontSize(10);
            doc.text(`    ${item.tooltip}`, 25, yPosition);
            doc.setFontSize(12);
          }
          
          yPosition += 10;
        });
        
        yPosition += 10;
      });
      
      // Save the PDF
      doc.save(`${roadmapData.title.toLowerCase().replace(/\s+/g, '-')}-roadmap.pdf`);
      toast.success('PDF exported successfully');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF');
    }
  };

  const handleCopyShareLink = () => {
    if (!roadmapData || !roadmapData.is_public) {
      toast.error('Make the roadmap public first to share it');
      return;
    }
    
    const url = `${window.location.origin}/roadmap/${roadmapId}`;
    navigator.clipboard.writeText(url);
    toast.success('Share link copied to clipboard');
  };

  const isOwner = user && roadmapData?.user_id === user.id;
  const progressPct = progressData ? Math.round(progressData.progress_pct) : 0;

  return (
    <DashboardLayout>
      <SEOMetadata 
        title={roadmapData ? `${roadmapData.title} Roadmap | CareerMap` : 'Loading Roadmap | CareerMap'}
        description={`Interactive step-by-step roadmap for ${roadmapData?.title || 'your career'}. Track your progress and complete your learning journey.`}
        keywords="roadmap, career path, skills, learning"
        canonicalPath={`/roadmap/${roadmapId}`}
      />
      
      <div className="container py-8 max-w-7xl">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-[500px] w-full" />
          </div>
        ) : roadmapData ? (
          <>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
              <div className="flex-grow">
                <h1 className="text-3xl font-bold mb-1">{roadmapData.title}</h1>
                <p className="text-muted-foreground">
                  <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full mr-2">
                    {roadmapData.type.charAt(0).toUpperCase() + roadmapData.type.slice(1)}
                  </span>
                  {roadmapData.sections.length} sections • {roadmapData.sections.reduce((acc: number, section: any) => acc + section.items.length, 0)} skills
                </p>
              </div>
              
              <div className="flex flex-col items-end">
                <div className="text-2xl font-bold">{progressPct}%</div>
                <div className="text-xs text-muted-foreground">Complete</div>
              </div>
            </div>
            
            <div className="mb-6 w-full">
              <Progress value={progressPct} className="h-2" />
            </div>
            
            {!user && (
              <Alert className="mb-6 bg-yellow-500/10 border-yellow-500/50">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <AlertDescription>
                  Sign in to track your progress on this roadmap.
                </AlertDescription>
              </Alert>
            )}
            
            <Card className="glass-morphism mb-6">
              <CardContent className="pt-6">
                <RoadmapTree 
                  roadmap={roadmapData} 
                  onItemClick={user ? handleItemStatusChange : undefined}
                  readonly={!user}
                />
              </CardContent>
              <CardFooter className="border-t border-white/10 pt-4 flex-wrap gap-2">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={handleExportPDF}>
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  
                  {isOwner && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleTogglePublic}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      {roadmapData.is_public ? 'Make Private' : 'Make Public'}
                    </Button>
                  )}
                  
                  {roadmapData.is_public && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleCopyShareLink}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Copy Share Link
                    </Button>
                  )}
                </div>
                
                {user && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleResetProgress}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset Progress
                  </Button>
                )}
              </CardFooter>
            </Card>
          </>
        ) : (
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>Roadmap Not Found</CardTitle>
              <CardDescription>
                The roadmap you're looking for doesn't exist or you don't have access to it.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate('/career-designer')}>
                Create a Roadmap
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
