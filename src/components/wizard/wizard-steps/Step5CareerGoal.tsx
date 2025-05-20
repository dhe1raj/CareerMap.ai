
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type GoalType = 'new-job' | 'career-switch' | 'promotion' | 'startup';

interface Step5CareerGoalProps {
  value?: GoalType;
  onChange: (value: GoalType) => void;
}

export function Step5CareerGoal({ value, onChange }: Step5CareerGoalProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">What's your primary career goal?</h2>
        <p className="text-white/70">
          This helps us focus your roadmap on your specific goals.
        </p>
      </div>
      
      <RadioGroup value={value} onValueChange={(v) => onChange(v as GoalType)}>
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="new-job" id="new-job" />
            <div className="grid gap-1.5">
              <Label htmlFor="new-job" className="font-medium">
                Land a New Job
              </Label>
              <p className="text-sm text-white/70">
                I'm looking to get my first position in this field
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="career-switch" id="career-switch" />
            <div className="grid gap-1.5">
              <Label htmlFor="career-switch" className="font-medium">
                Career Switch
              </Label>
              <p className="text-sm text-white/70">
                I'm changing careers to a new field
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="promotion" id="promotion" />
            <div className="grid gap-1.5">
              <Label htmlFor="promotion" className="font-medium">
                Career Advancement
              </Label>
              <p className="text-sm text-white/70">
                I want to grow in my current field and get promoted
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="startup" id="startup" />
            <div className="grid gap-1.5">
              <Label htmlFor="startup" className="font-medium">
                Start My Own Business
              </Label>
              <p className="text-sm text-white/70">
                I want to build skills to launch my own venture
              </p>
            </div>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
}
