
import React from "react";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";

const interests = [
  "Technology", "Marketing", "Design", "Finance", "Healthcare", 
  "Education", "Engineering", "Data Science", "AI", "Business", 
  "Arts", "Legal"
];

interface InterestSelectorProps {
  selectedInterests: string[];
  toggleInterest: (interest: string) => void;
  isEditing: boolean;
}

export default function InterestSelector({ 
  selectedInterests, 
  toggleInterest, 
  isEditing 
}: InterestSelectorProps) {
  return (
    <div className="space-y-2">
      <FormLabel className="text-white/80 font-medium">Interests</FormLabel>
      <div className="flex flex-wrap gap-2">
        {interests.map(interest => (
          <Button
            key={interest}
            type="button"
            variant={selectedInterests.includes(interest) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleInterest(interest)}
            disabled={!isEditing}
            className={selectedInterests.includes(interest) ? "opacity-100" : "opacity-70"}
          >
            {interest}
          </Button>
        ))}
      </div>
    </div>
  );
}
