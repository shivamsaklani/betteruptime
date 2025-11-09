"use client"
import { Save } from "lucide-react";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

export const ChangePass = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Handle input updates
  function handleInputChange(field: string, value: string) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // Simulate password change logic
  async function handleChangePassword() {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast({title:"Please fill out all fields",variant:"destructive"});
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({title:"New password and confirmation do not match!",variant: "destructive"});
      return;
    }

    setIsLoading(true);

    // Simulate async action
  try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKENDURL}/profile/changepassword`,{
          user:{
              oldpassword:formData.currentPassword,
              newpassword:formData.newPassword,
              confirmpassword:formData.confirmPassword,
          }
      },{
          withCredentials:true
      });
      toast({title:"Password updated successfully!"});
       setIsLoading(false);
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  } catch (error) {
     toast({title:"Password Not updated"});
     setIsLoading(false);
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  }
  }

  return (
    <CardContent className="space-y-6">
      {/* Current Password */}
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

      {/* New Password */}
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

      {/* Confirm Password */}
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

      {/* Submit Button */}
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
  );
};
