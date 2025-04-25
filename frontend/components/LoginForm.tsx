"use client"

import { useState } from "react"
import { useSignIn } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Factory } from "lucide-react"

const LoginForm = () => {



  const { isLoaded, signIn, setActive } = useSignIn()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const togglePasswordVisibility = () => {setShowPassword((prev) => !prev)}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return;
  
    setError(null)
    setIsSubmitting(true)
  
    try {
      const signInAttempt  = await signIn.create({
        identifier: email,
        password,
      })
  
      if (signInAttempt.status === "complete") {
        console.log("✅ Login successful!");
        await setActive({session:signInAttempt.createdSessionId})
        router.push("/chat")
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      setError(err.errors?.[0]?.message || "Failed to sign in")
    }
    finally {
      setIsSubmitting(false)
    }
  }
  
  

    return (
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-primary">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Please sign in to your account
            </p>
          </div>
          <form className="mt-8 space-y-6"  onSubmit={(e) => handleSubmit(e)}>
            <div className="space-y-4 rounded-md">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 focus:bg-transparent autofill:bg-transparent"
                  placeholder="johndoe@example.com"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">

                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text":"password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  placeholder="••••••••"
                  />
                  <Button
                    type="button"
                    className="absolute inset-y-0 right-0.5 flex items-center rounded-3xl bg-transparent hover:bg-transparent hover:cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                  {showPassword ? <EyeOff className="w-5 h-5 text-primary" /> : <Eye className="w-5 h-5 text-primary" />}
                  </Button>
                  </div>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
    
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
                  Forgot your password?
                </Link>
              </div>
            </div>
    
            <div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
            </div>
          </form>
        </div>
      )
    
}

export default LoginForm