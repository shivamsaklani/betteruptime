"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { loginStart, loginSuccess, loginFailure } from "@/lib/features/auth/authSlice"
import { Loader2 } from "lucide-react"
import {GitHub , GoogleIcon} from "@/components/ui/customIcons"
import axios, { isAxiosError } from "axios"

export function SignUpForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      dispatch(loginFailure("Passwords do not match"))
      return
    }

    if (!agreeToTerms) {
      dispatch(loginFailure("Please agree to the terms and conditions"))
      return
    }

    dispatch(loginStart())

    try {
      // Simulate API call
      const response= await axios.post(`${process.env.NEXT_PUBLIC_BACKENDURL}/user/signup`,{
        username:formData.name,
        password:formData.password,
        email:formData.email
      });
      // Mock successful signup
      if(response.status==200){
           dispatch(
        loginSuccess({
          id: response.data.id,
          email: formData.email,
          name: formData.name,
        }),
      );
      router.push("/signin")
      }
     
        
     
      
    } catch (err) {
      if(isAxiosError(err)){
        if(err.response){
          switch(err.response.status){
          case 401: dispatch(loginFailure("Bad Request! Please Enter Valid data")); return;
          case 409: dispatch(loginFailure("User Exist! Please Login")); return;
          default : dispatch(loginFailure("Please Try after some time we are facing issue")); return;
        }
        }
      }
      else { dispatch(loginFailure("Failed to create account. Please try again."))}
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
            className="mt-1"
            placeholder="Create a password"
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1"
            placeholder="Confirm your password"
          />
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="agree-terms"
            checked={agreeToTerms}
            onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
            className="mt-1"
          />
          <Label htmlFor="agree-terms" className="text-sm leading-5">
            I agree to the{" "}
            <a href="#" className="text-primary hover:text-primary/80">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:text-primary/80">
              Privacy Policy
            </a>
          </Label>
        </div>
      </div>

      {error && <div className="text-sm text-destructive p-3 rounded-md">{error}</div>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" type="button" disabled={isLoading}>
         <GoogleIcon/>
          Google
        </Button>
        <Button variant="outline" type="button" disabled={isLoading}>
          <GitHub/>
          GitHub
        </Button>
      </div>
    </form>
  )
}
