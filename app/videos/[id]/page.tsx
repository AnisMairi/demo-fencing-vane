"use client"
import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Layout } from "@/components/layout/layout"
import { EnhancedVideoPlayerWithTimeline } from "@/components/video/enhanced-video-player-with-timeline"
import { VideoCommentsWithTimeline } from "@/components/video/video-comments-with-timeline"

export default function VideoViewPage({ params }: { params: { id: string } }) {
  const [currentTime, setCurrentTime] = useState(0)

  // Mock video data
  const videoMetadata = {
    id: params.id,
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
  const globalComments = [
    {
      id: "1",
      author: {
        name: "Coach Martin",
        avatar: "https://placehold.co/64x64?text=CM",
        role: "coach" as const,
      },
      content:
        "Excellent match entre ces deux jeunes athlètes. La technique et la stratégie sont au rendez-vous. Un bel exemple pour les autres étudiants.",
      timestamp: "il y a 2 heures",
      likes: 12,
      replies: [
        {
          id: "1-1",
          author: {
            name: "Marie Dubois",
            avatar: "https://placehold.co/64x64?text=MD",
            role: "local_contact" as const,
          },
          content: "Merci coach ! J'ai travaillé dur pour ce match.",
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
        role: "administrator" as const,
      },
      content:
        "Analyse générale : Ce match montre un excellent niveau technique. Les deux athlètes démontrent une maîtrise remarquable de leur arme.",
      timestamp: "il y a 1 jour",
      likes: 8,
      replies: [],
    },
  ]

  // Mock timeline comments data
  const timelineComments = [
    {
      id: "t1",
      timestamp: 52, // 0:52
      content: "Parfaite exécution du geste technique - la parade-riposte est impeccable",
      author: {
        name: "Coach Martin",
        avatar: "https://placehold.co/64x64?text=CM",
        role: "coach" as const,
      },
      createdAt: "il y a 2 heures",
      likes: 5,
      replies: [],
    },
    {
      id: "t2",
      timestamp: 135, // 2:15
      content: "Excellent jeu de jambes et contrôle de la distance",
      author: {
        name: "Master Laurent",
        avatar: "https://placehold.co/64x64?text=ML",
        role: "administrator" as const,
      },
      createdAt: "il y a 1 jour",
      likes: 3,
      replies: [],
    },
    {
      id: "t3",
      timestamp: 245, // 4:05
      content: "Belle attaque en prime - timing parfait",
      author: {
        name: "Marie Dubois",
        avatar: "https://placehold.co/64x64?text=MD",
        role: "local_contact" as const,
      },
      createdAt: "il y a 30 minutes",
      likes: 2,
      replies: [],
    },
  ]

  // Mock timeline tags data
  const timelineTags = [
    {
      id: "tag1",
      timestamp: 52, // 0:52
      tag: "Parfaite exécution",
      author: {
        name: "Coach Martin",
        avatar: "https://placehold.co/64x64?text=CM",
        role: "coach" as const,
      },
      createdAt: "il y a 2 heures",
    },
    {
      id: "tag2",
      timestamp: 135, // 2:15
      tag: "Technique épée",
      author: {
        name: "Master Laurent",
        avatar: "https://placehold.co/64x64?text=ML",
        role: "administrator" as const,
      },
      createdAt: "il y a 1 jour",
    },
    {
      id: "tag3",
      timestamp: 245, // 4:05
      tag: "Jeu de jambes",
      author: {
        name: "Marie Dubois",
        avatar: "https://placehold.co/64x64?text=MD",
        role: "local_contact" as const,
      },
      createdAt: "il y a 30 minutes",
    },
  ]

  const handleAddGlobalComment = (comment: { content: string }) => {
    console.log("Adding global comment:", comment)
  }

  const handleAddTimelineComment = (comment: { content: string; timestamp: number }) => {
    console.log("Adding timeline comment:", comment)
  }

  const handleAddTimelineTag = (tag: { tag: string; timestamp: number }) => {
    console.log("Adding timeline tag:", tag)
  }

  const handleSeekToTime = (time: number) => {
    console.log("Seeking to time:", time)
    setCurrentTime(time)
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
          <EnhancedVideoPlayerWithTimeline
            videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            metadata={videoMetadata}
            timelineComments={timelineComments}
            timelineTags={timelineTags}
            onTimeUpdate={(time) => setCurrentTime(time)}
            onAddTimelineComment={handleAddTimelineComment}
            onAddTimelineTag={handleAddTimelineTag}
            onSeekToTime={handleSeekToTime}
          />

          <VideoCommentsWithTimeline
            videoId={params.id}
            comments={globalComments}
            timelineComments={timelineComments}
            timelineTags={timelineTags}
            currentTime={currentTime}
            onAddComment={handleAddGlobalComment}
            onAddTimelineComment={handleAddTimelineComment}
            onAddTimelineTag={handleAddTimelineTag}
            onSeekToTime={handleSeekToTime}
            onReportComment={handleReportComment}
            onDeleteComment={handleDeleteComment}
          />
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
