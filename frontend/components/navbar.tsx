"use client"
import Link from "next/link"
import{ useState, useEffect } from "react"
import ThemeToggle from "./theme-toggle"
import { UserMenu } from "./user-menu"
import DatabaseSelector from "./database-selector"
import { Button } from "@/components/ui/button"
import { ShieldUser  } from "lucide-react" // Admin Icon (Can be changed)

export const Navbar = () => {

  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    // Fetch Role logic
    const userRole = "Admin"
    setRole(userRole)
  }, [])

    return (
        <header className=" sticky top-0 z-10 bg-background ">
          <div className="w-full mx-auto flex items-center h-16 px-4">
            <div className="flex-1">
              <DatabaseSelector />
            </div>
    
            <div className="flex-1 flex justify-center">
              <h1 className="text-2xl font-bold">Velora</h1>
            </div>
    
            <div className="flex-1 flex items-center justify-end gap-2">
              {role === "Admin" && (
              <Link href="/admin">
                <Button variant="ghost" size="icon" className="hover:bg-gray-200 dark:hover:bg-gray-700">
                  <ShieldUser  className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </Button>
              </Link>
            )}
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </header>
      )
}
