"use client"

import { useState } from "react"
import { MessageSquare, PanelLeftClose, PanelLeftOpen, Plus, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUser } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import DatabaseSelector from "./database-selector"

interface Chat {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface ChatSidebarProps {
  chats: any[]
  currentChatId: string | null
  onChatSelect: (chatId: string) => void
  onNewChat: () => void
  onViewChange?: (view: string) => void
  isCollapsed: boolean
  onToggleCollapse: (collapsed: boolean) => void
  views: string[]
}

const ChatSidebar = ({ 
  chats, 
  currentChatId, 
  onChatSelect, 
  onNewChat, 
  onViewChange,
  isCollapsed,
  onToggleCollapse,
  views 
}: ChatSidebarProps) => {
  const [selectedDatabase, setSelectedDatabase] = useState("StudentDB")
  const { user } = useUser()
  const userRole = user?.publicMetadata?.role as string || "User"

  // Handle database change
  const handleDatabaseChange = (newDatabase: string) => {
    setSelectedDatabase(newDatabase);
    if (onViewChange) {
      onViewChange(newDatabase);
    }
  };
  
  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => onToggleCollapse(true)}
        />
      )}

      {/* Fixed button to reopen sidebar */}
      {isCollapsed && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-20 left-4 z-50 md:hidden"
          onClick={() => onToggleCollapse(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </Button>
      )}
      
      <div className={cn(
        "flex flex-col h-full border-r bg-background transition-all duration-300 fixed md:relative z-50",
        isCollapsed ? "w-16" : "w-64",
        isCollapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0"
      )}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className={cn("font-semibold", isCollapsed && "hidden")}>Chats</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleCollapse(!isCollapsed)}
              className="h-8 w-8"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")}
              >
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {isCollapsed ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={onNewChat}
                className="h-8 w-8"
              >
                <Plus className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={onNewChat}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Chat
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {chats.map((chat) => (
            <Button
              key={chat.id}
              variant={currentChatId === chat.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start mb-1",
                isCollapsed && "justify-center px-2"
              )}
              onClick={() => onChatSelect(chat.id)}
            >
              {isCollapsed ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              ) : (
                chat.title
              )}
            </Button>
          ))}
        </div>

        <div className="p-4 border-t">
          {isCollapsed ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onToggleCollapse(false)}
            >
              <Database className="h-4 w-4" />
            </Button>
          ) : (
            <DatabaseSelector 
              views={views} 
              onChange={onViewChange} 
              userRole={userRole}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default ChatSidebar