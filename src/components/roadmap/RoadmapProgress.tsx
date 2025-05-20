
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Award, Download, RefreshCw, Sparkles } from "lucide-react";
import { UserRoadmap } from "@/hooks/use-roadmap";
import { formatDistanceToNow } from "date-fns";

interface RoadmapProgressProps {
  roadmap: UserRoadmap;
  progress: number;
  onReset: () => void;
  onPersonalize?: () => void;
  onExport?: () => void;
  personalizeDisabled?: boolean;
}

export function RoadmapProgress({
  roadmap,
  progress,
  onReset,
  onPersonalize,
  onExport,
  personalizeDisabled
}: RoadmapProgressProps) {
  const lastUpdatedFormatted = formatDistanceToNow(
    new Date(roadmap.lastUpdated),
    { addSuffix: true }
  );

  return (
    <Card className="glass-morphism w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-gradient-primary text-2xl">
              {roadmap.title} Roadmap
            </CardTitle>
            <CardDescription>Your career progress</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {progress === 100 && (
              <div className="bg-primary/20 text-primary px-3 py-1 rounded-full flex items-center gap-1">
                <Award className="h-4 w-4" />
                <span className="text-sm font-medium">Completed!</span>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={onReset}>
              <RefreshCw className="h-4 w-4 mr-2" /> Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-white/70">Progress</span>
            <span className="text-sm font-medium">{progress}% Complete</span>
          </div>
          <Progress
            value={progress}
            className="h-2"
          />
        </div>

        <div className="text-xs text-white/50">
          Last updated: {lastUpdatedFormatted}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {onPersonalize && (
          <Button
            variant="default"
            size="sm"
            onClick={onPersonalize}
            disabled={personalizeDisabled}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Personalize with AI
          </Button>
        )}
        {onExport && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
