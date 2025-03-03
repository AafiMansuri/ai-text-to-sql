"use client"
import React from 'react'
import type { LucideIcon } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface SuggestionCardProps {
    title: string
    query: string
    icon: string
  }

export const SuggestionCard = ({ title, query, icon }: SuggestionCardProps) => {
    const IconComponent = LucideIcons[icon as keyof typeof LucideIcons] as LucideIcon

    return (
      <Card
        className="cursor-pointer hover:bg-accent transition-colors duration-200"
        onClick={() => console.log(`Selected query: ${query}`)}
      >
        <CardContent className="flex items-center gap-3 p-4">
          <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
            {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-medium truncate">{title}</h3>
            <p className="text-sm text-muted-foreground truncate">{query}</p>
          </div>
        </CardContent>
      </Card>
    )
}
