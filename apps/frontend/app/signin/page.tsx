import { SignInForm } from "@/components/auth/signin-form"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function SignInPage() {
  const onSubmit =()=>{
    alert("SignIn");
  }
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your BetterUptime account"
      linkText="Don't have an account? Sign up"
      linkHref="/signup"
    >
      <SignInForm />
    </AuthLayout>
  )
}
