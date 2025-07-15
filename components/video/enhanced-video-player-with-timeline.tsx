"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Play, Pause, Maximize, SkipForward, RotateCcw, User, Calendar, Sword, Trophy, Clock, Tag, X, Volume2, VolumeX } from "lucide-react"
import Link from "next/link"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

interface VideoMetadata {
  id: string
  title: string
  athleteRight: {
    id: string
    firstName: string
    lastName: string
    age: number
    gender: string
    weapon: string
    club: string
    coach: string
    ranking: string
  }
  athleteLeft: {
    id: string
    firstName: string
    lastName: string
    age: number
    gender: string
    weapon: string
    club: string
    coach: string
    ranking: string
  }
  competitionType: string
  uploadedAt: string
  duration: string
  views: number
  uploader: {
    name: string
    role: string
  }
}

interface EnhancedVideoPlayerProps {
  videoUrl: string
  metadata: VideoMetadata
  onTimeUpdate?: (currentTime: number) => void
  onSeekToTime?: (time: number) => void
  onAddTimeStamp?: (timeStamp: string) => void
  onAddTag?: (tag: string) => void
  videoRef?: React.RefObject<HTMLVideoElement | null>
}

// Predefined tags for fencing
const PREDEFINED_TAGS: string[] = [
  "Attaque sur la préparation",
  "Attaque composée",
  "Attaque courte",
  "Attaque longue",
  "Parade riposte",
  "Contre riposte",
  "Contre attaque",
  "Tomber dans le vide",
];

export function EnhancedVideoPlayer({
  videoUrl,
  metadata,
  onTimeUpdate,
  onSeekToTime,
  onAddTimeStamp,
  onAddTag,
  videoRef: externalVideoRef,
}: EnhancedVideoPlayerProps) {
  const internalVideoRef = useRef<HTMLVideoElement>(null)
  const videoRef = externalVideoRef || internalVideoRef
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [isSeeking, setIsSeeking] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Tag input state
  const [showTagInput, setShowTagInput] = useState(false)
  const [availableTags, setAvailableTags] = useState<string[]>([...PREDEFINED_TAGS])
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined)

  // Auto-play when video loads
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => {
      // Auto-play the video when it's ready
      video.play().catch((error) => {
        console.log("Auto-play prevented:", error)
        // Auto-play might be blocked by browser, that's okay
      })
    }

    video.addEventListener("canplay", handleCanPlay)
    return () => video.removeEventListener("canplay", handleCanPlay)
  }, [videoRef])

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange)
    document.addEventListener("mozfullscreenchange", handleFullscreenChange)
    document.addEventListener("MSFullscreenChange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange)
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange)
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => {
      setCurrentTime(video.currentTime)
      onTimeUpdate?.(video.currentTime)
    }

    const updateDuration = () => setDuration(video.duration)

    video.addEventListener("timeupdate", updateTime)
    video.addEventListener("loadedmetadata", updateDuration)

    return () => {
      video.removeEventListener("timeupdate", updateTime)
      video.removeEventListener("loadedmetadata", updateDuration)
    }
  }, [onTimeUpdate, videoRef])

  // Add seeking effect when currentTime changes significantly
  useEffect(() => {
    if (isSeeking) {
      const timer = setTimeout(() => setIsSeeking(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [isSeeking])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const video = videoRef.current
      if (!video) return

      // Prevent shortcuts when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Don't interfere with browser shortcuts (Ctrl, Alt, Meta keys)
      if (e.ctrlKey || e.altKey || e.metaKey) {
        return
      }

      switch (e.code) {
        case "Space":
          e.preventDefault()
          togglePlay()
          break
        case "ArrowLeft":
          e.preventDefault()
          video.currentTime = Math.max(0, video.currentTime - 10)
          break
        case "ArrowRight":
          e.preventDefault()
          video.currentTime = Math.min(video.duration, video.currentTime + 10)
          break
        case "ArrowUp":
          e.preventDefault()
          setVolume(Math.min(1, volume + 0.1))
          break
        case "ArrowDown":
          e.preventDefault()
          setVolume(Math.max(0, volume - 0.1))
          break
        case "KeyM":
          e.preventDefault()
          toggleMute()
          break
        case "KeyF":
          e.preventDefault()
          toggleFullscreen()
          break
        case "KeyR":
          e.preventDefault()
          restart()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [videoRef, volume])

  // Update video playback rate when state changes
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.playbackRate = playbackRate
    }
  }, [playbackRate, videoRef])

  // Update video volume when state changes
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.volume = volume
      video.muted = isMuted
    }
  }, [volume, isMuted, videoRef])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const restart = () => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = 0
    setCurrentTime(0)
    onSeekToTime?.(0)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (!isFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen()
      } else if ((video as any).webkitRequestFullscreen) {
        (video as any).webkitRequestFullscreen()
      } else if ((video as any).msRequestFullscreen) {
        (video as any).msRequestFullscreen()
      }
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen()
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen()
      }
      setIsFullscreen(false)
    }
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newTime = (value[0] / 100) * duration
    video.currentTime = newTime
    setCurrentTime(newTime)
    onSeekToTime?.(newTime)
  }

  // Function to handle external seeking (from timestamps)
  const handleExternalSeek = (time: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = time
    setCurrentTime(time)
    setIsSeeking(true)
    onSeekToTime?.(time)
  }

  // Listen for external seek requests
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      // If the time changed significantly and we're not manually seeking, it's an external seek
      if (Math.abs(video.currentTime - currentTime) > 1) {
        setIsSeeking(true)
      }
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    return () => video.removeEventListener("timeupdate", handleTimeUpdate)
  }, [currentTime, videoRef])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const addTimeStamp = () => {
    const formattedTime = formatTime(currentTime)
    const timeStamp = `/time{${formattedTime}}`
    onAddTimeStamp?.(timeStamp)
  }

  const addTag = (tag: string) => {
    if (tag) {
      const tagString = `/tag{${tag}}`
      onAddTag?.(tagString)
      setAvailableTags((prev: string[]) => prev.filter((t: string) => t !== tag))
      setSelectedTag(undefined)
      setShowTagInput(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <Card className="overflow-hidden">
        <div
          className="relative bg-black group"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          <video
            ref={videoRef}
            src={videoUrl}
            className={`w-full aspect-video transition-all duration-300 ${
              isSeeking ? 'ring-4 ring-blue-400 ring-opacity-60' : ''
            }`}
            onClick={togglePlay}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Video Controls */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="mb-4">
              <Slider
                value={[duration ? (currentTime / duration) * 100 : 0]}
                onValueChange={handleSeek}
                max={100}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-white mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-white/20">
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={restart} className="text-white hover:bg-white/20" title="Restart (R)">
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => {
                  const video = videoRef.current
                  if (video) {
                    video.currentTime = Math.min(video.duration, video.currentTime + 10)
                  }
                }} className="text-white hover:bg-white/20" title="Skip 10s (→)">
                  <SkipForward className="h-4 w-4" />
                </Button>
                
                {/* Volume Control */}
                <div className="flex items-center gap-1 ml-2">
                  <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/20" title="Mute (M)">
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    onValueChange={(value) => {
                      setVolume(value[0] / 100)
                      if (value[0] > 0) setIsMuted(false)
                    }}
                    max={100}
                    step={1}
                    className="w-20"
                  />
                </div>
                
                {/* Add Time and Tag Buttons */}
                <div className="flex items-center gap-1 ml-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={addTimeStamp}
                    className="text-white hover:bg-white/20 text-xs px-2 py-1 h-7"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    Add time
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowTagInput(true)}
                    className="text-white hover:bg-white/20 text-xs px-2 py-1 h-7"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    Ajouter un tag
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={playbackRate}
                  onChange={(e) => setPlaybackRate(Number(e.target.value))}
                  className="bg-transparent text-white text-sm border border-white/20 rounded px-2 py-1"
                >
                  <option value={0.5} className="text-black">
                    0.5x
                  </option>
                  <option value={1} className="text-black">
                    1x
                  </option>
                  <option value={1.25} className="text-black">
                    1.25x
                  </option>
                  <option value={1.5} className="text-black">
                    1.5x
                  </option>
                  <option value={2} className="text-black">
                    2x
                  </option>
                </select>
                <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-white/20" title="Fullscreen (F)">
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tag Combobox */}
            {showTagInput && (
              <div className="mt-3 flex items-center gap-2">
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger className="w-[220px] bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Choisir un tag..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTags.map(tag => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => selectedTag && addTag(selectedTag)}
                  className="text-white hover:bg-white/20 text-xs px-2 py-1 h-8"
                  disabled={!selectedTag}
                >
                  Ajouter
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setShowTagInput(false)
                    setSelectedTag(undefined)
                  }}
                  className="text-white hover:bg-white/20 text-xs px-2 py-1 h-8"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Video Metadata */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Athlète à gauche - Left Column */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-red-800 text-sm">Athlète à gauche</h3>
                </div>

                <div className="space-y-3">
                  <Button variant="link" className="p-0 h-auto text-left" asChild>
                    <Link href={`/athletes/${metadata.athleteLeft.id}`}>
                      <div>
                        <p className="font-medium text-base">
                          {metadata.athleteLeft.firstName} {metadata.athleteLeft.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">Voir le profil complet</p>
                      </div>
                    </Link>
                  </Button>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>
                        {metadata.athleteLeft.age} ans • {metadata.athleteLeft.gender}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sword className="h-3 w-3 text-muted-foreground" />
                      <span className="capitalize">{metadata.athleteLeft.weapon}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-3 w-3 text-muted-foreground" />
                      <span>{metadata.athleteLeft.ranking}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>{metadata.athleteLeft.club}</p>
                      <p>Coach: {metadata.athleteLeft.coach}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Video Description - Middle Column */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold">{metadata.title}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground mt-2">
                    <span>{metadata.views} vues</span>
                    <span>•</span>
                    <span>{metadata.uploadedAt}</span>
                    <span>•</span>
                    <span>Téléchargé par {metadata.uploader.name}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Athlète à droite - Right Column */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-800 text-sm">Athlète à droite</h3>
                </div>

                <div className="space-y-3">
                  <Button variant="link" className="p-0 h-auto text-left" asChild>
                    <Link href={`/athletes/${metadata.athleteRight.id}`}>
                      <div>
                        <p className="font-medium text-base">
                          {metadata.athleteRight.firstName} {metadata.athleteRight.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">Voir le profil complet</p>
                      </div>
                    </Link>
                  </Button>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>
                        {metadata.athleteRight.age} ans • {metadata.athleteRight.gender}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sword className="h-3 w-3 text-muted-foreground" />
                      <span className="capitalize">{metadata.athleteRight.weapon}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-3 w-3 text-muted-foreground" />
                      <span>{metadata.athleteRight.ranking}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>{metadata.athleteRight.club}</p>
                      <p>Coach: {metadata.athleteRight.coach}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 