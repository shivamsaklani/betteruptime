"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Camera,
  Save,
  Trash2,
  User,
  Lock,
  Upload,
} from "lucide-react";
import PageHeader from "@/components/custom/pageheader";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import axios from "axios";
import { updateuser } from "@/lib/features/auth/authSlice";
import { ChangePass } from "@/components/custom/changepass";

export default function ProfileSettings() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    image: user?.profile ?? "",
  });

  const getdetails = async () => {
    try {
      const detail = await axios.get(`${process.env.NEXT_PUBLIC_BACKENDURL}/profile/getdetails`, {
        withCredentials: true
      });
      if (detail.status == 200) {
        dispatch(updateuser({
          name: detail.data.name,
          profile: detail.data.profileImage,
          email: detail.data.email,
        }));
      }
    } catch (error) {

    }
  }
  // Sync form with user changes
  useEffect(() => {
    if (user) {
      getdetails();
      setFormData({
        name: user.name ?? "",
        email: user.email ?? "",
        image: user.profile ?? "",
      });
    }
  }, [dispatch,setFormData]);

  // Check if profile has changes
  const hasProfileChanges =
    formData.name.trim() !== (user?.name ?? "") ||
    selectedFile !== null;

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .trim()
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please select a valid image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be under 5MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // Upload profile image
  const handleImageUpload = async () => {
    if (!selectedFile) return;

    setIsImageUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("profile", selectedFile);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDURL}/profile/imageupload`,
        uploadFormData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const newImageUrl = response.data.fileLoc;
      dispatch(updateuser({ profile: newImageUrl }));
      setFormData((prev) => ({ ...prev, image: newImageUrl }));
      toast({
        title: "Success",
        description: "Profile picture updated successfully.",
      });

      // Update preview and reset
      setPreviewUrl(null);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
       window.location.reload();
    } catch (error: any) {
      console.error("Image upload failed:", error);
      toast({
        title: "Upload failed",
        description:
          error.response?.data?.message || "Failed to upload image.",
        variant: "destructive",
      });
    } finally {
      setIsImageUploading(false);
    }
  };

  // Remove image
  const handleImageRemove = async () => {
    dispatch(updateuser({ profile: "" }));
    setSelectedFile(null);
    setPreviewUrl(null);

        if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Delete Image from Database
  const DeleteImage = async () => {
  
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKENDURL}/profile/deleteprofile`,{}, {
        withCredentials: true
      });
      if (response.status == 200) {
        toast({
          title: "Profile Deleted"
        });
          setFormData((prev) => ({ ...prev, image: "" }));
    dispatch(updateuser({ profile: "" }));
    setSelectedFile(null);

      }
    } catch (error: any) {
      console.error("Image upload failed:", error);
      toast({
        title: "Failed to Delete",
        description:
          error.response?.data?.message || "Try again",
        variant: "destructive",
      });
    } finally {
      setIsImageUploading(false);
    }
  }

  // Save profile (name only)
  const handleSaveProfile = async () => {
    if (!hasProfileChanges) return;

    setIsProfileSaving(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDURL}/profile/changedetails`,
        { name: formData.name.trim() },
        { withCredentials: true }
      );

      dispatch(updateuser({ name: formData.name.trim() }));
      toast({
        title: "Profile updated",
        description: "Your name has been saved.",
      });
    } catch (error: any) {
      console.error("Profile update failed:", error);
      toast({
        title: "Update failed",
        description: error.response?.data?.message || "Could not save changes.",
        variant: "destructive",
      });
    } finally {
      setIsProfileSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container max-w-4xl mx-auto px-4 py-12 space-y-8">
        <PageHeader
          title="Profile Settings"
          subtitle="Manage your account details and preferences"
        />

        {/* Personal Information Card */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your name and profile photo
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative group">
                <Avatar className="h-24 w-24 ring-4 ring-background shadow-md transition-transform group-hover:scale-105">

                  <AvatarImage
                    src={previewUrl || formData.image || user?.profile}
                    alt="Profile"
                  />
                  <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                    {user?.profile ? user.profile : getInitials(formData.name || user?.email || "U")}
                  </AvatarFallback>
                </Avatar>

                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-9 w-9 rounded-full p-0 shadow-md"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isImageUploading}
                >
                  <Camera className="h-4 w-4" />
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground">Profile Photo</h3>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG or GIF. Max size: 5MB. Recommended: 400×400px
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedFile && (
                    <>
                      <Button
                        size="sm"
                        onClick={handleImageUpload}
                        disabled={isImageUploading}
                      >
                        {isImageUploading ? (
                          <>Uploading...</>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-1" />
                            Upload
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleImageRemove}
                        disabled={isImageUploading}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </>
                  )}
                  {!selectedFile || formData.image && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={DeleteImage}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter your full name"
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Email Field (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address
                <span className="ml-2 text-xs text-muted-foreground">
                  (cannot be changed)
                </span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                readOnly
                disabled
                className="bg-muted/50"
              />
            </div>

            {/* Save Profile Button */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSaveProfile}
                disabled={!hasProfileChanges || isProfileSaving}
                className="shadow-md hover:shadow-lg transition-all"
              >
                {isProfileSaving ? (
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

        {/* Security Settings Card */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Lock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Change your password and manage account security
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChangePass />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}