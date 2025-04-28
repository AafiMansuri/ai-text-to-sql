import React from 'react'
import LoginForm from "@/components/LoginForm"
import { Sparkles } from 'lucide-react'




const Login = () => {

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">

      <main className="flex-grow flex flex-col md:flex-row">  
        {/* Left side */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-zinc-950">
          <LoginForm />
        </div>

        {/* Right side */}
        <div className="w-full md:w-1/2 bg-gray-100 dark:bg-zinc-950 flex flex-col items-center justify-center p-8">
          <h1 className="text-4xl md:text-6xl font-bold text-center text-primary mb-8 leading-tight">
          AI-based Text-to-SQL Generator
          </h1>
          <div className="flex items-center justify-center text-xl text-muted-foreground">
                    <Sparkles className="h-4 w-4 mr-2" />
                    <span>Talk to Your Data. Get Answers Instantly.</span>
                  </div>
        </div>
      </main>
    </div>
  )
}

export default Login  