"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Navbar } from "@/components/navbar"
import ChatInterface from "@/components/chat-interface"
import ChatSidebar from "@/components/chat-sidebar"

interface Message {
  id: string;
  chat_id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
}

interface Chat {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
}

export default function ChatPage() {
  const { user } = useUser()
  const [chats, setChats] = useState<Chat[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [selectedView, setSelectedView] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    if (user?.id) {
      loadChats()
    }
  }, [user?.id])

  const loadChats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/chats?user_id=${user!.id}`)
      if (!response.ok) throw new Error('Failed to fetch chats')
      const data = await response.json()
      setChats(data)
    } catch (error) {
      console.error("Error loading chats:", error)
    }
  }

  const loadChat = async (chatId: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/chats/${chatId}`)
      if (!response.ok) throw new Error('Failed to fetch chat')
      const data = await response.json()
      setMessages(data.messages)
      setCurrentChatId(chatId)
      if (!selectedView) {
        setSelectedView("students_view")
      }
    } catch (error) {
      console.error("Error loading chat:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewChat = async () => {
    if (!user?.id) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: "New Chat",
          user_id: user.id
        })
      })
      if (!response.ok) throw new Error('Failed to create chat')
      const newChat = await response.json()
      setChats(prev => [newChat, ...prev])
      setCurrentChatId(newChat.id)
      setMessages([])
    } catch (error) {
      console.error("Error creating new chat:", error)
    }
  }

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !currentChatId || !user?.id) return

    try {
      setIsLoading(true)
      // Add user message immediately
      const userMessage: Message = {
        id: Date.now().toString(),
        chat_id: currentChatId,
        content: message,
        role: 'user',
        created_at: new Date().toISOString()
      }
      setMessages(prev => [...prev, userMessage])

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/chats/${currentChatId}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: message,
          view_name: selectedView
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to process query')
      }
      
      const data = await response.json()
      setMessages(prev => [...prev, data])
    } catch (error) {
      console.error("Error processing query:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <ChatSidebar
          chats={chats}
          currentChatId={currentChatId}
          onChatSelect={loadChat}
          onNewChat={handleNewChat}
          onViewChange={setSelectedView}
          isCollapsed={isCollapsed}
          onToggleCollapse={setIsCollapsed}
        />
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          currentChatId={currentChatId}
          selectedView={selectedView}
          onSendMessage={handleSendMessage}
          isCollapsed={isCollapsed}
        />
      </div>
    </div>
  )
}