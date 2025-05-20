
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type StatusType = 'Student' | 'Working' | 'Experienced' | 'Intern';

interface Step2StatusProps {
  value?: StatusType;
  onChange: (value: StatusType) => void;
}

export function Step2Status({ value, onChange }: Step2StatusProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">What's your current status?</h2>
        <p className="text-white/70">
          This helps us recommend the right path for your situation.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Current Status</Label>
        <Select 
          value={value} 
          onValueChange={(v) => onChange(v as StatusType)}
        >
          <SelectTrigger id="status" className="glass-input">
            <SelectValue placeholder="Select your current status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Student">Student</SelectItem>
            <SelectItem value="Working">Currently Working (0-3 years)</SelectItem>
            <SelectItem value="Experienced">Experienced Professional (3+ years)</SelectItem>
            <SelectItem value="Intern">Intern / Trainee</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
