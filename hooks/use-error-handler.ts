"use client"

import { useCallback, useState } from "react"

interface UseErrorHandlerReturn {
  error: string | null
  setError: (error: string | null) => void
  handleError: (error: unknown) => void
  clearError: () => void
}

export function useErrorHandler(): UseErrorHandlerReturn {
  const [error, setError] = useState<string | null>(null)

  const handleError = useCallback((error: unknown) => {
    if (error instanceof Error) {
      setError(error.message)
    } else if (typeof error === "string") {
      setError(error)
    } else {
      setError("An unexpected error occurred")
    }

    // Log error for debugging
    console.error("Error handled:", error)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    error,
    setError,
    handleError,
    clearError,
  }
}
