"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Circle, Database, Sparkles } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUser } from "@clerk/nextjs"

interface Message {
  id: string;
  chat_id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  currentChatId: string | null;
  selectedView: string;
  onSendMessage: (message: string) => Promise<void>;
  isCollapsed: boolean;
}

const ChatInterface = ({ 
  messages, 
  isLoading, 
  currentChatId, 
  selectedView, 
  onSendMessage,
  isCollapsed
}: ChatInterfaceProps) => {
  const { user } = useUser()
  const [inputMessage, setInputMessage] = useState("")
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return
    await onSendMessage(inputMessage)
    setInputMessage("")
  }

  return (
    <div className="flex flex-1 relative">
      <div
        className={`flex-1 flex flex-col h-[calc(100vh-4rem)] transition-all duration-300 md:ml-64`}
      >
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-3xl mx-auto">
            {/* Welcome header */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Database className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome to AskDB</h1>
                <p className="text-lg text-muted-foreground max-w-md mb-6">
                  Talk to Your Data. Get Answers Instantly.
                </p>
                <div className="flex items-center justify-center text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 mr-2" />
                  <span>Ask me anything about your database</span>
                </div>
              </div>
            )}

            {/* Chat messages */}
            {messages.map((message) => (
              <div key={message.id} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
                <div
                  className={`inline-block p-3 rounded-lg max-w-[80%] ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left mb-4">
                <div className="inline-flex items-center space-x-1 p-3 rounded-lg bg-secondary">
                  <Circle className="h-2 w-2 animate-bounce" />
                  <Circle className="h-2 w-2 animate-bounce delay-150" />
                  <Circle className="h-2 w-2 animate-bounce delay-300" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </ScrollArea>

        {/* Input area - fixed at bottom */}
        <div className="p-4 bg-background">
          <div className="max-w-3xl mx-auto flex items-center gap-2 bg-background border rounded-lg p-2">
            <Input
              placeholder="Describe the data you want to query..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
              className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={!currentChatId || !selectedView || isLoading}
            />
            <Button 
              size="icon" 
              className="rounded-full" 
              onClick={handleSendMessage}
              disabled={!currentChatId || !selectedView || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface 