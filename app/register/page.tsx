"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Moon, Eye, EyeOff, User, Mail, Lock, Check, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

const Requirement = ({ label, met }) => (
  <div className={`flex items-center transition-all duration-300 ${met ? "text-emerald-400" : "text-gray-500"}`}>
    {met ? <Check className="w-4 h-4 mr-2" /> : <X className="w-4 h-4 mr-2" />}
    {label}
  </div>
)

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isTyping, setIsTyping] = useState(false)
  const [nameValidation, setNameValidation] = useState("")
  const [emailValidation, setEmailValidation] = useState("")
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  })
  const [passwordsMatch, setPasswordsMatch] = useState(false)
  const { register } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    setPasswordRequirements({
      minLength: formData.password.length >= 8,
      uppercase: /[A-Z]/.test(formData.password),
      lowercase: /[a-z]/.test(formData.password),
      number: /\d/.test(formData.password),
      specialChar: /[!@#$%^&*]/.test(formData.password),
    })
    setPasswordsMatch(formData.password === formData.confirmPassword && formData.password.length > 0)
  }, [formData.password, formData.confirmPassword])

  const validateName = (name) => {
    if (name.length < 2) {
      setNameValidation("Username must be greater than 2 characters.")
    } else {
      setNameValidation("")
    }
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailValidation("Please enter a valid email address.")
    } else {
      setEmailValidation("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!passwordsMatch) {
      toast({
        title: "Registration failed",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await register(formData.email, formData.password, formData.name || undefined)
      toast({
        title: "Welcome to Wavey!",
        description: "Your account has been created successfully.",
      })
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setIsTyping(true)
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === "name") {
      validateName(value)
    } else if (field === "email") {
      validateEmail(value)
    }
  }

  const arePasswordRequirementsMet = Object.values(passwordRequirements).every(Boolean)
  const isFormInvalid =
    !formData.name ||
    !formData.email ||
    !arePasswordRequirementsMet ||
    !passwordsMatch ||
    nameValidation !== "" ||
    emailValidation !== ""

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 to-black" />

      <Card className="w-full max-w-md bg-gray-900/80 border-emerald-900/30 backdrop-blur-md relative z-10">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
              <Moon className="w-6 h-6 text-black" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Wavey
            </span>
          </div>
          <CardTitle className="text-2xl text-white">Join the Wave</CardTitle>
          <CardDescription className="text-gray-400">Create your account and start discovering music</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-emerald-400">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-gray-800 border-emerald-900/50 text-white placeholder:text-gray-500 focus:border-emerald-500 pl-10"
                  required
                />
              </div>
              {isTyping && nameValidation && <p className="text-red-500 text-xs mt-1">{nameValidation}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-emerald-400">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-gray-800 border-emerald-900/50 text-white placeholder:text-gray-500 focus:border-emerald-500 pl-10"
                  required
                />
              </div>
              {isTyping && emailValidation && <p className="text-red-500 text-xs mt-1">{emailValidation}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-emerald-400">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="bg-gray-800 border-emerald-900/50 text-white placeholder:text-gray-500 focus:border-emerald-500 pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {isTyping && !arePasswordRequirementsMet && (
                <div className="text-sm text-gray-400 mt-2 space-y-1">
                  <Requirement label="At least 8 characters" met={passwordRequirements.minLength} />
                  <Requirement label="An uppercase letter" met={passwordRequirements.uppercase} />
                  <Requirement label="A lowercase letter" met={passwordRequirements.lowercase} />
                  <Requirement label="A number" met={passwordRequirements.number} />
                  <Requirement label="A special character (!@#$%^&*)" met={passwordRequirements.specialChar} />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-emerald-400">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="bg-gray-800 border-emerald-900/50 text-white placeholder:text-gray-500 focus:border-emerald-500 pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-400"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {isTyping && formData.confirmPassword.length > 0 && (
                <div className="text-sm text-gray-400 mt-2 space-y-1">
                  <Requirement label="Passwords match" met={passwordsMatch} />
                </div>
              )}
            </div>
            <Button
              type="submit"
              disabled={isLoading || isFormInvalid}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>
          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-emerald-400">
              ← Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
