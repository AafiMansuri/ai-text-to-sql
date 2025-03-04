"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CreateUser = () => {
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

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match")
      return
    }
    console.log("Form submitted:", formData)
    // send data
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Create New User</h2>
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

          <Button type="submit" className="w-full mt-4">Create User</Button>
        </form>
      </div>
    </main>
  )
}

export default CreateUser
