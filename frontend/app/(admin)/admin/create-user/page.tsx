"use client"

import { useSignUp } from "@clerk/nextjs"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"


const CreateUser = () => {
  const { signUp } = useSignUp() // Clerk's SignUp API
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [verificationCode,setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [showOTPField, setShowOTPField] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "", 
    email: "",
    password: "",
    confirmPassword: "",
    role: "User",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleOTPChange = (value: string) => {
    setVerificationCode(value)
  }

  

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }))
  }

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!signUp) {
      console.error("signUp is undefined. Clerk may not be initialized properly.")
      setError("Sign-up is not available. Please try again later.")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match")
      return
    }

    setLoading(true)
    try {
      console.log("Attempting to create user...");
      await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        unsafeMetadata: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
        },
      });
      console.log("User creation attempt completed.");
      
      // Prepare email verification step
      await signUp.prepareEmailAddressVerification()
      setShowOTPField(true) // Show verification input
    } catch (err: any) {
      console.error("Error creating user:", err)

      let errorMessage = "Failed to create user"
      if (err.errors && err.errors.length > 0) {
        errorMessage = err.errors.map((e: any) => `${e.code}: ${e.message}`).join(", ")
      } else if (err.message) {
        errorMessage = err.message
      }
      setError(errorMessage)
    }
    setLoading(false)
  }

  const handleVerify = async () => {
    setError(null)
    setSuccess(null)

    if (!signUp) {
      console.error("signUp is undefined. Clerk may not be initialized properly.")
      setError("Verification is not available. Please try again later.")
      return
    }

    if (!verificationCode) {
      setError("Please enter the verification code")
      return
    }

    try {
      await signUp.attemptEmailAddressVerification({ code: verificationCode })

      setSuccess("User successfully verified and created!")
      setFormData({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "", role: "User" })
      setShowOTPField(false) // Hide verification step
    } catch (err: any) {
      console.error("Error verifying user:", err)

      let errorMessage = "Verification failed"
      if (err.errors && err.errors.length > 0) {
        errorMessage = err.errors.map((e: any) => `${e.code}: ${e.message}`).join(", ")
      } else if (err.message) {
        errorMessage = err.message
      }

      setError(errorMessage)
    }
  }

  const handleVerifyOTP = async () => {
    if (!signUp || !verificationCode) {
      setError("Invalid verification code.")
      return
    }

    setIsVerifying(true)
    setError(null)

    try {
      await signUp.attemptEmailAddressVerification({ code: verificationCode })
      setSuccess("Email verified successfully! You can now log in.")
    } catch (err: any) {
      setError("Incorrect verification code.")
    }
    setIsVerifying(false)
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-zinc-100 dark:bg-background">
      <div className="bg-background dark:bg-zinc-900 p-8 rounded-lg shadow-lg w-full max-w-lg">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          {showOTPField ? "Verify Email" : "Create New User"}
        </h2>        
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        {!showOTPField ? (
          // User creation form
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300 py-2">First Name</Label>
                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300 py-2">Last Name</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 py-2">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 py-2">Password</Label>
                <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300 py-2">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} required />
              </div>
            </div>

            <div>
              <Label htmlFor="role" className="text-gray-700 dark:text-gray-300 py-2">Role</Label>
              <Select onValueChange={handleRoleChange} defaultValue={formData.role}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? "Creating User..." : "Create User"}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <Label htmlFor="otp">Enter OTP</Label>
            <InputOTP maxLength={6} value={verificationCode} onChange={handleOTPChange}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <Button onClick={handleVerifyOTP} className="w-full mt-4" disabled={isVerifying}>
              {isVerifying ? "Verifying..." : "Verify"}
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}

export default CreateUser
