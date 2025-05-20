import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayoutEnhanced from "@/components/DashboardLayoutEnhanced";
import { useAuth } from "@/context/AuthContext";
import { useUserData } from "@/hooks/use-user-data"; 
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Key, Upload, Info, Trash2 } from "lucide-react";

// Role options for dropdown
const roleOptions = [
  { label: "Student", value: "student" },
  { label: "Working Professional", value: "professional" },
  { label: "Job Seeker", value: "job_seeker" },
  { label: "Entrepreneur", value: "entrepreneur" },
  { label: "Other", value: "other" }
];

// Interest options for multi-select
const interestOptions = [
  { label: "AI & Machine Learning", value: "ai_ml" },
  { label: "Web Development", value: "web_dev" },
  { label: "Marketing", value: "marketing" },
  { label: "Design", value: "design" },
  { label: "Business", value: "business" },
  { label: "Data Science", value: "data_science" },
  { label: "Finance", value: "finance" },
  { label: "Healthcare", value: "healthcare" }
];

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userData, saveField } = useUserData();
  const { toast } = useToast();

  // Form state
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("student");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isPublicProfile, setIsPublicProfile] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFullName(userData.profile.fullName || "");
      // Simulate additional data that would come from a profiles table
      setUsername(user.email?.split('@')[0] || "");
      setBio("Tell us about yourself...");
    } else {
      navigate("/login");
    }
  }, [user, userData, navigate]);

  // Handle avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Show success toast
      toast({
        title: "Avatar uploaded",
        description: "Your profile picture has been updated.",
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app, we would save to a database
      saveField('profile.fullName', fullName);
      
      // Show success toast
      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "There was a problem updating your profile.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle interest toggle
  const toggleInterest = (value: string) => {
    setSelectedInterests(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  // Format date for account creation
  const formatDate = (date: Date | null): string => {
    if (!date) return "Unknown";
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  const accountCreatedDate = new Date(); // This would typically come from user data

  return (
    <DashboardLayoutEnhanced>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your profile details and preferences
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Profile Information Card */}
          <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12),0_0_15px_rgba(159,104,240,0.3)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={18} /> Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Upload Section */}
              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    {avatarPreview ? (
                      <AvatarImage src={avatarPreview} alt="User avatar" />
                    ) : (
                      <AvatarFallback className="bg-brand-400/30 text-white text-xl">
                        {fullName?.charAt(0) || user?.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <label 
                    htmlFor="avatar-upload" 
                    className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-brand-400 hover:bg-brand-500 text-white cursor-pointer transition-colors"
                  >
                    <Upload size={16} />
                    <input 
                      id="avatar-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleAvatarChange} 
                    />
                  </label>
                </div>
                <div className="flex-grow space-y-1.5">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="focus-visible:ring-brand-400/60"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="focus-visible:ring-brand-400/60"
                    placeholder="Choose a username"
                  />
                </div>
              </div>

              {/* Email (read-only) */}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Input
                    id="email"
                    value={user?.email || ""}
                    readOnly
                    className="bg-white/10 cursor-not-allowed"
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                </div>
              </div>

              {/* Password Change Button */}
              <div className="space-y-1.5">
                <Label>Password</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast({
                    title: "Password change",
                    description: "This feature is coming soon!"
                  })}
                >
                  <Key size={16} className="mr-2" /> Change Password
                </Button>
              </div>

              {/* Bio / About */}
              <div className="space-y-1.5">
                <Label htmlFor="bio">Bio / About</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="min-h-[100px] focus-visible:ring-brand-400/60"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Current Role */}
              <div className="space-y-1.5">
                <Label htmlFor="role">Current Role</Label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="flex h-10 w-full rounded-md bg-white/5 backdrop-blur-md border border-white/20 px-3 py-2 text-base text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white/40 focus-visible:outline-none focus-visible:border-brand-400/60 focus-visible:ring-1 focus-visible:ring-brand-400/30 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 shadow-sm"
                >
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Interests - Multi-select Tags */}
              <div className="space-y-1.5">
                <Label>Interests</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {interestOptions.map(interest => (
                    <button
                      type="button"
                      key={interest.value}
                      onClick={() => toggleInterest(interest.value)}
                      className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                        selectedInterests.includes(interest.value)
                          ? "bg-brand-400 text-white"
                          : "bg-white/10 hover:bg-white/20 text-white"
                      }`}
                    >
                      {interest.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles Section */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Public Profile</Label>
                    <p className="text-sm text-muted-foreground">Allow others to view your profile</p>
                  </div>
                  <Switch
                    checked={isPublicProfile}
                    onCheckedChange={setIsPublicProfile}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates and alerts via email</p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
              </div>

              {/* Account Creation Date */}
              <div className="pt-2 text-sm text-muted-foreground flex items-center gap-1.5">
                <Info size={14} />
                <span>Account created: {formatDate(accountCreatedDate)}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  type="submit" 
                  className="bg-brand-400 hover:bg-brand-500 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>
              </div>

              {/* Danger Zone */}
              <div className="pt-4">
                <Separator className="my-4" />
                <div className="flex flex-col items-start">
                  <p className="text-sm text-muted-foreground mb-2">Danger Zone</p>
                  <Button
                    type="button"
                    variant="destructive"
                    className="flex items-center gap-2"
                    onClick={() => toast({
                      title: "Are you sure?",
                      description: "This action cannot be undone.",
                      variant: "destructive"
                    })}
                  >
                    <Trash2 size={16} /> Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayoutEnhanced>
  );
}
