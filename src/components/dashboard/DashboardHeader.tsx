
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DashboardHeaderProps {
  fullName: string | undefined;
  email: string | undefined;
  onEditProfile: () => void;
}

export function DashboardHeader({ fullName, email, onEditProfile }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {fullName || email || 'User'}
        </p>
      </div>
      
      <Button onClick={onEditProfile} variant="outline">
        Edit Profile
      </Button>
    </div>
  );
}
