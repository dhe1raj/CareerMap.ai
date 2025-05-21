
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";

const roles = [
  "Student", "Entry-Level Professional", "Mid-Level Professional", 
  "Senior-Level Professional", "Manager", "Director", "Executive", 
  "Freelancer", "Entrepreneur", "Career Changer", "Other"
];

interface PersonalInfoFieldsProps {
  form: UseFormReturn<any>;
  isEditing: boolean;
}

export default function PersonalInfoFields({ form, isEditing }: PersonalInfoFieldsProps) {
  const handlePasswordChange = () => {
    toast.info("Password change feature coming soon");
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem className="group">
            <FormLabel className="text-white/80 font-medium group-focus-within:text-brand-400">Full Name</FormLabel>
            <FormControl>
              <Input 
                placeholder="Your full name" 
                {...field}
                className="glass-input focus-visible:border-[#9F68F0]/60 focus-visible:ring-[#9F68F0]/30"
                disabled={!isEditing}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem className="group">
            <FormLabel className="text-white/80 font-medium group-focus-within:text-brand-400">Username</FormLabel>
            <FormControl>
              <Input 
                placeholder="Choose a username" 
                {...field}
                className="glass-input focus-visible:border-[#9F68F0]/60 focus-visible:ring-[#9F68F0]/30"
                disabled={!isEditing}
                value={field.value || ""}
              />
            </FormControl>
            <FormDescription className="text-xs text-white/50">
              This will be your public username
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="group">
            <FormLabel className="text-white/80 font-medium group-focus-within:text-brand-400">Email</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                disabled 
                className="glass-input bg-white/10" 
              />
            </FormControl>
            <FormDescription className="text-xs text-white/50">
              Contact support to change your email address
            </FormDescription>
          </FormItem>
        )}
      />

      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-white/70" />
          <span className="text-white/80 text-sm font-medium">Password</span>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={handlePasswordChange}
          disabled={!isEditing}
        >
          Change Password
        </Button>
      </div>

      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem className="group">
            <FormLabel className="text-white/80 font-medium group-focus-within:text-brand-400">Bio / About</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Tell us about yourself" 
                {...field} 
                value={field.value || ""}
                className="glass-input focus-visible:border-[#9F68F0]/60 focus-visible:ring-[#9F68F0]/30 min-h-[100px]"
                disabled={!isEditing}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="user_role"
        render={({ field }) => (
          <FormItem className="group">
            <FormLabel className="text-white/80 font-medium group-focus-within:text-brand-400">Current Role</FormLabel>
            <FormControl>
              <select
                {...field}
                disabled={!isEditing}
                className="w-full h-10 rounded-md glass-input focus-visible:border-[#9F68F0]/60 focus-visible:ring-[#9F68F0]/30 px-3 py-2"
                value={field.value || ""}
              >
                <option value="" disabled>Select your current role</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
