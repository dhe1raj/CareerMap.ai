
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Step1AgeProps {
  value?: number;
  onChange: (value: number) => void;
}

export function Step1Age({ value, onChange }: Step1AgeProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">What's your age?</h2>
        <p className="text-white/70">
          This helps us personalize your career recommendations.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          min={16}
          max={100}
          value={value || ''}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="glass-input"
          placeholder="Enter your age"
        />
      </div>
    </div>
  );
}
