
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SuggestionChipProps {
  label: string;
  route?: string;
  className?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export function SuggestionChip({ 
  label, 
  route, 
  className = "", 
  icon, 
  onClick 
}: SuggestionChipProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (route) {
      navigate(route);
    } else {
      navigate(`/career-matches?role=${encodeURIComponent(label)}`);
    }
  };
  
  return (
    <button 
      onClick={handleClick}
      className={`flex items-center gap-2 py-2 px-4 rounded-full bg-white/10 backdrop-blur-md 
                border border-white/20 hover:bg-white/15 hover:border-brand-400/50 
                hover:shadow-[0_0_12px_rgba(168,85,247,0.4)] transition-all duration-300 
                group ${className}`}
    >
      {icon && <span className="text-brand-400">{icon}</span>}
      <span className="text-sm text-white/90">{label}</span>
      <ArrowRight className="h-4 w-4 text-brand-400 opacity-70 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
