
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Career Progress</h1>
          <p className="text-muted-foreground mt-2">Track your personalized roadmap progress in real time</p>
        </div>
        
        {isRoadmapsLoading ? (
          <RoadmapLoader />
        ) : roadmaps.length === 0 ? (
          <EmptyRoadmapState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
