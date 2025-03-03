import React from 'react'

import { SuggestionCard } from "@/components/suggestionCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

const ChatInterface = () => {
  return (
    <main className="flex flex-col container min-h-screen max-w-4xl mx-auto px-4 ">
    {/* Greeting */}
    <div className='py-30'>
      <div className="text-center mb-8">
        <p className="text-muted-foreground text-lg">What can I help with?</p>
      </div>

      {/* Suggestion Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <SuggestionCard
          title="Show all students"
          query="Show me all students with their grades"
          icon="GraduationCap"
        />
        <SuggestionCard title="Course enrollment" query="List all courses with student count" icon="BookOpen" />
        <SuggestionCard title="Department stats" query="Show departments with average grades" icon="BarChart" />
      </div>
    </div>
    {/* Chat History (placeholder) */}
    <div className="flex-1 space-y-4 mb-8">{/* Chat messages would go here */}</div>

    {/* Input Area */}
    <div className="sticky bottom-4 w-full bg-slate p-4">
      <div className="flex items-center gap-2 bg-background border rounded-lg p-2">
        <Input
          placeholder="Describe the data you want to query..."
          className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button size="icon" className="rounded-full">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </main>
  )
}

export default ChatInterface