"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import ThemeToggle from "./theme-toggle"
import { Button } from "@/components/ui/button"
import { ShieldUser } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { useUser } from "@clerk/nextjs"

interface NavbarProps {
  onViewChange?: (view: string) => void;
}

export const Navbar = ({ onViewChange }: NavbarProps) => {
  const [role, setRole] = useState<string | null>(null)
  const { user } = useUser()
  const userRole = user?.publicMetadata?.role

  return (
    <header className="border-b sticky top-0 z-10 bg-background">
    <div className="flex items-center justify-between h-16 px-6">
      {/* Left Side - Title */}
      <h1 className="text-xl font-bold tracking-tight">AskDB</h1>

      {/* Center - Navigation */}
      {(userRole === "Admin" || userRole === "Super Admin") && (
        <nav>
          <ul className="flex items-center space-x-6">
            <li>  
              <Link href="/chat">
                <Button variant="ghost">Chat</Button>
              </Link>
            </li>
            <li>
              <Link href="/admin">
                <Button variant="ghost">Manage Users</Button>
              </Link>
            </li>
            <li>
              <Link href="/admin/add-user">
                <Button variant="ghost">Add User</Button>
              </Link>
            </li>
          </ul>
        </nav>
      )}

      {/* Right Side - Theme Toggle & Logout */}
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <UserButton />
      </div>
    </div>
  </header>
  )
}
