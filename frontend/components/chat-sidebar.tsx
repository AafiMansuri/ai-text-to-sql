"use client"

import { useState } from "react"
import { MessageSquare, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ChatHistoryItem {
  id: string
  title: string
  date: string
}

interface ChatSidebarProps {
  onToggle?: (isOpen: boolean) => void
}
const ChatSidebar = ({ onToggle }: ChatSidebarProps) => {

  const [isOpen, setIsOpen] = useState(true)

  // Mock chat history data
  const chatHistory: ChatHistoryItem[] = [
    { id: "1", title: "Student grades query", date: "Today" },
    { id: "2", title: "Course enrollment stats", date: "Yesterday" },
    { id: "3", title: "Department performance", date: "2 days ago" },
    { id: "4", title: "Faculty information", date: "3 days ago" },
    { id: "5", title: "Scholarship recipients", date: "1 week ago" },
  ]

  const toggleSidebar = () => {
    const newState = !isOpen
    setIsOpen(newState)
    if (onToggle) {
      onToggle(newState)
    }
  }
  
  return (
    <div
      className={`h-[calc(100vh-4rem)] fixed top-16 left-0 z-30 transition-all duration-300 ${isOpen ? "w-64" : "w-12"}`}
    >
      <div className="border-t h-full flex flex-col bg-background border-r">
        {/* Toggle button */}
        <Button variant="ghost" size="icon" className="absolute right-2 top-4" onClick={toggleSidebar}>
          {isOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </Button>

        {/* Sidebar content - only visible when open */}
        {isOpen && (
          <>
            <div className="p-4 pt-12 border-b">
              <h2 className="font-semibold">Chat History</h2>
            </div>
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-2">
                {chatHistory.map((chat) => (
                  <Button key={chat.id} variant="ghost" className="w-full justify-start text-left h-auto py-2">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <div className="flex flex-col items-start">
                      <span className="truncate w-44">{chat.title}</span>
                      <span className="text-xs text-muted-foreground">{chat.date}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </div>
    </div>
  )
}

export default ChatSidebar