
import React from "react";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Bell, Link, Calendar } from "lucide-react";
import { format } from "date-fns";
import { UseFormReturn } from "react-hook-form";

interface AccountSettingsProps {
  form: UseFormReturn<any>;
  isEditing: boolean;
  creationDate: Date;
}

export default function AccountSettings({ form, isEditing, creationDate }: AccountSettingsProps) {
  return (
    <div className="space-y-4 pt-4 border-t border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-white/70" />
          <span className="text-white/80 text-sm font-medium">Email Notifications</span>
        </div>
        <FormField
          control={form.control}
          name="enableNotifications"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={!isEditing}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link className="h-4 w-4 text-white/70" />
          <span className="text-white/80 text-sm font-medium">Public Profile</span>
        </div>
        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={!isEditing}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="flex items-center gap-2 text-white/60 text-xs">
        <Calendar className="h-3 w-3" />
        <span>Account created on {format(creationDate, "MMMM d, yyyy")}</span>
      </div>
    </div>
  );
}
