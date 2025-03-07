import React from 'react'
import LoginForm from "@/components/LoginForm"



const Login = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">

      <main className="flex-grow flex flex-col md:flex-row">
        {/* Left side - Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-background">
          <LoginForm />
        </div>

        {/* Right side - Website Title and Logo */}
        <div className="w-full md:w-1/2 bg-gray-100 flex flex-col items-center justify-center p-8">
          <h1 className="text-4xl md:text-6xl font-bold text-center text-gray-800 mb-8 leading-tight">
            Velora
          </h1>
          <p className="text-xl md:text-2xl text-center text-gray-600 max-w-md leading-relaxed">
          Speak to your database like never before. Think. Ask. Discover.
          </p>
        </div>
      </main>
    </div>
  )
}

export default Login  