/**
 * Loading Spinner Component
 * 美しいローディングアニメーションを提供するコンポーネント
 */

import { cn } from '@/lib/utils'

export function LoadingSpinner({ 
  size = "default", 
  className = "",
  text = null 
}) {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <div className={cn(
        "animate-spin rounded-full border-2 border-muted border-t-primary",
        sizeClasses[size]
      )} />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

export function LoadingDots({ className = "" }) {
  return (
    <div className={cn("flex space-x-1", className)}>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
    </div>
  )
}

export function LoadingPulse({ className = "" }) {
  return (
    <div className={cn("flex space-x-2", className)}>
      <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
      <div className="w-3 h-3 bg-primary rounded-full animate-pulse [animation-delay:0.2s]"></div>
      <div className="w-3 h-3 bg-primary rounded-full animate-pulse [animation-delay:0.4s]"></div>
    </div>
  )
}

export default LoadingSpinner

