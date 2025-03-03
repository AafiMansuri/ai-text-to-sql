"use client"
import React from "react"
import ThemeToggle from "./theme-toggle"
import { UserMenu } from "./user-menu"
import DatabaseSelector from "./database-selector"

export const Navbar = () => {
    return (
        <header className=" sticky top-0 z-10 bg-background ">
          <div className="w-full max-w-screen-xl mx-auto flex items-center h-16 px-4">
            {/* Left side - Database Selector */}
            <div className="flex-1">
              <DatabaseSelector />
            </div>
    
            {/* Center - Title */}
            <div className="flex-1 flex justify-center">
              <h1 className="text-2xl font-bold">Velora</h1>
            </div>
    
            {/* Right side - Theme Toggle and User Menu */}
            <div className="flex-1 flex items-center justify-end gap-2">
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </header>
      )
}
