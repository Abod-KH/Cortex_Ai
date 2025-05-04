import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SpinnerProps {
  className?: string
  size?: "default" | "sm" | "lg"
}

export function Spinner({ className, size = "default" }: SpinnerProps) {
  const sizeClasses = {
    default: "h-4 w-4",
    sm: "h-2 w-2",
    lg: "h-6 w-6",
  }

  return <Loader2 className={cn("animate-spin text-muted-foreground", sizeClasses[size], className)} />
}
