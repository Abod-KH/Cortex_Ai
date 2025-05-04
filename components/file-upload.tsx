"use client"

import type React from "react"

import { useState, useRef } from "react"
import { File, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Spinner } from "@/components/spinner"
import { useAuth } from "@/context/auth-context"

interface FileUploadProps {
  chatId: string
  onFileUpload: (file: {
    type: string
    name: string
    url: string
    contentType: string
    size: number
  }) => void
}

/**
 * File upload component that allows users to upload files and images
 * Uses Convex storage for file uploads
 */
export function FileUpload({ chatId, onFileUpload }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()

  // Convex mutations for file uploads
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const storeFileMetadata = useMutation(api.files.storeFileMetadata)

  /**
   * Handle file upload process
   * @param file The file to upload
   * @param type The type of file (file or image)
   */
  const handleFileUpload = async (file: File, type: "file" | "image") => {
    if (!file || !user) return

    try {
      setIsUploading(true)
      setUploadProgress(0)

      // Get a signed URL for upload
      const uploadUrl = await generateUploadUrl()

      // Upload the file using fetch
      const response = await fetch(uploadUrl, {
        method: "POST", // Use POST instead of PUT
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      })

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`)
      }

      // Extract the storage ID from the upload URL
      const storageId = uploadUrl.split("/").pop()

      // Store file metadata
      const fileId = await storeFileMetadata({
        userId: user.id,
        chatId: chatId as any,
        name: file.name,
        url: storageId!,
        contentType: file.type,
        size: file.size,
      })

      // Call the onFileUpload callback
      onFileUpload({
        type: type,
        name: file.name,
        url: storageId!,
        contentType: file.type,
        size: file.size,
      })

      setIsUploading(false)
      setUploadProgress(100)
    } catch (error) {
      console.error("Error uploading file:", error)
      setIsUploading(false)
      setUploadProgress(0)
      alert("Failed to upload file. Please try again.")
    }
  }

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file, "file")
    }
  }

  // Handle image input change
  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file, "image")
    }
  }

  return (
    <div className="flex items-center gap-2">
      {isUploading ? (
        <div className="flex items-center gap-2">
          <Spinner size="sm" />
          <span className="text-xs text-muted-foreground">{uploadProgress}%</span>
        </div>
      ) : (
        <>
          {/* Hidden file inputs */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.csv,.json,.js,.ts,.tsx,.jsx,.html,.css"
          />
          <input
            type="file"
            ref={imageInputRef}
            onChange={handleImageInputChange}
            className="hidden"
            accept="image/*"
          />

          {/* File upload button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => fileInputRef.current?.click()}
            title="Upload file"
          >
            <File className="h-4 w-4" />
          </Button>

          {/* Image upload button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => imageInputRef.current?.click()}
            title="Upload image"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  )
}
