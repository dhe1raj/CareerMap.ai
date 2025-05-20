
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Step3EducationProps {
  value?: string;
  onChange: (value: string) => void;
}

export function Step3Education({ value, onChange }: Step3EducationProps) {
  const [selectedType, setSelectedType] = useState<string>("select");
  const [customValue, setCustomValue] = useState<string>("");
  
  const handleSelectionChange = (selected: string) => {
    if (selected === "other") {
      setSelectedType("other");
      onChange(customValue);
    } else {
      setSelectedType("select");
      onChange(selected);
    }
  };
  
  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">What's your highest education?</h2>
        <p className="text-white/70">
          This helps us understand your academic background.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="education">Highest Education</Label>
        <Select 
          value={selectedType === "other" ? "other" : value || ""} 
          onValueChange={handleSelectionChange}
        >
          <SelectTrigger id="education" className="glass-input">
            <SelectValue placeholder="Select your highest education" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="High School">High School</SelectItem>
            <SelectItem value="Associate's Degree">Associate's Degree</SelectItem>
            <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
            <SelectItem value="Master's Degree">Master's Degree</SelectItem>
            <SelectItem value="PhD">PhD</SelectItem>
            <SelectItem value="Bootcamp">Bootcamp Graduate</SelectItem>
            <SelectItem value="Self-Taught">Self-Taught</SelectItem>
            <SelectItem value="other">Other (specify)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {selectedType === "other" && (
        <div className="space-y-2">
          <Label htmlFor="customEducation">Specify Education</Label>
          <Input
            id="customEducation"
            value={customValue}
            onChange={handleCustomChange}
            className="glass-input"
            placeholder="Enter your education"
          />
        </div>
      )}
    </div>
  );
}
