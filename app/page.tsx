"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, Search, Moon, Sun, Headphones, Users, TrendingUp } from "lucide-react"
import { useTheme } from "next-themes"

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
        <Moon className="w-5 h-5 text-black" />
      </div>
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center hover:from-emerald-500 hover:to-emerald-700 transition-all duration-300 hover:scale-110"
    >
      {theme === "dark" ? <Moon className="w-5 h-5 text-black" /> : <Sun className="w-5 h-5 text-black" />}
    </button>
  )
}

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0)

  const titles = ["Feel the Wave", "Waveyyyyy", "Ride the Beat", "Vibe with Us"]

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitleIndex((prev) => (prev + 1) % titles.length)
    }, 3000) // Change title every 3 seconds

    return () => clearInterval(interval)
  }, [titles.length])

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-emerald-900/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Wavey
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/search">
              <Button variant="ghost" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20">
                Search
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className="border-emerald-600 text-emerald-400 hover:bg-emerald-900/20 bg-transparent"
              >
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-emerald-400 to-emerald-600 bg-clip-text text-transparent transition-all duration-500">
              {titles[currentTitleIndex]}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Discover, stream, and vibe to millions of tracks. Your music journey starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-lg px-8 py-3"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Listening
                </Button>
              </Link>
              <Link href="/search">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-emerald-600 text-emerald-400 hover:bg-emerald-900/20 text-lg px-8 py-3 bg-transparent"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Explore Music
                </Button>
              </Link>
            </div>
          </div>

          {/* Animated Music Visualizer */}
          <div className="flex justify-center items-end space-x-1 mb-16">
            {[...Array(25)].map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-full"
                style={{
                  width: "3px",
                  height: `${Math.random() * 80 + 10}px`,
                  animationName: "pulse",
                  animationDuration: `${Math.random() * 0.8 + 0.3}s`,
                  animationTimingFunction: "ease-in-out",
                  animationIterationCount: "infinite",
                  animationDirection: "alternate",
                  animationDelay: `${i * 0.05}s`,
                  transform: `scaleY(${Math.random() * 0.5 + 0.5})`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 animate-bounce">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Headphones className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
        <div className="absolute top-1/3 right-10 animate-bounce" style={{ animationDelay: "1s" }}>
          <div className="w-12 h-12 bg-emerald-600/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
              <Moon className="w-3 h-3 text-black" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-emerald-400">Why Choose Wavey?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-gray-800/50 border border-emerald-900/30 hover:border-emerald-600/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-emerald-400">Smart Search</h3>
              <p className="text-gray-300">
                Find any song, artist, or album instantly with our powerful search engine.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gray-800/50 border border-emerald-900/30 hover:border-emerald-600/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-emerald-400">Social Playlists</h3>
              <p className="text-gray-300">
                Create and share playlists with friends. Discover what others are listening to.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gray-800/50 border border-emerald-900/30 hover:border-emerald-600/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-emerald-400">Trending Now</h3>
              <p className="text-gray-300">Stay up-to-date with the latest hits and trending tracks worldwide.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-emerald-900/20 to-black">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">Ready to Ride the Wave?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join millions of music lovers and start your journey with Wavey today.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-lg px-12 py-4"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-emerald-900/20">
        <div className="container mx-auto text-center text-gray-400">
          <p>&copy; 2024 Wavey. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
