"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { loginStart, loginSuccess, loginFailure } from "@/lib/features/auth/authSlice"
import { Loader2 } from "lucide-react"
import axios, { isAxiosError } from "axios"
import {GoogleIcon, GitHub } from "@/components/ui/customIcons"
import { useToast } from "@/hooks/use-toast"
import { persistor } from "@/lib/store"

const Authorize =()=>{
  alert ("ok done");
}

export function SignInForm() {
  const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
    });
  const {toast} = useToast();

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
    dispatch(loginStart())

    try {
      // Simulate API call
      const login = await axios.post(`${process.env.NEXT_PUBLIC_BACKENDURL}/user/signin`,{
        email:formData.email,
        password:formData.password
      },{
        withCredentials:true
      });
      if(login.status==200){
        // Mock successful login
      dispatch(
        loginSuccess({
          id: login.data.id,
          email:formData.email,
          name: login.data.Username,
        }),
      );
      persistor.flush();
      toast({
        title:"Login Success"
      });
      
       router.push("/dashboard")
      }
      
    } catch (err) {
      if(isAxiosError(err)){
        if(err.response?.status){
          switch(err.response.status){
            case 400: dispatch(loginFailure(err.response.data));break;
            case 401: dispatch(loginFailure(err.response.data));break;
            case 404: dispatch(loginFailure(err.response.data));break;
            default : dispatch(loginFailure("Invalid email or password"))
          }
        }
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
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
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleChange}
            className="mt-1"
            placeholder="Enter your password"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Button variant="link" onClick={()=>router.push("/changePassword")} className="cursor-pointer text-primary">
              Forgot your password?
            </Button>
          </div>
        </div>
      </div>

      {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
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
        <Button variant="outline" onClick={()=>Authorize()} type="button" disabled={isLoading}>
         <GoogleIcon/>
          Google
        </Button>
        <Button variant="outline" onClick={()=>Authorize()} type="button" disabled={isLoading}>
         <GitHub/>
          GitHub
        </Button>
      </div>
    </form>
  )
}
