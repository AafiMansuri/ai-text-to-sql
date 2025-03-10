"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Circle, Database, Sparkles } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import ChatSidebar from "@/components/chat-sidebar"


// Mock function to simulate AI response
const getAIResponse = async (message: string): Promise<string> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return `Here's a SQL query for "${message}": SELECT * FROM table WHERE condition;`
}


const ChatInterface = () => {

  const [messages, setMessages] = useState<Array<{ type: "user" | "ai"; content: string }>>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return

    setMessages((prev) => [...prev, { type: "user", content: inputMessage }])
    setInputMessage("")
    setIsLoading(true)

    try {
      const aiResponse = await getAIResponse(inputMessage)
      setMessages((prev) => [...prev, { type: "ai", content: aiResponse }])
    } catch (error) {
      console.error("Error getting AI response:", error)
      setMessages((prev) => [...prev, { type: "ai", content: "Sorry, I couldn't process your request." }])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
<div className="flex flex-1 relative">

        <ChatSidebar onToggle={setSidebarOpen} />

        <div
          className={`flex-1 flex flex-col h-[calc(100vh-4rem)] transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-12"}`}
        >
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-3xl mx-auto">

              {/* Welcome header */}
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="bg-primary/10 p-3 rounded-full mb-4">
                    <Database className="h-10 w-10 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome to ChatQL</h1>
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
              {messages.map((message, index) => (
                <div key={index} className={`mb-4 ${message.type === "user" ? "text-right" : "text-left"}`}>
                  <div
                    className={`inline-block p-3 rounded-lg max-w-[80%] ${
                      message.type === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"
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
          <div className=" p-4 bg-background">
            <div className="max-w-3xl mx-auto flex items-center gap-2 bg-background border rounded-lg p-2">
              <Input
                placeholder="Describe the data you want to query..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyUp={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button size="icon" className="rounded-full" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default ChatInterface