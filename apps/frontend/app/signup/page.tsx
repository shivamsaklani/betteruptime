import { SignUpForm } from "@/components/auth/signup-form"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start monitoring your websites today"
      linkText="Already have an account? Sign in"
      linkHref="/signin"
    >
      <SignUpForm />
    </AuthLayout>
  )
}
