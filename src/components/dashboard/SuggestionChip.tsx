
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";

export interface SuggestionChipProps {
  label: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export const SuggestionChip: React.FC<SuggestionChipProps> = ({
  label,
  href,
  onClick,
  className
}) => {
  const chipClasses = cn(
    "inline-flex rounded-full px-3 py-1 text-sm bg-purple-500/20 text-purple-100 hover:bg-purple-500/40 transition-colors cursor-pointer",
    className
  );
  
  if (href) {
    return (
      <Link to={href} className={chipClasses}>
        {label}
      </Link>
    );
  }
  
  return (
    <div onClick={onClick} className={chipClasses}>
      {label}
    </div>
  );
};

export default SuggestionChip;
