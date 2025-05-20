
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Step4StreamProps {
  value?: string;
  onChange: (value: string) => void;
}

export function Step4Stream({ value, onChange }: Step4StreamProps) {
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
        <h2 className="text-xl font-semibold mb-2">What field are you in?</h2>
        <p className="text-white/70">
          Tell us your major, stream, or current domain of work.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="stream">Field / Stream / Domain</Label>
        <Select 
          value={selectedType === "other" ? "other" : value || ""} 
          onValueChange={handleSelectionChange}
        >
          <SelectTrigger id="stream" className="glass-input">
            <SelectValue placeholder="Select your field or domain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Computer Science">Computer Science</SelectItem>
            <SelectItem value="Information Technology">Information Technology</SelectItem>
            <SelectItem value="Software Engineering">Software Engineering</SelectItem>
            <SelectItem value="Data Science">Data Science</SelectItem>
            <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
            <SelectItem value="AI/ML">AI/Machine Learning</SelectItem>
            <SelectItem value="Web Development">Web Development</SelectItem>
            <SelectItem value="Mobile Development">Mobile Development</SelectItem>
            <SelectItem value="Design">UI/UX Design</SelectItem>
            <SelectItem value="Product Management">Product Management</SelectItem>
            <SelectItem value="other">Other (specify)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {selectedType === "other" && (
        <div className="space-y-2">
          <Label htmlFor="customStream">Specify Field</Label>
          <Input
            id="customStream"
            value={customValue}
            onChange={handleCustomChange}
            className="glass-input"
            placeholder="Enter your field or domain"
          />
        </div>
      )}
    </div>
  );
}
