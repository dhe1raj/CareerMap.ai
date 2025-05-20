
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StepOneProps {
  value: string;
  details: string;
  onChange: (value: string) => void;
  onDetailsChange: (value: string) => void;
}

const roleOptions = [
  { value: "student", label: "Student" },
  { value: "intern", label: "Intern" },
  { value: "employee", label: "Full-time Employee" },
  { value: "freelancer", label: "Freelancer" },
  { value: "job-seeker", label: "Job-seeker" },
  { value: "career-switcher", label: "Career Switcher" },
];

export default function StepOne({ value, details, onChange, onDetailsChange }: StepOneProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="role-status" className="text-lg">
          Which best describes you right now?
        </Label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger
            id="role-status"
            className="w-full glass-input"
          >
            <SelectValue placeholder="Select your current status" />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role-details" className="text-sm text-white/70">
          Additional details (optional)
        </Label>
        <Textarea
          id="role-details"
          placeholder="Add more details if you like..."
          className="glass-input min-h-24"
          value={details}
          onChange={(e) => onDetailsChange(e.target.value)}
        />
      </div>
    </div>
  );
}
