
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.max(0, Math.min(100, progress));
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <span className="text-sm text-white/70">Career Progress</span>
        <span className="text-sm font-semibold text-white">{normalizedProgress}%</span>
      </div>
      <Progress value={normalizedProgress} className="h-2 bg-white/10" />
    </div>
  );
}
