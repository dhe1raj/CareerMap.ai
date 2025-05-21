import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "./ui/sheet";
import { useUserData, UserRoadmap } from "@/hooks/use-user-data";
import { RoadmapStep } from "@/data/roadmapTemplates";
import { useGeminiRoadmap, GeminiRoadmapStep } from "@/utils/gemini";
import { useGeminiContext } from "@/context/GeminiContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, ArrowRight, Edit, Save, RefreshCw, Check, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface CareerBuilderQuestion {
  id: string;
  question: string;
  type: 'select' | 'input' | 'textarea' | 'radio';
  options?: string[];
  placeholder?: string;
  required?: boolean;
  conditionalShow?: (answers: Record<string, any>) => boolean;
}

const questions: CareerBuilderQuestion[] = [
  {
    id: 'status',
    question: 'Are you a student or working professional?',
    type: 'select',
    options: ['Student', 'Working Professional', 'Recent Graduate', 'Career Changer'],
    required: true,
  },
  {
    id: 'institution',
    question: 'Which college/university are you from?',
    type: 'select',
    options: ['Tier 1 Institution', 'Tier 2 Institution', 'Tier 3 Institution', 'Ivy League', 'Non-target School', 'Other'],
    conditionalShow: (answers) => answers.status === 'Student' || answers.status === 'Recent Graduate',
  },
  {
    id: 'degree',
    question: 'Your degree and course?',
    type: 'input',
    placeholder: 'e.g., BTech CSE, BA Economics',
  },
  {
    id: 'skills',
    question: 'Tech stacks or skills you already know?',
    type: 'textarea',
    placeholder: 'e.g., Python, React, SQL, Data Analysis',
    required: true,
  },
  {
    id: 'dreamRoles',
    question: 'What are your dream job roles?',
    type: 'textarea',
    placeholder: 'e.g., ML Engineer, Cyber Analyst, Full Stack Developer',
    required: true,
  },
  {
    id: 'industries',
    question: 'Preferred domain or industries?',
    type: 'textarea',
    placeholder: 'e.g., Healthcare, Fintech, E-commerce',
  },
  {
    id: 'timeCommitment',
    question: 'Time you can invest weekly in learning?',
    type: 'select',
    options: ['1-5 hours', '5-10 hours', '10-15 hours', '15+ hours'],
    required: true,
  },
  {
    id: 'learningStyle',
    question: 'Do you prefer video, text, or project-based learning?',
    type: 'radio',
    options: ['Video courses', 'Text tutorials/documentation', 'Project-based learning', 'Mix of everything'],
    required: true,
  },
];

interface RoadmapSection {
  label: string;
  url?: string;
  completed?: boolean;
  step?: string;
}

interface ParsedRoadmap {
  resources: RoadmapSection[];
  timeline: RoadmapSection[];
  skills: RoadmapSection[];
  tools: RoadmapSection[];
}

interface CustomCareerBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  isDialog?: boolean; // True for Dialog, False for Sheet
}

export default function CustomCareerBuilder({ 
  isOpen, 
  onClose,
  isDialog = true 
}: CustomCareerBuilderProps) {
  const navigate = useNavigate();
  const { toast: useAppToast } = useToast();
  const { userData, saveField } = useUserData();
  const { apiKey } = useGeminiContext();
  const { personalizeRoadmap, isLoading: isGeminiLoading } = useGeminiRoadmap();
  const { user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmapGenerated, setRoadmapGenerated] = useState(false);
  const [parsedRoadmap, setParsedRoadmap] = useState<ParsedRoadmap>({
    resources: [],
    timeline: [],
    skills: [],
    tools: []
  });
  const [editMode, setEditMode] = useState(false);
  const [editedRoadmap, setEditedRoadmap] = useState<ParsedRoadmap | null>(null);
  
  const totalSteps = questions.filter(q => !q.conditionalShow || q.conditionalShow(answers)).length;
  
  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const renderQuestion = () => {
    const filteredQuestions = questions.filter(q => !q.conditionalShow || q.conditionalShow(answers));
    if (currentStep >= filteredQuestions.length) return null;
    
    const question = filteredQuestions[currentStep];
    
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-medium">{question.question}</h3>
        
        {question.type === 'select' && (
          <Select
            value={answers[question.id] || ''}
            onValueChange={(value) => handleAnswer(question.id, value)}
          >
            <SelectTrigger className="glass-input">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        {question.type === 'input' && (
          <Input
            className="glass-input"
            placeholder={question.placeholder}
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
          />
        )}
        
        {question.type === 'textarea' && (
          <Textarea
            className="glass-input min-h-[100px]"
            placeholder={question.placeholder}
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
          />
        )}
        
        {question.type === 'radio' && (
          <RadioGroup
            value={answers[question.id] || ''}
            onValueChange={(value) => handleAnswer(question.id, value)}
            className="space-y-2"
          >
            {question.options?.map((option) => (
              <div key={option} className="flex items-center">
                <RadioGroupItem id={option} value={option} />
                <Label htmlFor={option} className="ml-2">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>
    );
  };
  
  const canProceed = () => {
    const filteredQuestions = questions.filter(q => !q.conditionalShow || q.conditionalShow(answers));
    if (currentStep >= filteredQuestions.length) return true;
    
    const question = filteredQuestions[currentStep];
    return !question.required || !!answers[question.id];
  };
  
  const handleNext = () => {
    const filteredQuestions = questions.filter(q => !q.conditionalShow || q.conditionalShow(answers));
    if (currentStep < filteredQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleGenerate();
    }
  };
  
  const handleBack = () => {
    if (roadmapGenerated) {
      setRoadmapGenerated(false);
      setEditMode(false);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const parseRoadmapData = (data: any): ParsedRoadmap => {
    // Default empty structure
    const roadmap: ParsedRoadmap = {
      resources: [],
      timeline: [],
      skills: [],
      tools: []
    };
    
    try {
      // Try to extract sections if they exist in the AI response
      if (data.resources && Array.isArray(data.resources)) {
        roadmap.resources = data.resources.map((item: any) => ({
          label: item.label || item.name || item,
          url: item.url || "",
          completed: false
        }));
      }
      
      if (data.timeline && Array.isArray(data.timeline)) {
        roadmap.timeline = data.timeline.map((item: any) => ({
          step: item.step || item.label || item,
          completed: false
        }));
      }
      
      if (data.skills && Array.isArray(data.skills)) {
        roadmap.skills = data.skills.map((item: any) => ({
          label: item.label || item.name || item,
          completed: false
        }));
      }
      
      if (data.tools && Array.isArray(data.tools)) {
        roadmap.tools = data.tools.map((item: any) => ({
          label: item.label || item.name || item,
          completed: false
        }));
      }
    } catch (err) {
      console.error("Error parsing roadmap data:", err);
    }
    
    return roadmap;
  };
  
  const generateRoadmapPrompt = () => {
    return `Create a comprehensive career roadmap for a person with the following profile:
    
Status: ${answers.status || 'Not specified'}
Education: ${answers.institution || 'Not specified'}, ${answers.degree || 'Not specified'}
Current Skills: ${answers.skills || 'Not specified'}
Dream Roles: ${answers.dreamRoles || 'Not specified'}
Preferred Industries: ${answers.industries || 'Not specified'}
Weekly Learning Time: ${answers.timeCommitment || 'Not specified'}
Learning Style Preference: ${answers.learningStyle || 'Not specified'}

Structure the response as a JSON object with these exact keys:
{
  "resources": [
    {"label": "Resource name", "url": "URL to resource"}
  ],
  "timeline": [
    {"step": "Month 1: What to learn"}
  ],
  "skills": [
    {"label": "Skill name"}
  ],
  "tools": [
    {"label": "Tool name"}
  ]
}

Return ONLY valid JSON without any explanation, formatting, or markdown.`;
  };
  
  const handleGenerate = async () => {
    if (!apiKey) {
      useAppToast({
        title: "API Key Required",
        description: "Please add a Gemini API key in settings to use this feature.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Generate prompt for roadmap creation
      const prompt = generateRoadmapPrompt();
      
      // Call Gemini API
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2, // Lower temperature for more structured output
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 2048,
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error("Invalid response format from Gemini API");
      }
      
      const responseText = data.candidates[0].content.parts[0].text;
      
      // Try to parse JSON from the response
      try {
        // Extract JSON from the response (in case there's any surrounding text)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("No JSON found in the response");
        }
        
        const jsonData = JSON.parse(jsonMatch[0]);
        const parsed = parseRoadmapData(jsonData);
        setParsedRoadmap(parsed);
        setEditedRoadmap(JSON.parse(JSON.stringify(parsed))); // Deep copy for editing
        setRoadmapGenerated(true);
        
        toast.success("Roadmap generated successfully!");
      } catch (parseError) {
        console.error("Error parsing Gemini response:", parseError, responseText);
        toast.error("Failed to parse AI response. Please try regenerating.");
      }
    } catch (error) {
      console.error("Error generating roadmap:", error);
      useAppToast({
        title: "Generation Failed",
        description: "There was an error creating your custom roadmap. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleEditToggle = () => {
    if (editMode) {
      // Save changes
      setParsedRoadmap(editedRoadmap);
      setEditMode(false);
      toast.success("Edits saved!");
    } else {
      // Enter edit mode
      setEditMode(true);
    }
  };
  
  const handleSaveAndTrack = async () => {
    try {
      // Convert parsed roadmap sections into steps format
      const steps: RoadmapStep[] = [];
      let order = 1;
      
      // Add timeline steps first
      parsedRoadmap.timeline.forEach(item => {
        steps.push({
          order: order++,
          label: item.step,
          estTime: "Varies",
          completed: false
        });
      });
      
      // Add resources as steps
      parsedRoadmap.resources.forEach(item => {
        steps.push({
          order: order++,
          label: `${item.label}${item.url ? ` (${item.url})` : ''}`,
          estTime: "Varies",
          completed: false
        });
      });
      
      // Add skills to master
      if (parsedRoadmap.skills.length > 0) {
        steps.push({
          order: order++,
          label: "Skills to master: " + parsedRoadmap.skills.map(s => s.label).join(", "),
          estTime: "Ongoing",
          completed: false
        });
      }
      
      // Add tools to learn
      if (parsedRoadmap.tools.length > 0) {
        steps.push({
          order: order++,
          label: "Tools to learn: " + parsedRoadmap.tools.map(t => t.label).join(", "),
          estTime: "Ongoing",
          completed: false
        });
      }
      
      // Generate a unique ID for the roadmap
      const roadmapId = crypto.randomUUID();
      
      // Create a new user roadmap
      const newRoadmap: UserRoadmap = {
        id: roadmapId,
        title: `Custom Career: ${answers.dreamRoles || "My Path"}`,
        steps,
        lastUpdated: new Date().toISOString()
      };
      
      // Save to Supabase if the user is logged in
      if (user) {
        // First save the main roadmap
        const { data: roadmapData, error: roadmapError } = await supabase
          .from('user_roadmaps')
          .insert({
            id: roadmapId,
            user_id: user.id,
            title: `Custom Career: ${answers.dreamRoles || "My Path"}`,
            category: answers.industries || "Custom",
            is_custom: true,
            updated_at: new Date().toISOString()
          })
          .select();
        
        if (roadmapError) {
          throw new Error(`Failed to create roadmap: ${roadmapError.message}`);
        }
        
        // Insert all the roadmap steps
        const stepsToInsert = steps.map((step) => ({
          roadmap_id: roadmapId,
          label: step.label,
          order_number: step.order,
          est_time: step.estTime,
          completed: false
        }));
        
        const { error: stepsError } = await supabase
          .from('user_roadmap_steps')
          .insert(stepsToInsert);
          
        if (stepsError) {
          throw new Error(`Failed to create roadmap steps: ${stepsError.message}`);
        }
        
        // Save detailed roadmap components separately
        // Resources
        if (parsedRoadmap.resources.length > 0) {
          const { error: resourcesError } = await supabase
            .from('roadmap_resources')
            .insert(parsedRoadmap.resources.map(resource => ({
              roadmap_id: roadmapId,
              label: resource.label,
              url: resource.url || null,
              completed: false
            })));
            
          if (resourcesError) {
            console.error("Error saving resources:", resourcesError);
          }
        }
        
        // Skills
        if (parsedRoadmap.skills.length > 0) {
          const { error: skillsError } = await supabase
            .from('roadmap_skills')
            .insert(parsedRoadmap.skills.map(skill => ({
              roadmap_id: roadmapId,
              label: skill.label,
              completed: false
            })));
            
          if (skillsError) {
            console.error("Error saving skills:", skillsError);
          }
        }
        
        // Timeline
        if (parsedRoadmap.timeline.length > 0) {
          const { error: timelineError } = await supabase
            .from('roadmap_timeline')
            .insert(parsedRoadmap.timeline.map((item, index) => ({
              roadmap_id: roadmapId,
              step: item.step,
              order_number: index + 1,
              completed: false
            })));
            
          if (timelineError) {
            console.error("Error saving timeline:", timelineError);
          }
        }
        
        // Tools
        if (parsedRoadmap.tools.length > 0) {
          const { error: toolsError } = await supabase
            .from('roadmap_tools')
            .insert(parsedRoadmap.tools.map(tool => ({
              roadmap_id: roadmapId,
              label: tool.label,
              completed: false
            })));
            
          if (toolsError) {
            console.error("Error saving tools:", toolsError);
          }
        }
        
        toast.success("Roadmap saved successfully! You can now track your progress.");
      }
      
      // Save to local storage
      await saveField("userRoadmap", newRoadmap);
      
      // Update user roadmaps array in localStorage
      const storedData = localStorage.getItem('userData') || '{}';
      const parsedData = JSON.parse(storedData);
      
      if (!parsedData.userRoadmaps) {
        parsedData.userRoadmaps = [];
      }
      
      parsedData.userRoadmaps.push(newRoadmap);
      localStorage.setItem('userData', JSON.stringify(parsedData));
      
      // Close modal and redirect
      onClose();
      navigate("/career-progress");
    } catch (error) {
      console.error("Error saving roadmap:", error);
      toast.error("Failed to save roadmap. Please try again.");
    }
  };
  
  const handleInputChange = (section: keyof ParsedRoadmap, index: number, key: string, value: string) => {
    if (!editedRoadmap) return;
    
    setEditedRoadmap(prev => {
      if (!prev) return null;
      
      const newData = { ...prev };
      const newSection = [...newData[section]];
      newSection[index] = { ...newSection[index], [key]: value };
      newData[section] = newSection;
      
      return newData;
    });
  };
  
  const renderRoadmap = () => {
    const data = editMode ? editedRoadmap : parsedRoadmap;
    if (!data) return null;
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gradient">Your AI-Generated Career Roadmap</h2>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleEditToggle}
              className="flex items-center gap-1"
            >
              {editMode ? (
                <>
                  <Save className="w-4 h-4" /> Save Edits
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" /> Edit
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" /> Regenerate
            </Button>
          </div>
        </div>
        
        {/* Resources Section */}
        <Collapsible className="w-full">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-purple-400">Resources</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-2">
            {data.resources.length > 0 ? (
              <ul className="space-y-2 pl-2">
                {data.resources.map((resource, index) => (
                  <li key={`resource-${index}`} className="bg-white/5 p-2 rounded-md">
                    {editMode ? (
                      <div className="space-y-2">
                        <Input
                          value={editedRoadmap?.resources[index].label || ''}
                          onChange={(e) => handleInputChange('resources', index, 'label', e.target.value)}
                          className="glass-input"
                          placeholder="Resource name"
                        />
                        <Input
                          value={editedRoadmap?.resources[index].url || ''}
                          onChange={(e) => handleInputChange('resources', index, 'url', e.target.value)}
                          className="glass-input"
                          placeholder="URL"
                        />
                      </div>
                    ) : (
                      <div>
                        <span className="font-medium">{resource.label}</span>
                        {resource.url && (
                          <div className="text-sm text-blue-400 hover:text-blue-300 truncate">
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              {resource.url}
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white/60 italic">No resources generated</p>
            )}
          </CollapsibleContent>
        </Collapsible>
        
        {/* Timeline Section */}
        <Collapsible className="w-full">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-purple-400">Timeline</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-2">
            {data.timeline.length > 0 ? (
              <ul className="space-y-2 pl-2">
                {data.timeline.map((item, index) => (
                  <li key={`timeline-${index}`} className="bg-white/5 p-2 rounded-md">
                    {editMode ? (
                      <Input
                        value={editedRoadmap?.timeline[index].step || ''}
                        onChange={(e) => handleInputChange('timeline', index, 'step', e.target.value)}
                        className="glass-input"
                        placeholder="Timeline step"
                      />
                    ) : (
                      <span>{item.step}</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white/60 italic">No timeline generated</p>
            )}
          </CollapsibleContent>
        </Collapsible>
        
        {/* Skills Section */}
        <Collapsible className="w-full">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-purple-400">Skills</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-2">
            {data.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <div key={`skill-${index}`}>
                    {editMode ? (
                      <Input
                        value={editedRoadmap?.skills[index].label || ''}
                        onChange={(e) => handleInputChange('skills', index, 'label', e.target.value)}
                        className="glass-input w-full mb-2"
                        placeholder="Skill name"
                      />
                    ) : (
                      <Badge className="bg-purple-800/50 hover:bg-purple-700/60 text-white">
                        {skill.label}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/60 italic">No skills generated</p>
            )}
          </CollapsibleContent>
        </Collapsible>
        
        {/* Tools Section */}
        <Collapsible className="w-full">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-purple-400">Tools</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-2">
            {data.tools.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.tools.map((tool, index) => (
                  <div key={`tool-${index}`}>
                    {editMode ? (
                      <Input
                        value={editedRoadmap?.tools[index].label || ''}
                        onChange={(e) => handleInputChange('tools', index, 'label', e.target.value)}
                        className="glass-input w-full mb-2"
                        placeholder="Tool name"
                      />
                    ) : (
                      <Badge className="bg-blue-800/50 hover:bg-blue-700/60 text-white">
                        {tool.label}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/60 italic">No tools generated</p>
            )}
          </CollapsibleContent>
        </Collapsible>
        
        <div className="pt-4 flex justify-center">
          <Button
            onClick={handleSaveAndTrack}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 w-full max-w-sm"
          >
            <Check className="mr-2 h-4 w-4" />
            Save & Track My Progress
          </Button>
        </div>
      </div>
    );
  };
  
  const renderContent = () => {
    if (roadmapGenerated) {
      return renderRoadmap();
    }
    
    return (
      <>
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {totalSteps}
            </div>
            <div className="text-sm text-white/60">
              {Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-purple-300 h-2 rounded-full transition-all"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {renderQuestion()}
        
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 || isGenerating}
          >
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed() || isGenerating}
            className={`${currentStep === totalSteps - 1 ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600' : ''}`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : currentStep === totalSteps - 1 ? (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Roadmap
              </>
            ) : (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </>
    );
  };
  
  if (isDialog) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] glass-morphism border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl text-gradient">Design Your Own Career Role</DialogTitle>
            <DialogDescription>
              {!roadmapGenerated ? 
                "Answer a few questions and let AI create a personalized career roadmap just for you." :
                "Review your custom roadmap and save it to start tracking your progress."
              }
            </DialogDescription>
          </DialogHeader>
          
          {renderContent()}
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="glass-morphism border-l border-white/10 w-[600px] max-w-full">
          <SheetHeader>
            <SheetTitle className="text-2xl text-gradient">Design Your Own Career Role</SheetTitle>
            <SheetDescription>
              {!roadmapGenerated ? 
                "Answer a few questions and let AI create a personalized career roadmap just for you." :
                "Review your custom roadmap and save it to start tracking your progress."
              }
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-6">
            {renderContent()}
          </div>
          
          <SheetFooter>
            {/* Footer controls are already in renderContent */}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }
}
