
import { useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface RoadmapSummary {
  id: string;
  title: string;
  skills: string[];
  tools: string[];
  resources: { label: string; url?: string }[];
}

interface LatestRoadmapSummaryProps {
  roadmap: RoadmapSummary | null;
  isLoading: boolean;
  setRoadmapRef: (ref: HTMLDivElement | null) => void;
  userRoadmapText?: string;
}

export function LatestRoadmapSummary({ 
  roadmap, 
  isLoading, 
  setRoadmapRef,
  userRoadmapText 
}: LatestRoadmapSummaryProps) {
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-2">
        <div className="w-6 h-6 border-2 border-t-brand-400 border-white/20 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (roadmap) {
    return (
      <div 
        className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10"
        ref={setRoadmapRef}
      >
        <h4 className="text-sm font-semibold text-gradient mb-2">
          Latest Roadmap: {roadmap.title}
        </h4>
        
        <Tabs defaultValue="skills" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-2">
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="skills" className="mt-2 space-y-2">
            {roadmap.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {roadmap.skills.map((skill, index) => (
                  <Badge key={index} className="bg-purple-800/50 hover:bg-purple-700/60 text-white">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-white/60 italic">No skills defined in this roadmap</p>
            )}
          </TabsContent>
          
          <TabsContent value="tools" className="mt-2 space-y-2">
            {roadmap.tools.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {roadmap.tools.map((tool, index) => (
                  <Badge key={index} className="bg-blue-800/50 hover:bg-blue-700/60 text-white">
                    {tool}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-white/60 italic">No tools defined in this roadmap</p>
            )}
          </TabsContent>
          
          <TabsContent value="resources" className="mt-2 space-y-2">
            {roadmap.resources.length > 0 ? (
              <div className="space-y-2">
                {roadmap.resources.map((resource, index) => (
                  <div key={index} className="text-xs">
                    {resource.url ? (
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        {resource.label}
                      </a>
                    ) : (
                      <span>{resource.label}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-white/60 italic">No resources defined in this roadmap</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  } else if (userRoadmapText) {
    return (
      <div 
        className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10"
        ref={setRoadmapRef}
      >
        <h4 className="text-sm font-medium text-gradient mb-2">Your Career Roadmap</h4>
        <div className="text-xs text-white/70">
          {userRoadmapText}
        </div>
      </div>
    );
  }
  
  return null;
}
