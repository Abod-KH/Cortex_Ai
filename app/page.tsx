"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Paperclip, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SignInModal } from "@/components/sign-in-modal"
import { useAuth } from "@/context/auth-context"

/**
 * Home page component that displays the landing page
 * Allows users to enter prompts and sign in
 */
export default function Home() {
  const router = useRouter()
  const { user } = useAuth()
  const [inputValue, setInputValue] = useState("")
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showCursor, setShowCursor] = useState(true)
  const [showSignInPrompt, setShowSignInPrompt] = useState(false)

  // Suggestions for the user
  const suggestions = [
    { text: "Build a landing page for a SaaS product" },
    { text: "Create a simple to-do list app" },
    { text: "Generate a blog post about the benefits of React" },
    { text: "Develop an e-commerce store with Stripe integration" },
  ]

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    setIsTyping(true)

    // Show sign-in prompt if user is not logged in and starts typing
    if (!user && e.target.value.trim() && !showSignInPrompt) {
      setShowSignInPrompt(true)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      if (user) {
        // Redirect to new chat with prompt as URL parameter
        router.push(`/dashboard/new?prompt=${encodeURIComponent(inputValue.trim())}`)
      } else {
        setIsSignInModalOpen(true)
      }
    }
  }

  // Handle arrow button click
  const handleArrowClick = () => {
    if (inputValue.trim()) {
      if (user) {
        handleSubmit(new Event("submit") as any)
      } else {
        setIsSignInModalOpen(true)
      }
    } else if (user) {
      // If no input but user is logged in, go to dashboard
      router.push("/dashboard")
    } else {
      setIsSignInModalOpen(true)
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (text: string) => {
    setInputValue(text)

    // Show sign-in prompt if user is not logged in
    if (!user && !showSignInPrompt) {
      setShowSignInPrompt(true)
    }
  }

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4">
        <Link href="/">
          <div className="flex items-center">
            <span className="text-xl font-bold text-primary">Cortex</span>
            <span className="text-xl font-bold ml-1">AI</span>
          </div>
        </Link>
        <div className="flex items-center gap-2 md:gap-4">
          {!user ? (
            <>
              <Button variant="ghost" onClick={() => setIsSignInModalOpen(true)} className="hidden md:inline-flex">
                Sign In
              </Button>
              <Button onClick={() => setIsSignInModalOpen(true)}>
                <span className="hidden md:inline">Get Started</span>
                <span className="inline md:hidden">Sign In</span>
              </Button>
            </>
          ) : (
            <Button onClick={() => router.push("/dashboard")}>
              Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-3xl text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">What do you want to build?</h1>
          <p className="text-muted-foreground">Prompt, run, edit, and deploy full-stack web apps.</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-3xl mb-8">
          <div className="relative">
            <textarea
              value={inputValue}
              onChange={handleInputChange}
              placeholder="What you want to build?"
              className="w-full h-24 md:h-32 p-4 pr-12 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none text-left"
              style={{ caretColor: "currentColor", textAlign: "left" }}
            />
            {inputValue === "" && !isTyping && (
              <span className={`absolute left-4 top-4 ${showCursor ? "blinking-cursor" : "opacity-0"}`}></span>
            )}
            <div className="absolute right-4 bottom-4 flex items-center gap-2">
              <button type="button" className="text-muted-foreground hover:text-foreground">
                <Paperclip className="h-5 w-5" />
              </button>
              {inputValue.trim() && (
                <button
                  type="button"
                  onClick={handleArrowClick}
                  className="bg-primary hover:bg-primary/90 text-white p-2 rounded-md"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Sign-in prompt */}
          {showSignInPrompt && !user && (
            <div className="mt-2 text-center">
              <p className="text-sm text-primary">
                Sign in to save your prompt and get AI-generated code
                <Button variant="link" className="ml-2 p-0 h-auto text-sm" onClick={() => setIsSignInModalOpen(true)}>
                  Sign in now
                </Button>
              </p>
            </div>
          )}
        </form>

        {/* App Suggestions */}
        <div className="flex flex-wrap justify-center gap-2 max-w-3xl">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="px-4 py-2 bg-secondary/50 hover:bg-secondary text-sm rounded-full transition-colors"
              onClick={() => handleSuggestionClick(suggestion.text)}
            >
              {suggestion.text}
            </button>
          ))}
        </div>
      </main>

      {/* Sign In Modal */}
      <SignInModal isOpen={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)} prompt={inputValue} />
    </div>
  )
}
