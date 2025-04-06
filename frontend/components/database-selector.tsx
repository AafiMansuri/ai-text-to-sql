"use client"
import React from 'react'
import { useState } from "react"
import { Database } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DatabaseSelectorProps {
  onChange?: (value: string) => void;
}

const DatabaseSelector = ({ onChange }: DatabaseSelectorProps) => {
    const [database, setDatabase] = useState("students_view")
    
    const handleValueChange = (value: string) => {
        setDatabase(value)
        onChange?.(value)
    }
    
    return (
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          <Select value={database} onValueChange={handleValueChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select database" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="students_view">StudentDB</SelectItem>
              <SelectItem value="restaurant_view">RestaurantDB</SelectItem>
              <SelectItem value="employee_view">EmployeeDB</SelectItem>
              <SelectItem value="library_view">LibraryDB</SelectItem>
              <SelectItem value="hospital_view">HospitalDB</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )
}

export default DatabaseSelector