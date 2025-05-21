
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useUserData } from "@/hooks/use-user-data";
import { User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";

// Import our new components
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import PersonalInfoFields from "@/components/profile/PersonalInfoFields";
import InterestSelector from "@/components/profile/InterestSelector";
import AccountSettings from "@/components/profile/AccountSettings";
import ProfileFooter from "@/components/profile/ProfileFooter";

const profileSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  username: z.string().min(3, { message: "Username must be at least 3 characters." }).optional(),
  email: z.string().email({ message: "Please enter a valid email address." }),
  bio: z.string().max(300, { message: "Bio must not exceed 300 characters." }).optional(),
  user_role: z.string().optional(),
  interests: z.array(z.string()).optional(),
  isPublic: z.boolean().default(false),
  enableNotifications: z.boolean().default(true),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function AccountProfileForm() {
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
      username: userData.profile.username || "",
      bio: userData.profile.bio || "",
      user_role: userData.profile.user_role || "",
      interests: userData.profile.interests || [],
      isPublic: userData.profile.isPublic || false,
      enableNotifications: userData.profile.enableNotifications !== false,
    },
  });

  useEffect(() => {
    form.reset({
      fullName: userData.profile.fullName || "",
      email: userData.profile.email || "",
      username: userData.profile.username || "",
      bio: userData.profile.bio || "",
      user_role: userData.profile.user_role || "",
      interests: userData.profile.interests || [],
      isPublic: userData.profile.isPublic || false,
      enableNotifications: userData.profile.enableNotifications !== false,
    });
    
    if (userData.profile.interests?.length) {
      setSelectedInterests(userData.profile.interests);
    }
    
    if (userData.profile.avatarUrl) {
      setAvatarUrl(userData.profile.avatarUrl);
    }
  }, [userData, form]);

  async function onSubmit(data: ProfileFormValues) {
    try {
      // Update the form fields in Supabase through our hook
      await saveField("profile.fullName", data.fullName);
      
      if (data.username) {
        await saveField("profile.username", data.username);
      }
      
      if (data.bio) {
        await saveField("profile.bio", data.bio);
      }
      
      if (data.user_role) {
        await saveField("profile.user_role", data.user_role);
      }
      
      if (selectedInterests.length > 0) {
        await saveField("profile.interests", selectedInterests);
      }
      
      await saveField("profile.isPublic", data.isPublic);
      await saveField("profile.enableNotifications", data.enableNotifications);
      
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
              <ProfileAvatar 
                avatarUrl={avatarUrl} 
                fullName={userData.profile.fullName}
                isEditing={isEditing}
              />
              
              <div className="flex-1 space-y-4 w-full">
                <PersonalInfoFields 
                  form={form} 
                  isEditing={isEditing}
                />

                <InterestSelector
                  selectedInterests={selectedInterests}
                  toggleInterest={toggleInterest}
                  isEditing={isEditing}
                />
              </div>
            </div>

            <AccountSettings 
              form={form} 
              isEditing={isEditing} 
              creationDate={creationDate}
            />

            <ProfileFooter 
              isEditing={isEditing} 
              setIsEditing={setIsEditing}
            />
          </form>
        </Form>
      </CardContent>
      
      <CardFooter />
    </Card>
  );
}
