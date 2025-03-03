"use client"
import React from 'react'
import { useState } from "react"
import { Database } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const DatabaseSelector = () => {
    const [database, setDatabase] = useState("student")
    
    return (
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          <Select value={database} onValueChange={setDatabase}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select database" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">StudentDB</SelectItem>
              <SelectItem value="restaurant">RestaurantDB</SelectItem>
              <SelectItem value="employee">EmployeeDB</SelectItem>
              <SelectItem value="library">LibraryDB</SelectItem>
              <SelectItem value="hospital">HospitalDB</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )
}

export default DatabaseSelector