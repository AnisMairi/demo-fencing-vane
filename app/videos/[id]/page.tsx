"use client"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Layout } from "@/components/layout/layout"
import { EnhancedVideoPlayerWithMetadata } from "@/components/video/enhanced-video-player-with-metadata"
import { VideoCommentsEnhanced } from "@/components/video/video-comments-enhanced"

export default function VideoViewPage({ params }: { params: { id: string } }) {
  // Mock video data
  const videoMetadata = {
    id: params.id,
    title: "Championnat Régional Final - Épée",
    athlete: {
      id: "1",
      firstName: "Marie",
      lastName: "Dubois",
      age: 16,
      gender: "féminin",
    },
    weapon: "épée",
    competitionType: "Championnat Régional",
    uploadedAt: "il y a 2 jours",
    duration: "12:34",
    views: 156,
    tags: ["final", "excellent jeu de jambes", "championnat régional", "technique épée"],
    uploader: {
      name: "Marie Dubois",
      role: "Contact Local",
    },
  }

  // Mock comments data
  const comments = [
    {
      id: "1",
      author: {
        name: "Coach Martin",
        avatar: "https://placehold.co/64x64?text=CM",
        role: "coach" as const,
      },
      content:
        "Excellent jeu de jambes tout au long du combat. Regardez comme elle maintient parfaitement la distance et le timing dans l'échange final. C'est un excellent exemple pour les autres étudiants.",
      visibility: "public" as const,
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
          content: "Merci coach ! J'ai travaillé dur sur cet exercice de timing que vous m'avez enseigné.",
          visibility: "public" as const,
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
        "Analyse technique : La parade-riposte à 2:15 montre un excellent contrôle de lame. C'est un exemple parfait pour l'entraînement. Je vais utiliser cette vidéo dans notre prochain séminaire d'entraîneurs.",
      visibility: "private" as const,
      timestamp: "il y a 1 jour",
      likes: 8,
      replies: [],
      videoTimestamp: 135,
    },
  ]

  const handleAddComment = (comment: { content: string; visibility: "public" | "private" }) => {
    console.log("Adding comment:", comment)
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
          <EnhancedVideoPlayerWithMetadata
            videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            metadata={videoMetadata}
            onTimeUpdate={(time) => console.log("Current time:", time)}
          />

          <VideoCommentsEnhanced
            videoId={params.id}
            comments={comments}
            onAddComment={handleAddComment}
            onReportComment={handleReportComment}
            onDeleteComment={handleDeleteComment}
          />
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
