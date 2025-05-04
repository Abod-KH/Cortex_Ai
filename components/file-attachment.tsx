"use client"

import { useState } from "react"
import { File, ImageIcon, X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileAttachmentProps {
  attachment: {
    type: string
    name: string
    url: string
    contentType: string
    size: number
  }
  onRemove?: () => void
  showRemove?: boolean
}

/**
 * File attachment component that displays a file or image attachment
 * Allows users to download or remove attachments
 */
export function FileAttachment({ attachment, onRemove, showRemove = false }: FileAttachmentProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  /**
   * Format file size for display
   * @param bytes File size in bytes
   * @returns Formatted file size string
   */
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  /**
   * Get file URL for download
   * @returns URL to the file in Convex storage
   */
  const getFileUrl = () => {
    // Use the correct URL format for Convex storage
    return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${attachment.url}`
  }

  return (
    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md mb-2">
      {/* Display image thumbnail or file icon */}
      {attachment.type === "image" ? (
        <div className="relative">
          <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center overflow-hidden">
            {!isImageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <img
              src={getFileUrl() || "/placeholder.svg"}
              alt={attachment.name}
              className={`h-full w-full object-cover ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setIsImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            {imageError && <ImageIcon className="h-6 w-6 text-muted-foreground" />}
          </div>
        </div>
      ) : (
        <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
          <File className="h-6 w-6 text-muted-foreground" />
        </div>
      )}

      {/* File information */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{attachment.name}</div>
        <div className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => window.open(getFileUrl(), "_blank")}
          title="Download"
        >
          <Download className="h-4 w-4" />
        </Button>
        {showRemove && onRemove && (
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRemove} title="Remove">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
