"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/spinner"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, MessageSquare, X, Trash2 } from "lucide-react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"

/**
 * Dashboard page component that displays a list of user's chats
 * Allows users to create new chats and delete existing ones
 */
export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null)

  // Fetch chats from the database
  const chats = useQuery(api.chats.getUserChats, user ? { userId: user.id } : "skip") || []
  const deleteChat = useMutation(api.chats.deleteChat)

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/")
    }
  }, [user, authLoading, router])

  // Handle chat deletion
  const handleDeleteChat = async () => {
    if (!deletingChatId) return

    try {
      await deleteChat({ id: deletingChatId as any })
      toast({
        title: "Chat deleted",
        description: "The chat has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting chat:", error)
      toast({
        title: "Error",
        description: "Failed to delete chat. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeletingChatId(null)
    }
  }

  // Format date for display
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString()
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
        <div className="p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl md:text-2xl font-bold">Your Chats</h1>
            <Button asChild>
              <Link href="/dashboard/new">
                <Plus className="mr-2 h-4 w-4" />
                New Chat
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chats.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No chats yet</h3>
                <p className="text-muted-foreground mb-4">Start a new chat to generate code for your projects.</p>
                <Button asChild>
                  <Link href="/dashboard/new">
                    <Plus className="mr-2 h-4 w-4" />
                    New Chat
                  </Link>
                </Button>
              </div>
            ) : (
              chats.map((chat) => (
                <div key={chat._id} className="relative group">
                  <Link href={`/dashboard/chat/${chat._id}`}>
                    <div className="border border-border rounded-lg p-4 hover:border-primary transition-colors">
                      <h3 className="font-medium mb-2 truncate pr-6">{chat.title}</h3>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>{formatDate(chat.createdAt)}</span>
                        <MessageSquare className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setDeletingChatId(chat._id)
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10"
                    aria-label="Delete chat"
                  >
                    <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <AlertDialog open={!!deletingChatId} onOpenChange={(open) => !open && setDeletingChatId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the chat and all its messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteChat}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
