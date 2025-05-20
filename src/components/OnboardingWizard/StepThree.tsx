
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StepThreeProps {
  value: string;
  details: string;
  onChange: (value: string) => void;
  onDetailsChange: (value: string) => void;
}

const experienceOptions = [
  { value: "0", label: "0 (Just starting)" },
  { value: "0-1", label: "0-1 years" },
  { value: "1-3", label: "1-3 years" },
  { value: "3-5", label: "3-5 years" },
  { value: "5+", label: "5+ years" },
];

export default function StepThree({ value, details, onChange, onDetailsChange }: StepThreeProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="years-experience" className="text-lg">
          Years of experience in your primary field?
        </Label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger
            id="years-experience"
            className="w-full glass-input"
          >
            <SelectValue placeholder="Select your experience level" />
          </SelectTrigger>
          <SelectContent>
            {experienceOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience-details" className="text-sm text-white/70">
          Additional details about your experience (optional)
        </Label>
        <Textarea
          id="experience-details"
          placeholder="Add more details if you like..."
          className="glass-input min-h-24"
          value={details}
          onChange={(e) => onDetailsChange(e.target.value)}
        />
      </div>
    </div>
  );
}
