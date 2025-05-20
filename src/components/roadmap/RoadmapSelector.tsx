
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Code, Server, Shield, Cloud, GitMerge, Layers, Palette, Brain } from "lucide-react";
import { roadmapTemplates } from "@/data/roadmapTemplates";

interface RoadmapSelectorProps {
  onSelect: (templateId: string) => void;
  selectedId?: string;
}

export function RoadmapSelector({ onSelect, selectedId }: RoadmapSelectorProps) {
  // Map of icons for each roadmap type
  const roadmapIcons = {
    "ai-ml-engineer": <Brain className="h-6 w-6" />,
    "data-scientist": <Code className="h-6 w-6" />,
    "software-developer": <Code className="h-6 w-6" />,
    "cybersecurity-analyst": <Shield className="h-6 w-6" />,
    "cloud-architect": <Cloud className="h-6 w-6" />,
    "devops-engineer": <GitMerge className="h-6 w-6" />,
    "full-stack-dev": <Layers className="h-6 w-6" />,
    "ui-ux-designer": <Palette className="h-6 w-6" />,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {roadmapTemplates.map((template) => (
        <Card 
          key={template.id} 
          className={`glass-morphism card-hover cursor-pointer transition-all ${
            selectedId === template.id 
              ? "border-primary border-2 shadow-[0_0_15px_rgba(168,85,247,0.4)]" 
              : ""
          }`}
          onClick={() => onSelect(template.id)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">{template.title}</CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/20 p-1 flex items-center justify-center text-primary">
              {roadmapIcons[template.id as keyof typeof roadmapIcons]}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/70">
              {template.steps.length} step roadmap to become a {template.title}
            </p>
          </CardContent>
          <CardFooter>
            {selectedId === template.id ? (
              <div className="flex items-center text-primary text-sm gap-1">
                <Check className="h-4 w-4" />
                Selected
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => onSelect(template.id)}
              >
                Select This Path
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
