"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Spinner } from "@/components/spinner"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

export default function NewChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading } = useAuth()
  const createChat = useMutation(api.chats.createChat)
  const createMessage = useMutation(api.messages.createMessage)
  const [isProcessing, setIsProcessing] = useState(false)

  // Get prompt from URL if it exists
  const promptFromUrl = searchParams?.get("prompt") || ""

  useEffect(() => {
    const createNewChat = async () => {
      if (!isLoading && !user) {
        router.push("/")
        return
      }

      if (isLoading || isProcessing || !user) return

      try {
        setIsProcessing(true)

        // Create a new chat
        const chatId = await createChat({
          userId: user.id,
          title: promptFromUrl ? promptFromUrl.substring(0, 50) : "New Chat",
        })

        // If there's a prompt from the URL, add it as a message
        if (promptFromUrl) {
          // Add user message
          await createMessage({
            chatId,
            userId: user.id,
            role: "user",
            content: promptFromUrl,
          })

          // Call the API to get a response from Gemini
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: [{ role: "user", content: promptFromUrl }],
            }),
          })

          if (response.ok) {
            const aiResponse = await response.json()

            // Add AI response to the database
            await createMessage({
              chatId,
              userId: user.id,
              role: "assistant",
              content: aiResponse.content,
              code: aiResponse.code,
              language: aiResponse.language,
            })
          }
        }

        // Navigate to the chat
        router.push(`/dashboard/chat/${chatId}`)
      } catch (error) {
        console.error("Error creating chat:", error)
        setIsProcessing(false)
      }
    }

    createNewChat()
  }, [isLoading, user, router, createChat, createMessage, promptFromUrl, isProcessing])

  return (
    <div className="h-full flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}
