"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiClient, User } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          apiClient.setToken(token)
          const profile = await apiClient.getProfile()
          setUser(profile)
        }
      } catch (error) {
        // Token is invalid, clear it
        apiClient.clearToken()
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password)
      setUser(response.user)
      router.push('/search') // Redirect to search page after login
    } catch (error) {
      throw error // Re-throw to be handled by the component
    }
  }

  const register = async (email: string, password: string, name?: string) => {
    try {
      const response = await apiClient.register(email, password, name)
      setUser(response.user)
      router.push('/search') // Redirect to search page after registration
    } catch (error) {
      throw error // Re-throw to be handled by the component
    }
  }

  const logout = () => {
    apiClient.clearToken()
    setUser(null)
    router.push('/') // Redirect to home page
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
