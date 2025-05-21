
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  fullName: string;
  isEditing: boolean;
}

export default function ProfileAvatar({ avatarUrl, fullName, isEditing }: ProfileAvatarProps) {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  const handleAvatarUpload = async () => {
    try {
      setIsUploading(true);
      toast.info("Avatar upload feature coming soon");
      setIsUploading(false);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 mb-4">
      <Avatar className="h-24 w-24 border-2 border-white/20">
        <AvatarImage src={avatarUrl || ""} />
        <AvatarFallback className="bg-brand-400/20 text-xl">
          {fullName?.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>
      <Button 
        type="button" 
        variant="outline" 
        size="sm"
        onClick={handleAvatarUpload}
        className="mt-2"
        disabled={isUploading || !isEditing}
      >
        {isUploading ? "Uploading..." : "Upload Photo"}
      </Button>
    </div>
  );
}
