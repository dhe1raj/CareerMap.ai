
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { useRoadmaps } from "@/hooks/use-roadmaps";
import { RoadmapCard } from "@/components/roadmap/RoadmapCard";
import { EmptyRoadmapState } from "@/components/roadmap/EmptyRoadmapState";
import { RoadmapLoader } from "@/components/roadmap/RoadmapLoader";

export default function CareerProgress() {
  const navigate = useNavigate();
  const {
    roadmaps,
    isRoadmapsLoading,
    handleProgressUpdate,
    handleDeleteRoadmap
  } = useRoadmaps();
  
  return (
    <DashboardLayout>
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Career Progress</h1>
          <p className="text-muted-foreground mt-2">Track your personalized roadmap progress in real time</p>
        </div>
        
        {isRoadmapsLoading ? (
          <div className="w-full">
            <RoadmapLoader />
          </div>
        ) : roadmaps.length === 0 ? (
          <div className="w-full min-h-[60vh] flex items-center justify-center">
            <EmptyRoadmapState />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {roadmaps.map((roadmap, index) => (
              <RoadmapCard
                key={roadmap.id || index}
                roadmap={roadmap}
                onDelete={handleDeleteRoadmap}
                onProgressUpdate={handleProgressUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
