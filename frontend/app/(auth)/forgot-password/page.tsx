"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {  InputOTP,  InputOTPGroup, InputOTPSeparator,  InputOTPSlot} from "@/components/ui/input-otp"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import React, { useEffect, useState } from 'react'
import { useAuth, useSignIn } from '@clerk/nextjs'
import type { NextPage } from 'next'
import { useRouter } from 'next/navigation'


const ForgotPassword = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [code, setCode] = useState("")
  const [successfulCreation, setSuccessfulCreation] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()
  const { isSignedIn } = useAuth()
  const { isLoaded, signIn, setActive } = useSignIn()

  useEffect(() => {
    if (isSignedIn) {
      router.push("/chat")
    }
  }, [isSignedIn, router])

  if (!isLoaded) {
    return
  }

  const togglePasswordVisibility = () => {setShowPassword((prev) => !prev)}

  async function sendResetCode(e: React.FormEvent) {
    e.preventDefault()
    try {
      await signIn?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      })
      setSuccessfulCreation(true)
      setError("")
    } catch (err: any) {
      console.error("Error:", err.errors[0].longMessage)
      setError(err.errors[0].longMessage)
    }
  }

  async function resetPassword(e: React.FormEvent) {
    e.preventDefault()
    await signIn
      ?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      })
      .then((result) => {
       if (result.status === 'complete') {
          setActive({ session: result.createdSessionId })
          setError('')
        } else {
          console.log(result)
        }
      })
      .catch((err) => {
        console.error('error', err.errors[0].longMessage)
        setError(err.errors[0].longMessage)
      })
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            {!successfulCreation
              ? "Enter your email and we'll send you a reset code."
              :"Enter the reset code and set a new password."}
          </p>
        </div>

        {error && (
          <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
        )}

        <form className="mt-6 space-y-4" onSubmit={!successfulCreation ? sendResetCode : resetPassword}>
          {! successfulCreation ? (
            <>
              <div>
                <Label htmlFor="email" className="pb-3">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="doctor@example.com"
                />
              </div>
              <Button type="submit" className="w-full">
                Send Reset Code
              </Button>

              <div className="text-center mt-4">
            <Link
              href="/login"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </div>
            </>
          ) : (
            <>
             <div className="pb-2">
                <Label htmlFor="code" className="pb-3">Reset Code</Label>
                <InputOTP maxLength={6} value={code} onChange={setCode} pattern={"^[0-9]*$"}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <div>
                <Label htmlFor="password" className="pb-3">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your new password"
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
              <Button type="submit" className="w-full">
                Reset Password
              </Button>
            </>
          )}
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
