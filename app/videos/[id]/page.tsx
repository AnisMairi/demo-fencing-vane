"use client"
import { useState, use, useRef, useEffect, useCallback } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Layout } from "@/components/layout/layout"
import { EnhancedVideoPlayer } from "@/components/video/enhanced-video-player-with-timeline"
import { VideoComments } from "@/components/video/video-comments-with-timeline"
import { useVideoApi } from "@/hooks"
import { useCommentApi } from "@/hooks"
import { Loading } from "@/components/common/loading"

interface Comment {
  id: string
  author: {
    name: string
    avatar: string
    role: "local_contact" | "coach" | "administrator"
  }
  content: string
  timestamp: string
  likes: number
  replies: Comment[]
}

interface TimeStamp {
  id: string
  time: string
  displayTime: string
}

interface VideoTag {
  id: string
  text: string
  displayText: string
}

export default function VideoViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [commentInput, setCommentInput] = useState("")
  const [pendingTags, setPendingTags] = useState<string[]>([])
  const [videoData, setVideoData] = useState<any>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { getVideo } = useVideoApi()
  const { getVideoComments, createComment } = useCommentApi()

  // Helper function to format relative time
  const formatRelativeTime = useCallback((dateString: string): string => {
    if (!dateString) return 'Date inconnue'
    
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'il y a moins d\'une heure'
    if (diffInHours < 24) return `il y a ${diffInHours}h`
    if (diffInHours < 48) return 'il y a 1 jour'
    if (diffInHours < 168) return `il y a ${Math.floor(diffInHours / 24)} jours`
    if (diffInHours < 336) return 'il y a 1 semaine'
    return `il y a ${Math.floor(diffInHours / 168)} semaines`
  }, [])

  // Helper function to format duration from seconds to MM:SS
  const formatDuration = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }, [])

  // Helper function to get athlete display name
  const getAthleteDisplayName = useCallback((video: any): string => {
    if (video.athleteRight_name && video.athleteLeft_name) {
      if (video.athleteRight_id === video.athleteLeft_id) {
        return video.athleteRight_name
      } else {
        return `${video.athleteRight_name} vs ${video.athleteLeft_name}`
      }
    } else if (video.athleteRight_name) {
      return video.athleteRight_name
    } else if (video.athleteLeft_name) {
      return video.athleteLeft_name
    } else {
      return 'Athlète inconnu'
    }
  }, [])

  // Load video data and comments - Mode démo
  useEffect(() => {
    const loadVideoData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Mode démo : utiliser les données de démo
        const { DEMO_VIDEOS } = await import("@/lib/demo-videos")
        const demoVideo = DEMO_VIDEOS.find(v => v.id === id)
        
        if (!demoVideo) {
          setError("Vidéo non trouvée")
          setLoading(false)
          return
        }

        // Transformer les données de démo en format attendu
        const transformedVideo = {
          id: demoVideo.id,
          title: demoVideo.title,
          file_path: "", // Pas de fichier en démo
          thumbnail_path: demoVideo.thumbnail,
          duration: parseDuration(demoVideo.duration),
          view_count: demoVideo.views,
          comment_count: demoVideo.comments,
          athleteRight_name: demoVideo.athlete.includes(" vs ") 
            ? demoVideo.athlete.split(" vs ")[0]
            : demoVideo.athlete,
          athleteLeft_name: demoVideo.athlete.includes(" vs ")
            ? demoVideo.athlete.split(" vs ")[1]
            : null,
          athleteRight_id: null,
          athleteLeft_id: null,
          weapon_type: demoVideo.weapon_type,
          competition_name: demoVideo.competition_name,
          competition_date: demoVideo.competition_date,
          uploader_name: demoVideo.uploader,
          uploader_id: 1,
          created_at: new Date().toISOString(),
        }
        
        setVideoData(transformedVideo)
        
        // Pas de commentaires en démo
        setComments([])

      } catch (err) {
        console.error('Error loading video data:', err)
        setError("Erreur lors du chargement de la vidéo")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadVideoData()
    }
  }, [id])

  // Helper to parse duration string "MM:SS" to seconds
  const parseDuration = (duration: string): number => {
    const [minutes, seconds] = duration.split(':').map(Number)
    return minutes * 60 + seconds
  }

  // Transform video data for the player
  const getVideoMetadata = useCallback(() => {
    if (!videoData) return null



    return {
      id: videoData.id.toString(),
      title: videoData.title || "Sans titre",
      athleteRight: {
        id: videoData.athleteRight_id?.toString() || null,
        firstName: videoData.athleteRight_name?.split(' ')[0] || "Athlète",
        lastName: videoData.athleteRight_name?.split(' ').slice(1).join(' ') || "Droit",
        age: 16,
        gender: "masculin",
        weapon: videoData.weapon_type || "épée",
        club: "Club d'escrime",
        coach: "Coach",
        ranking: "#1",
      },
      athleteLeft: {
        id: videoData.athleteLeft_id?.toString() || null,
        firstName: videoData.athleteLeft_name?.split(' ')[0] || "Athlète",
        lastName: videoData.athleteLeft_name?.split(' ').slice(1).join(' ') || "Gauche",
        age: 17,
        gender: "masculin",
        weapon: videoData.weapon_type || "épée",
        club: "Club d'escrime",
        coach: "Coach",
        ranking: "#2",
      },
      competitionType: videoData.competition_name || "Compétition",
      uploadedAt: formatRelativeTime(videoData.created_at),
      duration: videoData.duration ? formatDuration(videoData.duration) : "00:00",
      views: videoData.view_count || 0,
      uploader: {
        name: videoData.uploader_name || `Utilisateur #${videoData.uploader_id}` || "Utilisateur inconnu",
        role: "Contact Local",
      },
    }
  }, [videoData, formatRelativeTime, formatDuration])

  const handleAddGlobalComment = useCallback(async (comment: { content: string }) => {
    try {
      // Create comment via API
      const newComment = await createComment(parseInt(id), { content: comment.content })
      
      // Add to local state
      const transformedComment: Comment = {
        id: newComment.id.toString(),
        author: {
          name: newComment.author_name || 'Vous',
          avatar: "https://placehold.co/64x64?text=" + (newComment.author_name?.charAt(0) || 'Y'),
          role: "local_contact" as const,
        },
        content: newComment.content,
        timestamp: "À l'instant",
        likes: 0,
        replies: [],
      }
      
      setComments(prev => [transformedComment, ...prev])
    } catch (err) {
      console.error('Error creating comment:', err)
      setError("Erreur lors de l'ajout du commentaire")
    }
  }, [id, createComment])

  const handleSeekToTime = useCallback((time: number) => {
    console.log("Seeking to time:", time)
    if (videoRef.current) {
      videoRef.current.currentTime = time
    }
    setCurrentTime(time)
  }, [])

  const handleAddTimeStamp = useCallback((timeStamp: string) => {
    setCommentInput(prev => prev + timeStamp + " ")
  }, [])

  const handleAddTag = useCallback((tag: string) => {
    // Extract the tag text from /tag{text} format
    const tagMatch = tag.match(/\/tag\{([^}]+)\}/)
    if (tagMatch) {
      const tagText = tagMatch[1]
      setPendingTags(prev => [...prev, tagText])
    }
  }, [])

  const handleSeekToTimeStamp = useCallback((timeString: string) => {
    // Parse time string like "1:23" to seconds
    const [minutes, seconds] = timeString.split(':').map(Number)
    const totalSeconds = minutes * 60 + seconds
    handleSeekToTime(totalSeconds)
    
    // Scroll to video and focus on it
    if (videoContainerRef.current) {
      videoContainerRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })
      
      // Add a subtle highlight effect
      videoContainerRef.current.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-50')
      setTimeout(() => {
        videoContainerRef.current?.classList.remove('ring-2', 'ring-blue-500', 'ring-opacity-50')
      }, 2000)
    }
    
    // Show a brief notification
    console.log(`🎬 Vidéo positionnée à ${timeString}`)
  }, [handleSeekToTime])

  const handleReportComment = useCallback((commentId: string) => {
    console.log("Reporting comment:", commentId)
  }, [])

  const handleDeleteComment = useCallback((commentId: string) => {
    console.log("Deleting comment:", commentId)
  }, [])

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex justify-center items-center py-12">
            <Loading />
          </div>
        </Layout>
      </ProtectedRoute>
    )
  }

  if (error || !videoData) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error || "Vidéo non trouvée"}
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    )
  }

  const videoMetadata = getVideoMetadata()
  if (!videoMetadata) return null

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          <div ref={videoContainerRef} className="transition-all duration-500 ease-out">
            {/* Message de démo à la place de la vidéo */}
            <div className="bg-muted/50 border border-border rounded-lg p-8 text-center space-y-4">
              <div className="text-4xl mb-4">🎬</div>
              <h2 className="text-2xl font-bold">Fonctionnalité désactivée pour cette démo</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Cette fonctionnalité a été désactivée pour cette démo. En production, vous pourriez visionner la vidéo complète de <strong>{videoMetadata?.title || "cette vidéo"}</strong> ici.
              </p>
              {videoMetadata && (
                <div className="pt-4">
                  <div className="inline-block bg-card border border-border rounded-lg p-4 text-left">
                    <p className="text-sm font-medium mb-2">Informations de la vidéo :</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Titre : {videoMetadata.title}</li>
                      <li>• Athlète : {videoMetadata.athleteRight.firstName} {videoMetadata.athleteRight.lastName}</li>
                      <li>• Compétition : {videoMetadata.competitionType}</li>
                      <li>• Durée : {videoMetadata.duration}</li>
                      <li>• Vues : {videoMetadata.views.toLocaleString()}</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          <VideoComments
            videoId={id}
            comments={comments}
            onAddComment={handleAddGlobalComment}
            onReportComment={handleReportComment}
            onDeleteComment={handleDeleteComment}
            commentInput={commentInput}
            onCommentInputChange={setCommentInput}
            onSeekToTimeStamp={handleSeekToTimeStamp}
            onAddTag={handleAddTag}
            pendingTags={pendingTags}
            onPendingTagsChange={setPendingTags}
          />
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
