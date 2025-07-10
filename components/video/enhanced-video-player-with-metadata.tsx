"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Maximize, SkipForward, RotateCcw, User, Calendar, Sword, Trophy } from "lucide-react"
import Link from "next/link"

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
  tags: string[]
  uploader: {
    name: string
    role: string
  }
}

interface EnhancedVideoPlayerWithMetadataProps {
  videoUrl: string
  metadata: VideoMetadata
  onTimeUpdate?: (currentTime: number) => void
}

export function EnhancedVideoPlayerWithMetadata({
  videoUrl,
  metadata,
  onTimeUpdate,
}: EnhancedVideoPlayerWithMetadataProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showControls, setShowControls] = useState(true)

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
  }, [onTimeUpdate])

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

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newTime = (value[0] / 100) * duration
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
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
            className="w-full aspect-video"
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
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <SkipForward className="h-4 w-4" />
                </Button>
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
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
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

                {/* Remove tags display section (Badge, etc.) */}
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
