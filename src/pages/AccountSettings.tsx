
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import DashboardLayoutEnhanced from "@/components/DashboardLayoutEnhanced";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function AccountSettings() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || "",
    username: user?.user_metadata?.username || "",
    bio: user?.user_metadata?.bio || "",
    currentRole: user?.user_metadata?.role || "student",
    isPublic: user?.user_metadata?.isPublic || false,
    emailNotifications: user?.user_metadata?.emailNotifications || true
  });

  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    user?.user_metadata?.interests || []
  );

  const interestOptions = [
    "AI", "Marketing", "Design", "Development", "Data Science", 
    "Finance", "Healthcare", "Education", "Engineering"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, currentRole: value });
  };

  const addInterest = (interest: string) => {
    if (!selectedInterests.includes(interest)) {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const removeInterest = (interest: string) => {
    setSelectedInterests(selectedInterests.filter(item => item !== interest));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Here you would update the user profile in your database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <DashboardLayoutEnhanced>
      <div className="container max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
        <p className="text-white/70 mb-8">Manage your profile details and preferences</p>

        {/* Profile Information Card */}
        <Card className="mb-8 border-0 bg-white/10 backdrop-blur-lg text-white shadow-[0_0_15px_rgba(159,104,240,0.2)] rounded-[20px]">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription className="text-white/70">
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 pb-4">
              <Avatar className="h-24 w-24 border-2 border-purple-400">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt={formData.fullName} />
                <AvatarFallback className="text-lg bg-brand-900 text-white">
                  {formData.fullName.split(" ").map(n => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2 flex-grow">
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-purple-400/50 hover:bg-white/20"
                >
                  Upload New Picture
                </Button>
                <p className="text-xs text-white/50">
                  Recommended size: 400x400px. Max file size: 2MB.
                </p>
              </div>
            </div>

            <Separator className="bg-white/10" />
            
            {/* User Info Fields */}
            <div className="grid gap-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="bg-white/10 border-purple-400/30 focus-visible:border-purple-400 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="johndoe"
                    className="bg-white/10 border-purple-400/30 focus-visible:border-purple-400 text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  disabled
                  className="bg-white/10 border-purple-400/30 text-white/70"
                />
                <p className="text-xs text-white/50">Contact support to change your email address</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-white">Password</Label>
                </div>
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-purple-400/30 hover:bg-white/20 text-white w-full sm:w-auto"
                >
                  Change Password
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-white">Bio / About</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  className="bg-white/10 border-purple-400/30 focus-visible:border-purple-400 text-white h-24 resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentRole" className="text-white">Current Role</Label>
                <Select 
                  value={formData.currentRole}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger className="bg-white/10 border-purple-400/30 text-white">
                    <SelectValue placeholder="Select your current role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="professional">Working Professional</SelectItem>
                    <SelectItem value="jobseeker">Job Seeker</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label className="text-white">Interests</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedInterests.map((interest) => (
                    <Badge 
                      key={interest} 
                      className="bg-purple-400/20 text-purple-100 hover:bg-purple-400/30"
                    >
                      {interest}
                      <button onClick={() => removeInterest(interest)} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Select onValueChange={addInterest}>
                  <SelectTrigger className="bg-white/10 border-purple-400/30 text-white">
                    <SelectValue placeholder="Add interests" />
                  </SelectTrigger>
                  <SelectContent>
                    {interestOptions.map((interest) => (
                      <SelectItem key={interest} value={interest}>
                        {interest}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Separator className="bg-white/10" />
              
              {/* Account Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isPublic" className="text-white">Make Profile Public</Label>
                    <p className="text-xs text-white/50">Allow others to see your profile information</p>
                  </div>
                  <Switch
                    id="isPublic"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => handleSwitchChange('isPublic', checked)}
                    className="data-[state=checked]:bg-purple-400"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications" className="text-white">Email Notifications</Label>
                    <p className="text-xs text-white/50">Receive email notifications about your account</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={formData.emailNotifications}
                    onCheckedChange={(checked) => handleSwitchChange('emailNotifications', checked)}
                    className="data-[state=checked]:bg-purple-400"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleSave}
              disabled={isLoading}
              className="bg-purple-500 hover:bg-purple-600 text-white w-full sm:w-auto"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button 
              variant="outline" 
              className="bg-transparent border-purple-400/50 text-purple-300 hover:bg-white/10 w-full sm:w-auto"
            >
              Cancel
            </Button>
          </CardFooter>
        </Card>
        
        {/* Danger Zone */}
        <Card className="border-0 bg-white/5 backdrop-blur-md text-white shadow-[0_0_15px_rgba(239,68,68,0.2)] rounded-[20px]">
          <CardHeader>
            <CardTitle className="text-red-400">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/70 text-sm mb-4">
              Account created on {formatDate(user?.created_at)}
            </p>
            <Button 
              variant="destructive" 
              className="bg-red-800/50 hover:bg-red-800/80 text-white"
            >
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayoutEnhanced>
  );
}
