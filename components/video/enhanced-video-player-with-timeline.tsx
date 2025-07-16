"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Play, Pause, Maximize, SkipForward, RotateCcw, User, Calendar, Sword, Trophy, Clock, Tag, X, Volume2, VolumeX, Star } from "lucide-react"
import Link from "next/link"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { EvaluationModal } from "@/components/video/evaluation-modal"
import { useEvaluationApi } from "@/hooks/use-evaluation-api"

interface VideoMetadata {
  id: string
  title: string
  athleteRight: {
    id: string | null
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
    id: string | null
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

  // Evaluation modal state
  const [evaluationModal, setEvaluationModal] = useState<{
    isOpen: boolean
    athleteId: string
    athleteName: string
  }>({
    isOpen: false,
    athleteId: "",
    athleteName: "",
  })
  const [evaluatedAthletes, setEvaluatedAthletes] = useState<Set<string>>(new Set())
  const { getVideoEvaluations } = useEvaluationApi()

  // Load existing evaluations to track which athletes have been evaluated
  useEffect(() => {
    const loadEvaluations = async () => {
      try {
        const evaluations = await getVideoEvaluations(parseInt(metadata.id))
        
        const evaluatedIds = new Set<string>()
        
        // Handle both possible response structures
        const evaluationsArray = evaluations.evaluations || evaluations || []
        
        if (Array.isArray(evaluationsArray)) {
          evaluationsArray.forEach((evaluation: any) => {
            if (evaluation && evaluation.athlete_id) {
              evaluatedIds.add(evaluation.athlete_id.toString())
            }
          })
        }
        setEvaluatedAthletes(evaluatedIds)
      } catch (error) {
        console.error('Error loading evaluations:', error)
        // Set empty set on error to avoid undefined issues
        setEvaluatedAthletes(new Set())
        
        // Log the error for debugging
        console.warn('Error loading evaluations:', error)
      }
    }

    if (metadata.id) {
      loadEvaluations()
    }
  }, [metadata.id])

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

    const newTime = value[0]
    setCurrentTime(newTime)
    onSeekToTime?.(newTime)
  }

  const handleSeekStart = () => {
    setIsSeeking(true)
  }

  const handleSeekEnd = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newTime = value[0]
    video.currentTime = newTime
    setCurrentTime(newTime)
    setIsSeeking(false)
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

  const handleEvaluationSubmitted = () => {
    // Add the athlete to the evaluated set
    setEvaluatedAthletes(prev => new Set([...prev, evaluationModal.athleteId]))
  }

  const openEvaluationModal = (athleteId: string, athleteName: string) => {
    setEvaluationModal({
      isOpen: true,
      athleteId,
      athleteName,
    })
  }

  const closeEvaluationModal = () => {
    setEvaluationModal({
      isOpen: false,
      athleteId: "",
      athleteName: "",
    })
  }

  const hasLeft = !!metadata.athleteLeft.id;
  const hasRight = !!metadata.athleteRight.id;
  const athleteCards = [hasLeft, hasRight].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Video Player Card with aspect ratio */}
      <Card>
        <CardContent className="p-0">
          <div className="relative bg-black rounded-t-lg aspect-video">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-contain"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onSeeking={() => setIsSeeking(true)}
              onSeeked={() => setIsSeeking(false)}
              onMouseMove={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            />

            {/* Video Controls Overlay */}
            <div 
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
              onMouseMove={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            >
              {/* Progress Bar */}
              <div className="mb-4">
                <Slider
                  value={[currentTime]}
                  onValueChange={handleSeek}
                  onValueCommit={handleSeekEnd}
                  max={duration}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-white text-xs mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-black/30">
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={restart} className="text-white hover:bg-black/30">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-black/30">
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <div className="w-20">
                    <Slider
                      value={[volume]}
                      onValueChange={(value) => setVolume(value[0])}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  <span className="text-white text-xs">{Math.round(volume * 100)}%</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={addTimeStamp}
                    className="text-white hover:bg-black/30 text-xs px-2 py-1 h-7"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    Timestamp
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowTagInput(true)}
                    className="text-white hover:bg-black/30 text-xs px-2 py-1 h-7"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    Ajouter un tag
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
                  <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-black/30" title="Fullscreen (F)">
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
                    className="text-white hover:bg-black/30 text-xs px-2 py-1 h-8"
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
                    className="text-white hover:bg-black/30 text-xs px-2 py-1 h-8"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Athlete Cards and Description Grid */}
      <div className={`grid gap-3 ${athleteCards === 2 ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}>
        {hasLeft && (
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-red-600" />
                      <h3 className="font-semibold text-red-800 text-sm">Athlète à gauche</h3>
                    </div>
                    <div className="pl-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => metadata.athleteLeft.id && openEvaluationModal(metadata.athleteLeft.id, `${metadata.athleteLeft.firstName} ${metadata.athleteLeft.lastName}`)}
                      disabled={!metadata.athleteLeft.id || evaluatedAthletes.has(metadata.athleteLeft.id)}
                      className={`h-8 w-8 rounded-lg border-2 transition-all duration-200 ${
                        !metadata.athleteLeft.id
                          ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                          : evaluatedAthletes.has(metadata.athleteLeft.id)
                          ? "border-blue-900 bg-blue-900 text-white cursor-not-allowed shadow-md"
                          : "border-blue-900 bg-white text-blue-900 hover:bg-blue-900 hover:text-white hover:shadow-md"
                      }`}
                      title={
                        !metadata.athleteLeft.id
                          ? "Aucun athlète associé"
                          : evaluatedAthletes.has(metadata.athleteLeft.id)
                          ? "Déjà évalué"
                          : "Évaluer cet athlète"
                      }
                    >
                      <Star className={`h-4 w-4 ${evaluatedAthletes.has(metadata.athleteLeft.id) ? "fill-current" : ""}`} />
                    </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button variant="link" className="p-0 h-auto text-left" asChild disabled={!metadata.athleteLeft.id}>
                      <Link href={metadata.athleteLeft.id ? `/athletes/${metadata.athleteLeft.id}` : "#"}>
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
        )}
        <div className={`lg:col-span-${athleteCards === 2 ? 3 : 3}`}> {/* Description always takes 3 columns */}
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
        {hasRight && (
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-800 text-sm">Athlète à droite</h3>
                    </div>
                    <div className="pl-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => metadata.athleteRight.id && openEvaluationModal(metadata.athleteRight.id, `${metadata.athleteRight.firstName} ${metadata.athleteRight.lastName}`)}
                      disabled={!metadata.athleteRight.id || evaluatedAthletes.has(metadata.athleteRight.id)}
                      className={`h-8 w-8 rounded-lg border-2 transition-all duration-200 ${
                        !metadata.athleteRight.id
                          ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                          : evaluatedAthletes.has(metadata.athleteRight.id)
                          ? "border-blue-900 bg-blue-900 text-white cursor-not-allowed shadow-md"
                          : "border-blue-900 bg-white text-blue-900 hover:bg-blue-900 hover:text-white hover:shadow-md"
                      }`}
                      title={
                        !metadata.athleteRight.id
                          ? "Aucun athlète associé"
                          : evaluatedAthletes.has(metadata.athleteRight.id)
                          ? "Déjà évalué"
                          : "Évaluer cet athlète"
                      }
                    >
                      <Star className={`h-4 w-4 ${evaluatedAthletes.has(metadata.athleteRight.id) ? "fill-current" : ""}`} />
                    </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button variant="link" className="p-0 h-auto text-left" asChild disabled={!metadata.athleteRight.id}>
                      <Link href={metadata.athleteRight.id ? `/athletes/${metadata.athleteRight.id}` : "#"}>
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
        )}
      </div>

      {/* Evaluation Modal */}
      <EvaluationModal
        isOpen={evaluationModal.isOpen}
        onClose={closeEvaluationModal}
        videoId={metadata.id}
        athleteId={evaluationModal.athleteId}
        athleteName={evaluationModal.athleteName}
        onEvaluationSubmitted={handleEvaluationSubmitted}
      />
    </div>
  )
} 