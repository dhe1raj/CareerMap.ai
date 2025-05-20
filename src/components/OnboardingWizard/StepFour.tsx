
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface StepFourProps {
  values: string[];
  details: string;
  onChange: (values: string[]) => void;
  onDetailsChange: (value: string) => void;
}

const techStackOptions = [
  "Web Dev", 
  "AI/ML", 
  "Data Science",
  "Mobile Dev",
  "UI/UX Design", 
  "DevOps",
  "Cybersecurity",
  "Cloud Computing",
  "Blockchain",
  "Game Dev",
  "Marketing",
  "Finance",
  "Product Management",
  "Healthcare",
  "Embedded Systems"
];

export default function StepFour({ values, details, onChange, onDetailsChange }: StepFourProps) {
  const handleToggleOption = (tech: string) => {
    if (values.includes(tech)) {
      onChange(values.filter(v => v !== tech));
    } else {
      onChange([...values, tech]);
    }
  };

  const handleRemoveTech = (tech: string) => {
    onChange(values.filter(v => v !== tech));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-lg">
          Your core tech stacks / domains?
        </Label>
        <div className="flex flex-wrap gap-2 mb-4">
          {values.length > 0 ? (
            values.map((tech) => (
              <Badge 
                key={tech} 
                className="py-2 px-4 bg-brand-600/40 border-brand-400/30 hover:bg-brand-600/70 transition-colors"
              >
                {tech}
                <button
                  className="ml-2 text-white/70 hover:text-white"
                  onClick={() => handleRemoveTech(tech)}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))
          ) : (
            <div className="text-white/50 text-sm italic">
              Select your tech stacks/domains below
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {techStackOptions.map((tech) => (
            <Button
              key={tech}
              variant={values.includes(tech) ? "default" : "outline"}
              className={values.includes(tech) ? "bg-brand-600/70" : ""}
              onClick={() => handleToggleOption(tech)}
              type="button"
              size="sm"
            >
              {tech}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tech-details" className="text-sm text-white/70">
          Other tech stacks or details (optional)
        </Label>
        <Textarea
          id="tech-details"
          placeholder="Add more details if you like..."
          className="glass-input min-h-20"
          value={details}
          onChange={(e) => onDetailsChange(e.target.value)}
        />
      </div>
    </div>
  );
}
