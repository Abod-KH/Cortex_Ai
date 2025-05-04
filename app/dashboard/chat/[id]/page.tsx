"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Send, Copy, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/context/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Spinner } from "@/components/spinner"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileUpload } from "@/components/file-upload"
import { FileAttachment } from "@/components/file-attachment"
import { toast } from "@/components/ui/use-toast"

/**
 * Chat page component that displays a chat conversation with the AI
 * Allows users to send messages, upload files, and view AI responses
 */
export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [attachments, setAttachments] = useState<
    Array<{
      type: string
      name: string
      url: string
      contentType: string
      size: number
    }>
  >([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const chatId = params?.id as string

  // Fetch chat and messages from the database
  const chat = useQuery(api.chats.getChat, { id: chatId as Id<"chats"> })
  const messages = useQuery(api.messages.getChatMessages, { chatId: chatId as Id<"chats"> }) || []

  // Mutations
  const createMessage = useMutation(api.messages.createMessage)

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/")
    }
  }, [user, authLoading, router])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if ((!input.trim() && attachments.length === 0) || !user) return

    setIsLoading(true)
    setUploadError(null)

    try {
      // Add user message to the database
      await createMessage({
        chatId: chatId as Id<"chats">,
        userId: user.id,
        role: "user",
        content: input.trim() || "Sent attachments",
        attachments: attachments.length > 0 ? attachments : undefined,
      })

      setInput("")
      setAttachments([])

      // Prepare messages for the AI API
      const messageHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      // Add the current message
      const currentMessage = {
        role: "user" as const,
        content: input.trim() || "Sent attachments",
      }

      // If there are attachments, add them to the message
      const attachmentDescriptions = attachments.map(
        (attachment) => `[Attachment: ${attachment.name}, Type: ${attachment.type}, Size: ${attachment.size} bytes]`,
      )

      if (attachmentDescriptions.length > 0) {
        currentMessage.content += "\n\n" + attachmentDescriptions.join("\n")
      }

      // Call the API to get a response from Gemini
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messageHistory, currentMessage],
          attachments: attachments.map((attachment) => ({
            url: `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${attachment.url}`,
            type: attachment.contentType,
            name: attachment.name,
          })),
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to get AI response: ${errorText}`)
      }

      const aiResponse = await response.json()

      // Add AI response to the database
      await createMessage({
        chatId: chatId as Id<"chats">,
        userId: user.id,
        role: "assistant",
        content: aiResponse.content,
        code: aiResponse.code,
        language: aiResponse.language,
      })

      setIsLoading(false)
    } catch (error) {
      console.error("Error sending message:", error)
      setIsLoading(false)

      // Add error message
      await createMessage({
        chatId: chatId as Id<"chats">,
        userId: user.id,
        role: "assistant",
        content: "Sorry, I encountered an error while generating a response. Please try again.",
      })

      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Copy code to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Handle file upload
  const handleFileUpload = (file: {
    type: string
    name: string
    url: string
    contentType: string
    size: number
  }) => {
    setAttachments((prev) => [...prev, file])
    setUploadError(null)
    toast({
      title: "File uploaded",
      description: `${file.name} has been uploaded successfully.`,
    })
  }

  // Remove attachment
  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  // Show loading spinner while authentication is in progress
  if (authLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  // Don't render anything if user is not authenticated
  if (!user) {
    return null
  }

  return (
    <div className="h-full">
      <DashboardHeader />
      <DashboardSidebar />
      <main className="md:pl-64 pt-16 h-full">
        <div className="h-[calc(100vh-64px)] flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-2xl font-bold mb-2">Start a new conversation</h2>
                <p className="text-muted-foreground max-w-md">
                  Describe what you want to build, and I'll help you generate the code.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex gap-3 mb-4 p-4 rounded-lg ${
                    message.role === "user" ? "bg-muted/50" : "bg-background"
                  }`}
                >
                  {message.role === "user" ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.picture || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      AI
                    </div>
                  )}
                  <div className="flex flex-col flex-1">
                    <div className="text-sm font-medium mb-1">{message.role === "user" ? user.name : "Cortex AI"}</div>

                    {/* Display attachments if any */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mb-2">
                        {message.attachments.map((attachment, index) => (
                          <FileAttachment key={index} attachment={attachment} />
                        ))}
                      </div>
                    )}

                    <div className="text-sm">{message.content}</div>
                    {message.code && (
                      <div className="mt-3 relative">
                        <div className="bg-muted rounded-md p-3 overflow-x-auto">
                          <div className="flex justify-between items-center mb-2">
                            <div className="text-xs text-muted-foreground">{message.language || "code"}</div>
                            <Button variant="ghost" size="sm" onClick={() => handleCopy(message.code!)} className="h-6">
                              {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                              {copied ? "Copied" : "Copy"}
                            </Button>
                          </div>
                          <pre className="text-xs">
                            <code>{message.code}</code>
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Upload Error */}
          {uploadError && (
            <div className="px-4 py-2 bg-red-500/10 border border-red-500/50 text-red-500 flex items-center gap-2 mx-4 mb-2 rounded">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{uploadError}</span>
            </div>
          )}

          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <div className="border-t p-2">
              <div className="flex flex-wrap gap-2">
                {attachments.map((attachment, index) => (
                  <FileAttachment
                    key={index}
                    attachment={attachment}
                    onRemove={() => handleRemoveAttachment(index)}
                    showRemove={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Cortex AI to generate code or build an app..."
                  className="min-h-[60px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      if (input.trim() || attachments.length > 0) {
                        handleSubmit(e as any)
                      }
                    }
                  }}
                />
                <div className="flex flex-col gap-2">
                  <Button
                    type="submit"
                    disabled={isLoading || (!input.trim() && attachments.length === 0)}
                    className="self-end"
                  >
                    {isLoading ? <Spinner /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <FileUpload chatId={chatId} onFileUpload={handleFileUpload} />
                <div className="text-xs text-muted-foreground">
                  {attachments.length > 0 && `${attachments.length} attachment${attachments.length > 1 ? "s" : ""}`}
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
