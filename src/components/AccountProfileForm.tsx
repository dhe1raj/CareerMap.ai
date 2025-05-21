
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { useUserData } from "@/hooks/use-user-data";
import { useToast } from "@/hooks/use-toast";
import { User, Edit, Lock, Trash2, Check, X, Bell, Link, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const roles = [
  "Student",
  "Entry-Level Professional",
  "Mid-Level Professional",
  "Senior-Level Professional",
  "Manager",
  "Director",
  "Executive",
  "Freelancer",
  "Entrepreneur",
  "Career Changer",
  "Other"
];

const interests = [
  "Technology",
  "Marketing",
  "Design",
  "Finance",
  "Healthcare",
  "Education",
  "Engineering",
  "Data Science",
  "AI",
  "Business",
  "Arts",
  "Legal"
];

const profileSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  username: z.string().min(3, { message: "Username must be at least 3 characters." }).optional(),
  email: z.string().email({ message: "Please enter a valid email address." }),
  bio: z.string().max(300, { message: "Bio must not exceed 300 characters." }).optional(),
  currentRole: z.string().optional(),
  interests: z.array(z.string()).optional(),
  isPublic: z.boolean().default(false),
  enableNotifications: z.boolean().default(true),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function AccountProfileForm() {
  const { toast } = useToast();
  const { userData, saveField } = useUserData();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  // Mock creation date for demo
  const creationDate = new Date(2023, 5, 15);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: userData.profile.fullName || "",
      email: userData.profile.email || "",
      username: "",
      bio: "",
      currentRole: "",
      interests: [],
      isPublic: false,
      enableNotifications: true,
    },
  });

  useEffect(() => {
    form.reset({
      fullName: userData.profile.fullName || "",
      email: userData.profile.email || "",
      username: "",
      bio: "",
      currentRole: "",
      interests: [],
      isPublic: false,
      enableNotifications: true,
    });
  }, [userData, form]);

  function onSubmit(data: ProfileFormValues) {
    try {
      // In a real app, we would update all fields in the profile
      // Here we just update the fullName as an example
      saveField("profile.fullName", data.fullName);
      
      // Show success toast
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  }

  // Toggle interest selection
  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  // Upload avatar handler - in a real app this would handle file uploads
  const handleAvatarUpload = () => {
    // Simulate file upload
    toast.info("Avatar upload feature coming soon");
  };

  // Handle password change - in a real app this would open a modal
  const handlePasswordChange = () => {
    toast.info("Password change feature coming soon");
  };

  // Delete account handler
  const handleDeleteAccount = () => {
    // In a real app, this would show a confirmation dialog
    toast.error("This action cannot be undone. Account deletion coming soon.");
  };

  return (
    <Card className="w-full max-w-3xl mx-auto backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
      <CardHeader>
        <CardTitle className="text-gradient flex items-center gap-2">
          <User className="h-5 w-5" />
          Account Details
        </CardTitle>
        <CardDescription>
          Manage your profile information and account preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex flex-col items-center gap-2 mb-4">
                <Avatar className="h-24 w-24 border-2 border-white/20">
                  <AvatarImage src={avatarUrl || ""} />
                  <AvatarFallback className="bg-brand-400/20 text-xl">
                    {userData.profile.fullName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleAvatarUpload}
                  className="mt-2"
                >
                  Upload Photo
                </Button>
              </div>
              
              <div className="flex-1 space-y-4 w-full">
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
                  name="currentRole"
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

                <div className="space-y-2">
                  <FormLabel className="text-white/80 font-medium">Interests</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {interests.map(interest => (
                      <Button
                        key={interest}
                        type="button"
                        variant={selectedInterests.includes(interest) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleInterest(interest)}
                        disabled={!isEditing}
                        className={selectedInterests.includes(interest) ? "opacity-100" : "opacity-70"}
                      >
                        {interest}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

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
          </form>
        </Form>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t border-white/10 pt-6">
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
      </CardFooter>
    </Card>
  );
}
