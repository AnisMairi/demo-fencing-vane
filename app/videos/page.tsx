"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Layout } from "@/components/layout/layout"
import { VideoCard } from "@/components/video/video-card"
import { RealTimeVideoFilters } from "@/components/video/real-time-video-filters"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useVideoApi } from "@/hooks"
import { Loading } from "@/components/common/loading"

export default function VideosPage() {
  const { getVideos } = useVideoApi()
  const [videos, setVideos] = useState<any[]>([])
  const [filteredVideos, setFilteredVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load videos on component mount
  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await getVideos({ limit: 100 })
        const videosData = response.videos || response || []
        
        // Transform API data to match VideoCard interface
        const transformedVideos = videosData.map((video: any) => ({
          id: video.id.toString(),
          title: video.title || 'Sans titre',
          thumbnail: video.thumbnail_path 
            ? `http://localhost:8000/${video.thumbnail_path}` 
            : "https://placehold.co/400x225?text=Video",
          duration: video.duration ? formatDuration(video.duration) : "00:00",
          views: video.view_count || 0,
          comments: video.comment_count || 0,
          athlete: getAthleteDisplayName(video),
          weapon: video.weapon_type || "inconnu",
          competitionType: video.competition_name || "Compétition",
          uploadedAt: formatRelativeTime(video.created_at),
          commentVisibility: "public",
        }))
        
        setVideos(transformedVideos)
        setFilteredVideos(transformedVideos)
      } catch (err) {
        console.error('Error loading videos:', err)
        setError("Erreur lors du chargement des vidéos")
        setVideos([])
        setFilteredVideos([])
      } finally {
        setLoading(false)
      }
    }

    loadVideos()
  }, [])

  const handleFiltersChange = (filters: any) => {
    console.log("Filters changed:", filters)

    let filtered = [...videos]

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(searchTerm) ||
          video.athlete.toLowerCase().includes(searchTerm),
      )
    }

    // Apply weapon filter
    if (filters.weapon && filters.weapon !== "allWeapons") {
      filtered = filtered.filter((video) => video.weapon === filters.weapon)
    }

    // Apply competition type filter
    if (filters.competitionType && filters.competitionType !== "allCompetitions") {
      filtered = filtered.filter((video) =>
        video.competitionType.toLowerCase().includes(filters.competitionType.toLowerCase()),
      )
    }

    setFilteredVideos(filtered)
  }

  // Helper function to format duration from seconds to MM:SS
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Helper function to get athlete display name
  const getAthleteDisplayName = (video: any): string => {
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
  }

  // Helper function to format relative time
  const formatRelativeTime = (dateString: string): string => {
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
  }

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

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Vidéos de Compétition</h1>
              <p className="text-muted-foreground">
                Parcourez les vidéos d'escrime avec informations détaillées des athlètes
              </p>
            </div>
            <Button asChild>
              <Link href="/videos/upload">
                <Upload className="mr-2 h-4 w-4" />
                Télécharger une Vidéo
              </Link>
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <RealTimeVideoFilters onFiltersChange={handleFiltersChange} totalResults={filteredVideos.length} />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>

          {!loading && !error && filteredVideos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {videos.length === 0 ? "Aucune vidéo disponible." : "Aucune vidéo trouvée avec ces critères de recherche."}
              </p>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
