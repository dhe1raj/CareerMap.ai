
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface StepFiveProps {
  values: string[];
  details: string;
  onChange: (values: string[]) => void;
  onDetailsChange: (value: string) => void;
}

export default function StepFive({ values, details, onChange, onDetailsChange }: StepFiveProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAddSkill = () => {
    if (!inputValue.trim() || values.includes(inputValue.trim())) return;
    if (values.length >= 3) {
      // Notify user about the 3-skill limit
      return;
    }
    
    const newSkills = [...values, inputValue.trim()];
    onChange(newSkills);
    setInputValue("");
  };

  const handleRemoveSkill = (skill: string) => {
    onChange(values.filter(v => v !== skill));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-lg">
          Top three skills you're confident about?
        </Label>
        <div className="flex flex-wrap gap-2 mb-4">
          {values.map((skill) => (
            <Badge 
              key={skill} 
              className="py-2 px-4 bg-brand-600/40 border-brand-400/30 hover:bg-brand-600/70 transition-colors"
            >
              {skill}
              <button
                className="ml-2 text-white/70 hover:text-white"
                onClick={() => handleRemoveSkill(skill)}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          
          {values.length === 0 && (
            <div className="text-white/50 text-sm italic">
              Add up to three skills you're most confident about
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a skill and press Enter or Add"
            className="glass-input"
            disabled={values.length >= 3}
          />
          <Button 
            onClick={handleAddSkill} 
            disabled={!inputValue.trim() || values.length >= 3}
            type="button"
          >
            Add
          </Button>
        </div>
        {values.length >= 3 && (
          <p className="text-sm text-brand-300">
            Maximum 3 skills reached. Remove a skill to add a new one.
          </p>
        )}
      </div>

      <div className="space-y-2 mt-6">
        <Label htmlFor="skills-details" className="text-sm text-white/70">
          Additional details about your skills (optional)
        </Label>
        <Textarea
          id="skills-details"
          placeholder="Add more details if you like..."
          className="glass-input min-h-20"
          value={details}
          onChange={(e) => onDetailsChange(e.target.value)}
        />
      </div>
    </div>
  );
}
