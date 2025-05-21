
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface CareerMatch {
  role: string;
  short_desc: string;
  icon?: string;
  match_pct: number;
  bullets: string[];
}

interface CareerMatchCardProps {
  match: CareerMatch;
}

export const CareerMatchCard: React.FC<CareerMatchCardProps> = ({ match }) => {
  const navigate = useNavigate();
  
  const handleCreateRoadmap = () => {
    // Navigate to career designer with pre-filled data
    navigate('/career-designer', { 
      state: { 
        careerTitle: match.role 
      } 
    });
  };
  
  return (
    <Card className="glass-morphism">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{match.role}</CardTitle>
          <div className="text-xl font-bold bg-purple-500/30 text-purple-100 px-2 py-1 rounded">
            {match.match_pct}%
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <p className="text-muted-foreground text-sm mb-3">{match.short_desc}</p>
        
        <ul className="space-y-1 text-sm">
          {match.bullets.map((bullet, index) => (
            <li key={index} className="flex items-start">
              <span className="text-purple-400 mr-2">•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between">
        <Button variant="outline" size="sm" onClick={handleCreateRoadmap}>
          Create Roadmap
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <a href={`https://www.google.com/search?q=${encodeURIComponent(match.role)}+career+information`} target="_blank" rel="noopener noreferrer">
            Learn More
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};
