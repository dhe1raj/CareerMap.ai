
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StepSixProps {
  value: string;
  details: string;
  onChange: (value: string) => void;
  onDetailsChange: (value: string) => void;
}

const goalOptions = [
  { value: "first-internship", label: "Land first internship" },
  { value: "full-time-offer", label: "Get full-time offer" },
  { value: "switch-careers", label: "Switch careers" },
  { value: "level-up", label: "Level-up for promo" },
  { value: "side-hustle", label: "Start a side-hustle" },
];

export default function StepSix({ value, details, onChange, onDetailsChange }: StepSixProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="immediate-goal" className="text-lg">
          What's your immediate goal?
        </Label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger
            id="immediate-goal"
            className="w-full glass-input"
          >
            <SelectValue placeholder="Select your immediate goal" />
          </SelectTrigger>
          <SelectContent>
            {goalOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="goal-details" className="text-sm text-white/70">
          Additional details about your goal (optional)
        </Label>
        <Textarea
          id="goal-details"
          placeholder="Add more details if you like..."
          className="glass-input min-h-24"
          value={details}
          onChange={(e) => onDetailsChange(e.target.value)}
        />
      </div>
    </div>
  );
}
