"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Moon, Search, Play, Heart, MoreHorizontal, Clock, User, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { apiClient, Song } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"


export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<Song[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user, logout, isAuthenticated } = useAuth()
  const { toast } = useToast()

  // Load initial songs on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadInitialSongs()
    }
  }, [isAuthenticated])

  const loadInitialSongs = async () => {
    try {
      const songs = await apiClient.getAllSongs()
      setResults(songs)
    } catch (error) {
      toast({
        title: "Error loading songs",
        description: "Failed to load songs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    
    try {
      if (searchQuery.trim()) {
        const searchResults = await apiClient.searchSongs(searchQuery)
        setResults(searchResults)
      } else {
        const allSongs = await apiClient.getAllSongs()
        setResults(allSongs)
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Failed to search songs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="bg-gray-900/50 border-emerald-900/30">
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-semibold text-emerald-400 mb-4">Authentication Required</h2>
            <p className="text-gray-400 mb-6">Please log in to access the music search.</p>
            <div className="space-x-4">
              <Link href="/login">
                <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="border-emerald-600 text-emerald-400 hover:bg-emerald-900/20">
                  Sign Up
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-emerald-900/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
              <Moon className="w-5 h-5 text-black" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Wavey
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            {user && (
              <Link href="/profile" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                Welcome, {user.name || user.email}
              </Link>
            )}
            <Button 
              variant="ghost" 
              className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
            Discover Music
          </h1>
          <p className="text-gray-400 text-lg">Search for your favorite songs, artists, and albums</p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8 bg-gray-900/50 border-emerald-900/30">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for songs, artists, albums..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-800 border-emerald-900/50 text-white placeholder:text-gray-500 focus:border-emerald-500 pl-12 py-3 text-lg"
                />
              </div>
              <Button
                type="submit"
                disabled={isSearching}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 px-8"
              >
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Search Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-emerald-400">
              {searchQuery ? `Results for "${searchQuery}"` : "Popular Tracks"}
            </h2>
            <span className="text-gray-400">{results.length} songs</span>
          </div>

          {results.length > 0 ? (
            <Card className="bg-gray-900/50 border-emerald-900/30">
              <CardContent className="p-0">
                <div className="divide-y divide-gray-800">
                  {results.map((track, index) => (
                    <div key={track.id} className="flex items-center p-4 hover:bg-gray-800/50 transition-colors group">
                      <div className="flex items-center space-x-4 flex-1">
                        <span className="text-gray-400 w-6 text-center group-hover:hidden">{index + 1}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-6 h-6 p-0 hidden group-hover:flex items-center justify-center text-emerald-400 hover:text-emerald-300"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <div className="w-12 h-12 rounded-md bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                          <Moon className="w-6 h-6 text-black" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white truncate">{track.title}</h3>
                          <p className="text-gray-400 text-sm truncate">{Array.isArray(track.artist) ? track.artist.join(", ") : track.artist}</p>
                        </div>
                        <div className="hidden md:block text-gray-400 text-sm min-w-0 flex-1">
                          <p className="truncate">{track.album}</p>
                        </div>
                        {track.genre && (
                          <div className="hidden lg:block text-gray-400 text-sm">
                            <span className="bg-emerald-900/30 px-2 py-1 rounded text-xs">{track.genre}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-emerald-400"
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                          <span className="text-gray-400 text-sm w-12 text-center">{track.duration}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-emerald-400"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : isLoading ? (
            <Card className="bg-gray-900/50 border-emerald-900/30">
              <CardContent className="p-12 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-400">Loading songs...</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-900/50 border-emerald-900/30">
              <CardContent className="p-12 text-center">
                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No results found</h3>
                <p className="text-gray-500">Try searching with different keywords or check your spelling</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-emerald-900/20 to-muted/50 border-emerald-900/30 hover:border-emerald-600/50 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Moon className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Browse Genres</h3>
              <p className="text-muted-foreground text-sm">Explore music by your favorite genres</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-900/20 to-muted/50 border-emerald-900/30 hover:border-emerald-600/50 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <User className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Top Artists</h3>
              <p className="text-muted-foreground text-sm">Discover trending and popular artists</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-900/20 to-muted/50 border-emerald-900/30 hover:border-emerald-600/50 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Clock className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Recently Played</h3>
              <p className="text-muted-foreground text-sm">Continue where you left off</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
