"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"

export default function NeonCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const accessToken = searchParams.get("access_token")
    
    if (!accessToken) {
      toast({
        title: "Authentication failed",
        description: "No access token received from Neon Auth",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    const handleNeonAuth = async () => {
      try {
        await apiClient.neonAuth(accessToken)
        toast({
          title: "Success!",
          description: "Successfully signed in with Neon",
        })
        router.push("/dashboard")
      } catch (error) {
        toast({
          title: "Authentication failed",
          description: error instanceof Error ? error.message : "Failed to authenticate with Neon",
          variant: "destructive",
        })
        router.push("/login")
      }
    }

    handleNeonAuth()
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
