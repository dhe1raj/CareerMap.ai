
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGemini } from '@/context/GeminiContext';

interface RoadmapPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (roadmap: any) => void;
}

const RoadmapPickerModal: React.FC<RoadmapPickerModalProps> = ({
  open,
  onClose,
  onSelect
}) => {
  const { apiKey } = useGemini();
  const [isLoading, setIsLoading] = useState(false);

  // Sample roadmap templates (to be replaced with actual data)
  const templates = [
    { id: 'frontend', name: 'Frontend Developer Roadmap' },
    { id: 'backend', name: 'Backend Developer Roadmap' },
    { id: 'fullstack', name: 'Fullstack Developer Roadmap' }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose a Roadmap</DialogTitle>
          <DialogDescription>
            Select a pre-made template or create a custom roadmap
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {templates.map((template) => (
            <Button
              key={template.id}
              variant="outline"
              className="justify-start"
              onClick={() => onSelect(template)}
            >
              {template.name}
            </Button>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button 
            onClick={() => onSelect({ id: 'custom', name: 'Custom Roadmap' })}
            disabled={!apiKey || isLoading}
          >
            Create Custom
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoadmapPickerModal;
