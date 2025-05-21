
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, ExternalLink, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { Roadmap, RoadmapSection } from '@/types/roadmap';

interface RoadmapTreeProps {
  roadmap: Roadmap;
  onItemClick?: (itemId: string, completed: boolean) => void;
  readonly?: boolean;
}

export function RoadmapTree({ roadmap, onItemClick, readonly = false }: RoadmapTreeProps) {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>(
    roadmap.sections.reduce((acc, section) => {
      acc[section.title] = section.collapsed !== true; // Default to expanded unless specified
      return acc;
    }, {} as { [key: string]: boolean })
  );

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const handleItemCheck = (itemId: string | undefined, completed: boolean) => {
    if (itemId && onItemClick) {
      onItemClick(itemId, !completed);
    }
  };

  return (
    <div className="roadmap-tree w-full">
      {roadmap.sections.map((section, sectionIndex) => (
        <div key={`section-${sectionIndex}`} className="mb-6">
          <div 
            className="flex items-center cursor-pointer p-3 rounded-lg bg-background/60 backdrop-blur-sm border border-purple-800/30 shadow-sm hover:border-purple-500/50 transition-all"
            onClick={() => toggleSection(section.title)}
          >
            {expandedSections[section.title] ? 
              <ChevronDown className="h-5 w-5 mr-2 text-purple-500" /> : 
              <ChevronRight className="h-5 w-5 mr-2 text-purple-500" />
            }
            <h3 className="text-lg font-semibold">{section.title}</h3>
          </div>
          
          {expandedSections[section.title] && (
            <div className="mt-2 pl-5 border-l-2 border-purple-500/30">
              {section.items.map((item, itemIndex) => (
                <div 
                  key={`item-${sectionIndex}-${itemIndex}`}
                  className={cn(
                    "flex items-start gap-3 p-3 my-2 rounded-lg transition-all relative",
                    item.completed 
                      ? "bg-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.3)]" 
                      : "bg-background/60 border border-purple-800/20",
                    !readonly && "hover:border-purple-500/40 cursor-pointer"
                  )}
                  onClick={() => !readonly && handleItemCheck(item.id, !!item.completed)}
                >
                  {!readonly && (
                    <input 
                      type="checkbox"
                      checked={!!item.completed}
                      onChange={() => handleItemCheck(item.id, !!item.completed)}
                      className="mt-1"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                  
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    
                    <div className="flex items-center text-xs text-muted-foreground mt-1 gap-3">
                      {item.tooltip && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="flex items-center cursor-help">
                                <HelpCircle className="h-3 w-3 mr-1" />
                                <span>Hint</span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[300px] p-3">
                              <p>{item.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      
                      {item.link && (
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-purple-500 hover:text-purple-400 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          <span>Resource</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
