"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"

export default function GoogleCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const code = searchParams.get("code")
    
    if (!code) {
      toast({
        title: "Authentication failed",
        description: "No authentication code received from Google",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    const handleGoogleAuth = async () => {
      try {
        await apiClient.googleAuth(code)
        toast({
          title: "Success!",
          description: "Successfully signed in with Google",
        })
        router.push("/dashboard")
      } catch (error) {
        toast({
          title: "Authentication failed",
          description: error instanceof Error ? error.message : "Failed to authenticate with Google",
          variant: "destructive",
        })
        router.push("/login")
      }
    }

    handleGoogleAuth()
  }, [router, searchParams, toast])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Authenticating...</h2>
        <p className="text-gray-500">Please wait while we complete your sign in</p>
      </div>
    </div>
  )
}
