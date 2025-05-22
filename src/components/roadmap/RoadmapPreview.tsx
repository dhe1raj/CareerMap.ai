
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Roadmap } from '@/types/roadmap';
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RoadmapPreviewProps {
  roadmap: Roadmap;
  onSave: (updatedRoadmap: Roadmap) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function RoadmapPreview({ roadmap, onSave, onCancel, isLoading = false }: RoadmapPreviewProps) {
  const [editableRoadmap, setEditableRoadmap] = useState<Roadmap>({ ...roadmap });
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>(
    roadmap.sections.reduce((acc, section) => {
      acc[section.title] = true;
      return acc;
    }, {} as { [key: string]: boolean })
  );

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const updateRoadmapTitle = (title: string) => {
    setEditableRoadmap(prev => ({ ...prev, title }));
  };

  const updateSectionTitle = (index: number, title: string) => {
    const updatedSections = [...editableRoadmap.sections];
    updatedSections[index] = { ...updatedSections[index], title };
    setEditableRoadmap(prev => ({ ...prev, sections: updatedSections }));
  };

  const updateItemLabel = (sectionIndex: number, itemIndex: number, label: string) => {
    const updatedSections = [...editableRoadmap.sections];
    updatedSections[sectionIndex].items[itemIndex] = { 
      ...updatedSections[sectionIndex].items[itemIndex], 
      label 
    };
    setEditableRoadmap(prev => ({ ...prev, sections: updatedSections }));
  };

  const updateItemTooltip = (sectionIndex: number, itemIndex: number, tooltip: string) => {
    const updatedSections = [...editableRoadmap.sections];
    updatedSections[sectionIndex].items[itemIndex] = { 
      ...updatedSections[sectionIndex].items[itemIndex], 
      tooltip 
    };
    setEditableRoadmap(prev => ({ ...prev, sections: updatedSections }));
  };

  const updateItemLink = (sectionIndex: number, itemIndex: number, link: string) => {
    const updatedSections = [...editableRoadmap.sections];
    updatedSections[sectionIndex].items[itemIndex] = { 
      ...updatedSections[sectionIndex].items[itemIndex], 
      link 
    };
    setEditableRoadmap(prev => ({ ...prev, sections: updatedSections }));
  };

  const removeItem = (sectionIndex: number, itemIndex: number) => {
    const updatedSections = [...editableRoadmap.sections];
    updatedSections[sectionIndex].items.splice(itemIndex, 1);
    setEditableRoadmap(prev => ({ ...prev, sections: updatedSections }));
  };

  const removeSection = (sectionIndex: number) => {
    const updatedSections = [...editableRoadmap.sections];
    updatedSections.splice(sectionIndex, 1);
    setEditableRoadmap(prev => ({ ...prev, sections: updatedSections }));
  };

  return (
    <Card className="w-full glass-morphism">
      <CardHeader>
        <CardTitle>Preview Your Roadmap</CardTitle>
        <CardDescription>Review and edit before saving</CardDescription>
        <div className="mt-4">
          <Label htmlFor="roadmap-title">Roadmap Title</Label>
          <Input 
            id="roadmap-title"
            value={editableRoadmap.title} 
            onChange={(e) => updateRoadmapTitle(e.target.value)}
            className="mt-1"
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-5 max-h-[500px] overflow-y-auto">
        {editableRoadmap.sections.map((section, sectionIndex) => (
          <div key={`edit-section-${sectionIndex}`} className="border border-purple-500/20 rounded-lg">
            <div className="flex justify-between items-center p-3 bg-purple-500/10 rounded-t-lg">
              <div className="flex items-center flex-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => toggleSection(section.title)}
                  className="p-1 h-auto"
                >
                  {expandedSections[section.title] ? 
                    <ChevronDown className="h-5 w-5" /> : 
                    <ChevronRight className="h-5 w-5" />
                  }
                </Button>
                <Input 
                  value={section.title}
                  onChange={(e) => updateSectionTitle(sectionIndex, e.target.value)}
                  className="h-8 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => removeSection(sectionIndex)}
                className="text-red-500 hover:text-red-600 hover:bg-red-500/10 p-0 h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            {expandedSections[section.title] && (
              <div className="p-3 space-y-3">
                {section.items.map((item, itemIndex) => (
                  <div 
                    key={`edit-item-${sectionIndex}-${itemIndex}`}
                    className="border border-purple-500/10 rounded-md p-3 space-y-2 bg-background/60"
                  >
                    <div className="flex justify-between">
                      <Label htmlFor={`item-${sectionIndex}-${itemIndex}`}>Label</Label>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeItem(sectionIndex, itemIndex)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10 p-0 h-6 w-6"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <Input 
                      id={`item-${sectionIndex}-${itemIndex}`}
                      value={item.label}
                      onChange={(e) => updateItemLabel(sectionIndex, itemIndex, e.target.value)}
                      className="h-8"
                    />
                    
                    <div>
                      <Label htmlFor={`tooltip-${sectionIndex}-${itemIndex}`}>Tooltip</Label>
                      <Input 
                        id={`tooltip-${sectionIndex}-${itemIndex}`}
                        value={item.tooltip || ''}
                        onChange={(e) => updateItemTooltip(sectionIndex, itemIndex, e.target.value)}
                        className="h-8 mt-1"
                        placeholder="Helpful description or tip"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`link-${sectionIndex}-${itemIndex}`}>Resource Link</Label>
                      <Input 
                        id={`link-${sectionIndex}-${itemIndex}`}
                        value={item.link || ''}
                        onChange={(e) => updateItemLink(sectionIndex, itemIndex, e.target.value)}
                        className="h-8 mt-1"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
      
      <CardFooter className="flex justify-between space-x-2 border-t border-white/10 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          className="glowing-purple"
          onClick={() => onSave(editableRoadmap)}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save & Track This Roadmap'}
        </Button>
      </CardFooter>
    </Card>
  );
}
