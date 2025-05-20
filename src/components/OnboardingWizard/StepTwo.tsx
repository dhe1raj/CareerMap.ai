
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StepTwoProps {
  value: string;
  details: string;
  onChange: (value: string) => void;
  onDetailsChange: (value: string) => void;
}

// Example organizations for type-ahead search (in a real app, this would come from an API)
const sampleOrganizations = [
  "Google", "Microsoft", "Apple", "Amazon", "Facebook", "Netflix", "Tesla",
  "MIT", "Stanford University", "Harvard University", "UC Berkeley", "Oxford University", 
  "Cambridge University", "IIT Delhi", "IIT Bombay", "IIT Madras"
];

export default function StepTwo({ value, details, onChange, onDetailsChange }: StepTwoProps) {
  const [searchTerm, setSearchTerm] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 1) {
      const filteredSuggestions = sampleOrganizations.filter(org => 
        org.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filteredSuggestions.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleSelectSuggestion = (suggestion: string) => {
    setSearchTerm(suggestion);
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="organization" className="text-lg">
          Where are you currently studying or working?
        </Label>
        <div className="relative">
          <Input
            id="organization"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Type to search for your organization..."
            className="glass-input"
            onFocus={() => searchTerm.length > 1 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-md backdrop-blur-xl bg-black/70 border border-white/10 shadow-lg">
              <ul className="py-1 max-h-60 overflow-auto">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="px-4 py-2 hover:bg-white/10 cursor-pointer text-white"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="organization-details" className="text-sm text-white/70">
          Department, role, or other details (optional)
        </Label>
        <Textarea
          id="organization-details"
          placeholder="Add more details if you like..."
          className="glass-input min-h-24"
          value={details}
          onChange={(e) => onDetailsChange(e.target.value)}
        />
      </div>
    </div>
  );
}
