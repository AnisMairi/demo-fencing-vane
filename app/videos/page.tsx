"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Layout } from "@/components/layout/layout"
import { VideoCard } from "@/components/video/video-card"
import { RealTimeVideoFilters } from "@/components/video/real-time-video-filters"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function VideosPage() {
  // Mock video data
  const videos = [
    {
      id: "1",
      title: "Championnat Régional Final - Épée",
      thumbnail: "https://placehold.co/400x225?text=Video+1",
      duration: "12:34",
      views: 156,
      comments: 8,
      athlete: "Marie Dubois (16, Féminin)",
      weapon: "épée",
      competitionType: "Championnat Régional",
      tags: ["final", "excellent jeu de jambes"],
      uploadedAt: "il y a 2 jours",
      commentVisibility: "public",
    },
    {
      id: "2",
      title: "Circuit National Jeunes - Fleuret",
      thumbnail: "https://placehold.co/400x225?text=Video+2",
      duration: "8:45",
      views: 89,
      comments: 12,
      athlete: "Jean Martin (14, Masculin)",
      weapon: "fleuret",
      competitionType: "Circuit Jeunes",
      tags: ["jeunes", "technique fleuret"],
      uploadedAt: "il y a 1 semaine",
      commentVisibility: "private",
    },
    {
      id: "3",
      title: "Tournoi de Club - Sabre",
      thumbnail: "https://placehold.co/400x225?text=Video+3",
      duration: "15:22",
      views: 234,
      comments: 15,
      athlete: "Sophie Laurent (17, Féminin)",
      weapon: "sabre",
      competitionType: "Tournoi de Club",
      tags: ["sabre", "tournoi", "avancé"],
      uploadedAt: "il y a 3 jours",
      commentVisibility: "public",
    },
  ]

  const [filteredVideos, setFilteredVideos] = useState(videos)

  const handleFiltersChange = (filters: any) => {
    console.log("Filters changed:", filters)

    let filtered = [...videos]

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(searchTerm) ||
          video.athlete.toLowerCase().includes(searchTerm) ||
          video.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
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

          <RealTimeVideoFilters onFiltersChange={handleFiltersChange} totalResults={filteredVideos.length} />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>

          {filteredVideos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucune vidéo trouvée avec ces critères de recherche.</p>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
