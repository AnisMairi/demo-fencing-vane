"use client"
import { useState, use, useRef } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Layout } from "@/components/layout/layout"
import { EnhancedVideoPlayer } from "@/components/video/enhanced-video-player-with-timeline"
import { VideoComments } from "@/components/video/video-comments-with-timeline"

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

  // Mock video data
  const videoMetadata = {
    id: id,
    title: "Championnat Régional Final - Épée",
    athleteRight: {
      id: "1",
      firstName: "Marie",
      lastName: "Dubois",
      age: 16,
      gender: "féminin",
      weapon: "épée",
      club: "Cercle d'Escrime de Paris",
      coach: "Master Laurent",
      ranking: "#3 Regional U17",
    },
    athleteLeft: {
      id: "2",
      firstName: "Jean",
      lastName: "Martin",
      age: 17,
      gender: "masculin",
      weapon: "épée",
      club: "Lyon Escrime Club",
      coach: "Coach Bernard",
      ranking: "#5 Regional U18",
    },
    competitionType: "Championnat Régional",
    uploadedAt: "il y a 2 jours",
    duration: "12:34",
    views: 156,
    uploader: {
      name: "Marie Dubois",
      role: "Contact Local",
    },
  }

  // Mock global comments data
  const [globalComments, setGlobalComments] = useState<Comment[]>([
    {
      id: "1",
      author: {
        name: "Coach Martin",
        avatar: "https://placehold.co/64x64?text=CM",
        role: "coach",
      },
      content:
        "Excellent match entre ces deux jeunes athlètes. La technique et la stratégie sont au rendez-vous. Un bel exemple pour les autres étudiants. /time{2:15} /tag{technique} /tag{stratégie}",
      timestamp: "il y a 2 heures",
      likes: 12,
      replies: [
        {
          id: "1-1",
          author: {
            name: "Marie Dubois",
            avatar: "https://placehold.co/64x64?text=MD",
            role: "local_contact",
          },
          content: "Merci coach ! J'ai travaillé dur pour ce match. /time{3:45} /tag{effort}",
          timestamp: "il y a 1 heure",
          likes: 3,
          replies: [],
        },
      ],
    },
    {
      id: "2",
      author: {
        name: "Master Laurent",
        avatar: "https://placehold.co/64x64?text=ML",
        role: "administrator",
      },
      content:
        "Analyse générale : Ce match montre un excellent niveau technique. Les deux athlètes démontrent une maîtrise remarquable de leur arme. /time{1:30} /tag{niveau} /tag{maîtrise}",
      timestamp: "il y a 1 jour",
      likes: 8,
      replies: [],
    },
    {
      id: "3",
      author: {
        name: "Coach Bernard",
        avatar: "https://placehold.co/64x64?text=CB",
        role: "coach",
      },
      content:
        "Moment clé à /time{4:20} - excellente parade et riposte. /tag{parade} /tag{riposte} /tag{moment-clé}",
      timestamp: "il y a 3 heures",
      likes: 5,
      replies: [],
    },
  ])

  const handleAddGlobalComment = (comment: { content: string }) => {
    console.log("Adding global comment:", comment)
    
    // Create new comment
    const newComment: Comment = {
      id: Date.now().toString(),
      author: {
        name: "Vous",
        avatar: "https://placehold.co/64x64?text=You",
        role: "local_contact",
      },
      content: comment.content,
      timestamp: "À l'instant",
      likes: 0,
      replies: [],
    }
    
    // Add to the beginning of the comments list
    setGlobalComments(prev => [newComment, ...prev])
  }



  const handleSeekToTime = (time: number) => {
    console.log("Seeking to time:", time)
    if (videoRef.current) {
      videoRef.current.currentTime = time
    }
    setCurrentTime(time)
  }

  const handleAddTimeStamp = (timeStamp: string) => {
    setCommentInput(prev => prev + timeStamp + " ")
  }

  const handleAddTag = (tag: string) => {
    // Extract the tag text from /tag{text} format
    const tagMatch = tag.match(/\/tag\{([^}]+)\}/)
    if (tagMatch) {
      const tagText = tagMatch[1]
      setPendingTags(prev => [...prev, tagText])
    }
  }

  const handleSeekToTimeStamp = (timeString: string) => {
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
  }

  const handleReportComment = (commentId: string) => {
    console.log("Reporting comment:", commentId)
  }

  const handleDeleteComment = (commentId: string) => {
    console.log("Deleting comment:", commentId)
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-6xl mx-auto space-y-6">
          <div ref={videoContainerRef} className="transition-all duration-500 ease-out">
            <EnhancedVideoPlayer
              videoRef={videoRef}
              videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              metadata={videoMetadata}
              onTimeUpdate={(time) => setCurrentTime(time)}
              onSeekToTime={handleSeekToTime}
              onAddTimeStamp={handleAddTimeStamp}
              onAddTag={handleAddTag}
            />
          </div>

          <VideoComments
            videoId={id}
            comments={globalComments}
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
