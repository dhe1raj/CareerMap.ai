
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Check, X, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ProfileFooterProps {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

export default function ProfileFooter({ isEditing, setIsEditing }: ProfileFooterProps) {
  const handleDeleteAccount = () => {
    toast.error("This action cannot be undone. Account deletion coming soon.");
  };

  return (
    <>
      {isEditing ? (
        <div className="flex justify-end gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsEditing(false)}
          >
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
          <Button type="submit">
            <Check className="h-4 w-4 mr-1" /> Save Changes
          </Button>
        </div>
      ) : (
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setIsEditing(true)} 
          className="w-full md:w-auto"
        >
          <Edit className="h-4 w-4 mr-1" /> Edit Profile
        </Button>
      )}
      <div className="flex justify-between border-t border-white/10 pt-6 mt-6">
        <div className="text-xs text-white/40">
          All changes are automatically saved
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={handleDeleteAccount}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete Account
        </Button>
      </div>
    </>
  );
}
