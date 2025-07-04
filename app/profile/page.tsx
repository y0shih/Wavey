"use client"

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Slider } from '@/components/ui/slider'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, User, Mail, Calendar, Music } from 'lucide-react'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const audioRef = useRef<HTMLAudioElement>(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  
  // Demo playlist
  const [playlist] = useState([
    { id: 1, title: 'Demo Song 1', artist: 'Artist A', duration: '3:24', src: '/audio/demo1.mp3' },
    { id: 2, title: 'Demo Song 2', artist: 'Artist B', duration: '4:15', src: '/audio/demo2.mp3' },
    { id: 3, title: 'Demo Song 3', artist: 'Artist C', duration: '2:58', src: '/audio/demo3.mp3' }
  ])
  const [currentTrack, setCurrentTrack] = useState(0)

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    
    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', () => {
      setIsPlaying(false)
      nextTrack()
    })

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
    }
  }, [])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length)
    setIsPlaying(false)
  }

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length)
    setIsPlaying(false)
  }

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return
    const newVolume = value[0]
    audio.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    
    if (isMuted) {
      audio.volume = volume
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            My Profile
          </h1>
          <Button onClick={() => router.push('/search')} variant="outline" className="border-emerald-400 text-emerald-400 hover:bg-emerald-900/20">
            Back to Search
          </Button>
        </div>

        {/* User Info Card */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-emerald-400 flex items-center gap-2">
              <User className="w-5 h-5" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-emerald-600 text-white text-xl">
                  {(user.name || user.email).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>{user.name || 'No name set'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>Member since {new Date().getFullYear()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MP3 Player Card */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-emerald-400 flex items-center gap-2">
              <Music className="w-5 h-5" />
              Featured Songs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Track Info */}
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">{playlist[currentTrack].title}</h3>
              <p className="text-slate-400">{playlist[currentTrack].artist}</p>
            </div>

            {/* Audio Element */}
            <audio
              ref={audioRef}
              src={playlist[currentTrack].src}
              onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
            />

            {/* Progress Bar */}
            <div className="space-y-2">
              <Slider
                value={[currentTime]}
                max={duration}
                step={1}
                onValueChange={handleSeek}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-slate-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevTrack}
                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20"
              >
                <SkipBack className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlayPause}
                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20 w-12 h-12"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={nextTrack}
                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20"
              >
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.1}
                onValueChange={handleVolumeChange}
                className="flex-1"
              />
            </div>

            {/* Playlist */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-emerald-400">Playlist</h4>
              <div className="space-y-1">
                {playlist.map((track, index) => (
                  <div
                    key={track.id}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                      index === currentTrack 
                        ? 'bg-emerald-900/30 text-emerald-400' 
                        : 'hover:bg-slate-700/50'
                    }`}
                    onClick={() => setCurrentTrack(index)}
                  >
                    <div>
                      <div className="font-medium">{track.title}</div>
                      <div className="text-sm text-slate-400">{track.artist}</div>
                    </div>
                    <span className="text-sm text-slate-400">{track.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <div className="text-center">
          <Button
            onClick={logout}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
