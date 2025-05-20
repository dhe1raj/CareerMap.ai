
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GeneratedRoadmap } from "@/components/career/CareerDesignWizard";
import CareerDesignWizard from "@/components/career/CareerDesignWizard";

interface CareerDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (roadmap: GeneratedRoadmap) => void;
}

export default function CareerDesignModal({ isOpen, onClose, onComplete }: CareerDesignModalProps) {
  const handleWizardComplete = (roadmap: GeneratedRoadmap) => {
    onComplete(roadmap);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
        <CareerDesignWizard 
          onComplete={handleWizardComplete}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
