
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { RoadmapStep } from "@/data/roadmapTemplates";

interface RoadmapStepsProps {
  steps: RoadmapStep[];
  onToggleStep: (stepOrder: number, completed: boolean) => void;
}

export function RoadmapSteps({ steps, onToggleStep }: RoadmapStepsProps) {
  return (
    <Card className="glass-morphism">
      <CardContent className="pt-6">
        <ul className="space-y-4">
          {steps.map((step) => (
            <li 
              key={step.order}
              className={`p-4 rounded-md flex items-start gap-3 transition-colors ${
                step.completed 
                  ? "bg-primary/10 border border-primary/30" 
                  : "bg-white/5 border border-white/10"
              }`}
            >
              <Checkbox 
                checked={step.completed} 
                onCheckedChange={(checked) => onToggleStep(step.order, !!checked)}
                className={step.completed ? "border-primary" : ""}
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className={`text-sm font-medium mb-1 ${step.completed ? "text-primary" : ""}`}>
                    {step.label}
                  </p>
                  <Badge variant="outline" className="ml-2">
                    {step.estTime}
                  </Badge>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
