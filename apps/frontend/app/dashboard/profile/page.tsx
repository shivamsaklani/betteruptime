"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Camera, Save, Trash2, User, Lock } from "lucide-react";
import PageHeader from "@/components/custom/pageheader";

export default function ProfileSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    image: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: "Profile updated",
      description: "Your account information has been updated successfully.",
    });
  };

  const handleChangePassword = async () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast({ 
        title: "Error", 
        description: "All password fields are required.", 
        variant: "destructive" 
      });
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast({ 
        title: "Error", 
        description: "New passwords do not match.", 
        variant: "destructive" 
      });
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setFormData((prev) => ({ 
      ...prev, 
      currentPassword: "", 
      newPassword: "", 
      confirmPassword: "" 
    }));
    toast({ 
      title: "Password changed", 
      description: "Your password has been updated successfully." 
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  const handleImageRemove = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container max-w-4xl mx-auto px-4 py-12 space-y-8">
        <PageHeader
          title="Profile Settings" 
          subtitle="Manage your account details and preferences" 
        />

        {/* Profile Info Card */}
        <Card className="border-border/50 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your profile photo, name, and email address</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative group">
                <Avatar className="h-24 w-24 ring-4 ring-background shadow-md transition-transform duration-300 group-hover:scale-105">
                  <AvatarImage src={formData.image} alt="User avatar" />
                  <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary to-accent text-primary-foreground">
                    {getInitials(formData.name)}
                  </AvatarFallback>
                </Avatar>

                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-9 w-9 rounded-full p-0 shadow-md hover:shadow-lg transition-all duration-300"
                  onClick={() => document.getElementById("imageUpload")?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>

                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground">Profile Photo</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload a professional photo. Recommended size: 400x400px
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => document.getElementById("imageUpload")?.click()}
                    className="hover:bg-primary/5"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Upload new
                  </Button>
                  {formData.image && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={handleImageRemove}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Name Field */}
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email address"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleSaveProfile} 
                disabled={isLoading}
                className="shadow-md hover:shadow-lg transition-all duration-300"
              >
                {isLoading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card className="border-border/50 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Lock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="currentPassword" className="text-sm font-medium">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                placeholder="Enter your current password"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="newPassword" className="text-sm font-medium">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={(e) => handleInputChange("newPassword", e.target.value)}
                placeholder="Enter your new password"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters with a mix of letters and numbers
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                placeholder="Confirm your new password"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleChangePassword} 
                disabled={isLoading}
                className="shadow-md hover:shadow-lg transition-all duration-300"
              >
                {isLoading ? (
                  "Updating..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Change Password
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
