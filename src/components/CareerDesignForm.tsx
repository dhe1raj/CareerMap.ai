
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRoadmaps } from "@/hooks/use-roadmaps";

const CareerDesignForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { createRoadmap } = useRoadmaps();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast({
        title: "Missing information",
        description: "Please provide a title for your roadmap",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const roadmap = {
        title,
        description,
        type: "role" as const,
        sections: [
          {
            title: "Getting Started",
            items: [
              {
                id: crypto.randomUUID(),
                label: "Define your career goals",
                tooltip: "Set clear objectives for your career path"
              },
              {
                id: crypto.randomUUID(),
                label: "Research the industry",
                tooltip: "Understand the landscape and requirements"
              }
            ]
          }
        ]
      };
      
      const result = await createRoadmap(roadmap);
      
      if (result?.id) {
        toast({
          title: "Success!",
          description: "Your career roadmap has been created",
        });
        navigate(`/roadmap/${result.id}`);
      }
    } catch (error) {
      console.error("Error creating roadmap:", error);
      toast({
        title: "Error",
        description: "Failed to create your roadmap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-morphism">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Career Path Title</Label>
          <Input
            id="title"
            placeholder="e.g., Front-end Developer Journey"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Describe your career goals and aspirations..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-32"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full glowing-purple" 
          disabled={isLoading}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {isLoading ? "Creating..." : "Design My Career Path"}
        </Button>
      </form>
    </Card>
  );
};

export default CareerDesignForm;
