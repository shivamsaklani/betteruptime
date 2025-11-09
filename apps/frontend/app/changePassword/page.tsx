"use client";

import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";

const ChangePassword = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState<number>(0); // seconds remaining
  const { toast } = useToast();

  // Handle input change
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  //  Countdown timer effect
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  //  Send OTP handler
  const sendOTP = async (event: FormEvent) => {
    event.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email before sending OTP.",
        variant: "destructive",
      });
      return;
    }

    // Prevent re-sending during cooldown
    if (cooldown > 0) {
      toast({
        title: "Please wait",
        description: `You can resend OTP after ${cooldown} seconds.`,
        variant: "default",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDURL}/website/sendOTP`,
        { email },
        { withCredentials: true }
      );

      if (response.data?.success) {
        toast({
          title: "OTP sent successfully",
          description: `An OTP has been sent to ${email}`,
        });
        setCooldown(30); // Start 30s cooldown
      } else {
        toast({
          title: "Failed to send OTP",
          description: response.data?.message || "Try again later.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Server error",
        description: error.response?.data?.message || "Unable to send OTP right now.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Forget Password" linkHref="/changePassword">
      <form onSubmit={sendOTP}>
        <CardContent className="space-y-10">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={handleChange}
              className="mt-1"
              placeholder="Enter your email"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || cooldown > 0}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending OTP...
              </>
            ) : cooldown > 0 ? (
              `Resend in ${cooldown}s`
            ) : (
              "Send OTP"
            )}
          </Button>
        </CardContent>
      </form>
    </AuthLayout>
  );
};

export default ChangePassword;
