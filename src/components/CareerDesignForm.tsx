import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from 'react-router-dom';
import { RoadmapFormData } from '@/types/roadmap';
import { useGenerateRoadmap } from '@/hooks/use-generate-roadmap';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles } from 'lucide-react';

export default function CareerDesignForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { generateRoadmap, isGenerating } = useGenerateRoadmap();
  
  // Get career title from location state if available (from CareerMatchCard)
  const initialCareer = location.state?.careerTitle || '';
  
  const [formData, setFormData] = useState<RoadmapFormData>({
    role: initialCareer,
    studentType: 'student',
    learningPreference: 'text',
    knownSkills: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.role) {
      toast({
        title: "Error",
        description: "Please enter a career role",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const roadmap = await generateRoadmap(formData);
      
      if (roadmap) {
        toast({
          title: "Success!",
          description: "Your career roadmap has been created successfully."
        });
        navigate('/career-progress');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate roadmap. Please try again.",
        variant: "destructive"
      });
      console.error(error);
    }
  };
  
  return (
    <Card className="glass-morphism">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="role">Career Role</Label>
            <Input 
              id="role" 
              name="role" 
              placeholder="e.g., Frontend Developer, AI Engineer, Product Manager" 
              value={formData.role}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label>Current Status</Label>
            <RadioGroup 
              value={formData.studentType} 
              onValueChange={(value) => handleSelectChange('studentType', value)}
              className="flex flex-col space-y-2 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id="student" />
                <Label htmlFor="student" className="cursor-pointer">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="working" id="working" />
                <Label htmlFor="working" className="cursor-pointer">Working Professional</Label>
              </div>
            </RadioGroup>
          </div>
          
          {formData.studentType === 'student' && (
            <div>
              <Label htmlFor="collegeTier">College Type</Label>
              <Select 
                name="collegeTier"
                value={formData.collegeTier || ''}
                onValueChange={(value) => handleSelectChange('collegeTier', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your college type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tier1">Tier 1 (Top Institutes)</SelectItem>
                  <SelectItem value="tier2">Tier 2 (Mid-range Institutes)</SelectItem>
                  <SelectItem value="tier3">Tier 3 (Other Institutes)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div>
            <Label htmlFor="degree">Degree/Education</Label>
            <Input 
              id="degree" 
              name="degree" 
              placeholder="e.g., B.Tech, MBA, High School" 
              value={formData.degree || ''}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="knownSkills">Skills You Already Know</Label>
            <Textarea 
              id="knownSkills" 
              name="knownSkills" 
              placeholder="e.g., JavaScript, Python, Project Management (separate skills by comma)" 
              value={formData.knownSkills || ''}
              onChange={handleInputChange}
              className="mt-1"
              rows={3}
            />
          </div>
          
          <div>
            <Label>Learning Preference</Label>
            <RadioGroup 
              value={formData.learningPreference} 
              onValueChange={(value) => handleSelectChange('learningPreference', value)}
              className="flex space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="video" id="video" />
                <Label htmlFor="video" className="cursor-pointer">Video</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="text" id="text" />
                <Label htmlFor="text" className="cursor-pointer">Text</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="project" id="project" />
                <Label htmlFor="project" className="cursor-pointer">Project</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <Button type="submit" className="glowing-purple w-full" disabled={isGenerating}>
          <Sparkles className="mr-2 h-4 w-4" />
          {isGenerating ? 'Generating Roadmap...' : 'Generate Career Roadmap'}
        </Button>
      </form>
    </Card>
  );
}
