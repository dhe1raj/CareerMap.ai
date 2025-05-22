
import { SuggestionChip } from "./SuggestionChip";

interface SuggestionsListProps {
  suggestions: string[];
  isLoading: boolean;
}

export function SuggestionsList({ suggestions, isLoading }: SuggestionsListProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-white/70">Suggested Roles</h4>
      
      {isLoading ? (
        <div className="flex justify-center py-2">
          <div className="w-6 h-6 border-2 border-t-brand-400 border-white/20 rounded-full animate-spin"></div>
        </div>
      ) : suggestions.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <SuggestionChip key={index} label={suggestion} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-white/60 italic">
          Complete your career design to get personalized suggestions
        </p>
      )}
    </div>
  );
}
