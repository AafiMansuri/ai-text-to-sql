"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Navbar } from "@/components/navbar"
import ChatInterface from "@/components/chat-interface"
import ChatSidebar from "@/components/chat-sidebar"

type QueryResult = {
  columns: string[]
  rows: Record<string, string | number | null>[]
}

interface Message {
  id: string;
  chat_id: string;
  content: string;
  query_result?: QueryResult;
  role: 'user' | 'assistant';
  created_at: string;
}

interface Chat {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  messages: Message[] 
}

export default function ChatPage() {
  const { user } = useUser()
  const [chats, setChats] = useState<Chat[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [selectedView, setSelectedView] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [views, setViews] = useState<string[]>([]) // Store views here

  useEffect(() => {
    if (user?.id) {
      loadChats()
    }
    loadViews()
  }, [user?.id])

  const loadViews = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/database/views`)
      if (!response.ok) throw new Error('Failed to fetch views')
      const data = await response.json()
      const viewNames = data.map((view: { friendly_name: string }) => view.friendly_name) // Get only the friendly names
      setViews(viewNames)
    } catch (error) {
      console.error("Error loading views:", error)
    }
  }

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
      console.log("Assistant response from API:", data);

      const assistantMessage: Message = {
        id: Date.now().toString(),
        chat_id: currentChatId,
        content: data.message ?? `Here are the results based on your question.\n\nThe following SQL query was executed:\n\n\`${data.sql_query}\``,
        query_result: data.query_result ?? undefined,
        role: "assistant",
        created_at: new Date().toISOString()
      }
      console.log("Assistant message:", assistantMessage);
      
      setMessages(prev => [...prev, assistantMessage])

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
          views={views}
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