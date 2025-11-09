"use client"
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Camera, Save, Trash2, User, Lock, AlertCircleIcon, UploadCloud } from "lucide-react";
import PageHeader from "@/components/custom/pageheader";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import axios from "axios";
import { updateuser } from "@/lib/features/auth/authSlice";
import { ChangePass } from "@/components/custom/changepass";
const image = "../../../public/profiles/IMG_0241.JPG"
export default function ProfileSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const dispatch = useAppDispatch();
  const imageupload = useRef<HTMLInputElement | null>(null);
  const user = useAppSelector((state) => state.auth.user);
  const [formData, setFormData] = useState({
    name: user?.name,
    email: user?.email,
    image: user?.profile,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {

    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please choose an image to upload.",
        variant: "destructive",

      });
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("profile", selectedFile);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKENDURL}/profile/imageupload`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      dispatch(updateuser({
        profile: response.data.fileLoc as string
      }));
      toast({
        title: "Profile updated",
        description: "Your account information has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Upload failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
      setSelectedFile(file);
    }
  };

  const handleImageRemove = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
    setSelectedFile(null);
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
                 {user?.profile +"Shivam"}
                <Avatar className="h-24 w-24 ring-4 ring-background shadow-md transition-transform duration-300 group-hover:scale-105">
                  <AvatarImage
                    src={user?.profile || formData.image}
                    alt="User avatar"
                  />
                  <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary to-accent text-primary-foreground">
                    {user?.profile ? getInitials(user.email) : "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-9 w-9 rounded-full p-0 shadow-md hover:shadow-lg transition-all duration-300"
                  onClick={() =>imageupload.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>

                <input
                  type="file"
                  ref={imageupload}
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
                    variant="default"
                    size="sm"
                    onClick={handleSaveProfile}
                  >
                    <UploadCloud />
                    Save
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
                value={user?.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
                <span className="font-sm text-sm text-secondary">can't be changed</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={user?.email}
                placeholder="Enter your email address" readOnly
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
          <ChangePass />
        </Card>

      </div>
    </div>
  );
}
