"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { VideoCard } from "@/components/video/video-card"
import {
  Calendar,
  MapPin,
  Trophy,
  TrendingUp,
  Edit,
  Mail,
  User,
  Video,
  BarChart3,
  Target,
  Star,
  Clock,
  Activity,
} from "lucide-react"
import Link from "next/link"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

interface AthleteProfile {
  id: string
  firstName: string
  lastName: string
  age: number
  gender: string
  weapon: string
  skillLevel: string
  avatar: string
  region: string
  club: string
  coach: string
  email: string
  phone: string
  joinDate: string
  ranking: string
  bio: string
  parentalConsent: boolean
  imageRightsConsent: boolean
  gdprConsent: boolean
  consentDate: string
  stats: {
    totalVideos: number
    totalViews: number
    averageRating: number
    competitionsEntered: number
    wins: number
    losses: number
    winRate: number
    recentForm: string
  }
  evaluations: {
    posture: number
    speed: number
    positioning: number
    technique: number
    tactics: number
    overall: number
    lastEvaluated: string
    evaluatedBy: string
  }
  performanceHistory: {
    date: string
    competition: string
    result: string
    score: string
    rating: number
  }[]
  progressionData: {
    month: string
    technique: number
    physical: number
    tactical: number
    overall: number
  }[]
  videos: any[]
}

interface ComprehensiveAthleteProfileProps {
  athleteId: string
}

export function ComprehensiveAthleteProfile({ athleteId }: ComprehensiveAthleteProfileProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock athlete data with comprehensive information
  const athlete: AthleteProfile = {
    id: athleteId,
    firstName: "Marie",
    lastName: "Dubois",
    age: 16,
    gender: "female",
    weapon: "épée",
    skillLevel: "advanced",
    avatar: "https://placehold.co/200x200?text=Marie+Dubois",
    region: "Paris, France",
    club: "Cercle d'Escrime de Paris",
    coach: "Master Laurent",
    email: "marie.dubois@email.com",
    phone: "+33 1 23 45 67 89",
    joinDate: "September 2020",
    ranking: "#3 Regional U17",
    bio: "Passionate épée fencer with 6 years of experience. Specializes in tactical play and precise timing. Current regional champion in the U17 category.",
    parentalConsent: true,
    imageRightsConsent: true,
    gdprConsent: true,
    consentDate: "2023-09-15",
    stats: {
      totalVideos: 24,
      totalViews: 3250,
      averageRating: 4.8,
      competitionsEntered: 18,
      wins: 67,
      losses: 31,
      winRate: 68.4,
      recentForm: "8W-2L",
    },
    evaluations: {
      posture: 85,
      speed: 78,
      positioning: 92,
      technique: 88,
      tactics: 90,
      overall: 86,
      lastEvaluated: "2024-01-15",
      evaluatedBy: "Master Laurent",
    },
    performanceHistory: [
      {
        date: "2024-01-10",
        competition: "Championnat Régional Final",
        result: "1st Place",
        score: "15-12",
        rating: 95,
      },
      {
        date: "2023-12-15",
        competition: "Tournoi National Jeunes",
        result: "3rd Place",
        score: "15-13",
        rating: 88,
      },
      {
        date: "2023-11-20",
        competition: "Coupe de Paris",
        result: "2nd Place",
        score: "13-15",
        rating: 82,
      },
    ],
    progressionData: [
      { month: "Sep", technique: 75, physical: 70, tactical: 80, overall: 75 },
      { month: "Oct", technique: 78, physical: 72, tactical: 82, overall: 77 },
      { month: "Nov", technique: 80, physical: 75, tactical: 85, overall: 80 },
      { month: "Dec", technique: 85, physical: 78, tactical: 88, overall: 84 },
      { month: "Jan", technique: 88, physical: 80, tactical: 90, overall: 86 },
    ],
    videos: [
      {
        id: "1",
        title: "Championnat Régional Final - Épée",
        thumbnail: "https://placehold.co/400x225?text=Video+1",
        duration: "12:34",
        views: 156,
        comments: 8,
        athlete: "Marie Dubois (16, Féminin)",
        tags: ["final", "championnat"],
        uploadedAt: "il y a 2 jours",
        evaluation: { technique: 92, tactics: 88, overall: 90 },
      },
      {
        id: "2",
        title: "Entraînement Technique - Jeu de Jambes",
        thumbnail: "https://placehold.co/400x225?text=Video+2",
        duration: "8:45",
        views: 89,
        comments: 5,
        athlete: "Marie Dubois (16, Féminin)",
        tags: ["entraînement", "technique"],
        uploadedAt: "il y a 1 semaine",
        evaluation: { technique: 85, tactics: 80, overall: 82 },
      },
    ],
  }

  const radarData = [
    { subject: "Posture", A: athlete.evaluations.posture, fullMark: 100 },
    { subject: "Vitesse", A: athlete.evaluations.speed, fullMark: 100 },
    { subject: "Positionnement", A: athlete.evaluations.positioning, fullMark: 100 },
    { subject: "Technique", A: athlete.evaluations.technique, fullMark: 100 },
    { subject: "Tactique", A: athlete.evaluations.tactics, fullMark: 100 },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Profil Athlète</h1>
          <p className="text-muted-foreground">Suivi complet et analyse de performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/athletes/${athlete.id}/evaluate`}>
              <Star className="h-4 w-4 mr-2" />
              Évaluer
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/athletes/${athlete.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <img
                  src={athlete.avatar || "/placeholder.svg"}
                  alt={`${athlete.firstName} ${athlete.lastName}`}
                  className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary/10"
                />
                <div>
                  <h2 className="text-2xl font-bold">
                    {athlete.firstName} {athlete.lastName}
                  </h2>
                  <p className="text-muted-foreground">{athlete.club}</p>
                  <Badge variant="outline" className="mt-2">
                    {athlete.ranking}
                  </Badge>
                </div>

                <div className="flex justify-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {athlete.weapon}
                  </Badge>
                  <Badge variant="secondary">{athlete.skillLevel}</Badge>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {athlete.age} ans • {athlete.gender}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{athlete.region}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Coach: {athlete.coach}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{athlete.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GDPR Compliance Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Conformité RGPD</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Consentement parental</span>
                <Badge variant={athlete.parentalConsent ? "default" : "destructive"}>
                  {athlete.parentalConsent ? "✓" : "✗"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Droits à l'image</span>
                <Badge variant={athlete.imageRightsConsent ? "default" : "destructive"}>
                  {athlete.imageRightsConsent ? "✓" : "✗"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Consentement RGPD</span>
                <Badge variant={athlete.gdprConsent ? "default" : "destructive"}>
                  {athlete.gdprConsent ? "✓" : "✗"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Consenti le {athlete.consentDate}</p>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Statistiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{athlete.stats.totalVideos}</div>
                  <div className="text-xs text-muted-foreground">Vidéos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{athlete.stats.wins}</div>
                  <div className="text-xs text-muted-foreground">Victoires</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{athlete.stats.winRate}%</div>
                  <div className="text-xs text-muted-foreground">Taux Victoire</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{athlete.stats.competitionsEntered}</div>
                  <div className="text-xs text-muted-foreground">Compétitions</div>
                </div>
              </div>
              <div className="text-center pt-2 border-t">
                <div className="text-lg font-semibold">{athlete.stats.recentForm}</div>
                <div className="text-xs text-muted-foreground">Forme Récente (10 derniers)</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="videos">Vidéos ({athlete.videos.length})</TabsTrigger>
              <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
              <TabsTrigger value="progression">Progression</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Current Evaluation Overview */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Évaluation Actuelle
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Note Globale</span>
                        <span className="font-bold text-lg">{athlete.evaluations.overall}/100</span>
                      </div>
                      <Progress value={athlete.evaluations.overall} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span>Technique</span>
                        <span className="font-medium">{athlete.evaluations.technique}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tactique</span>
                        <span className="font-medium">{athlete.evaluations.tactics}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Posture</span>
                        <span className="font-medium">{athlete.evaluations.posture}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vitesse</span>
                        <span className="font-medium">{athlete.evaluations.speed}</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      Dernière évaluation: {athlete.evaluations.lastEvaluated} par {athlete.evaluations.evaluatedBy}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Radar des Compétences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar name="Compétences" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Performances Récentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {athlete.performanceHistory.slice(0, 3).map((performance, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div>
                          <div className="font-medium">{performance.competition}</div>
                          <div className="text-sm text-muted-foreground">{performance.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{performance.result}</div>
                          <div className="text-sm text-muted-foreground">{performance.score}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">{performance.rating}/100</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="videos" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Toutes les Vidéos ({athlete.videos.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {athlete.videos.map((video) => (
                      <div key={video.id} className="space-y-2">
                        <VideoCard video={video} />
                        {video.evaluation && (
                          <div className="text-xs text-muted-foreground px-2">
                            <strong>Évaluation:</strong> Technique {video.evaluation.technique} • Tactique{" "}
                            {video.evaluation.tactics} • Global {video.evaluation.overall}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="evaluations" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Détail des Évaluations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(athlete.evaluations)
                      .filter(([key]) => !["lastEvaluated", "evaluatedBy", "overall"].includes(key))
                      .map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="capitalize">
                              {key === "posture"
                                ? "Posture"
                                : key === "speed"
                                  ? "Vitesse"
                                  : key === "positioning"
                                    ? "Positionnement"
                                    : key === "technique"
                                      ? "Technique"
                                      : "Tactique"}
                            </span>
                            <span className="font-medium">{value}/100</span>
                          </div>
                          <Progress value={value as number} className="h-2" />
                        </div>
                      ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Historique des Évaluations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-muted/20 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">Évaluation Complète</div>
                            <div className="text-sm text-muted-foreground">15 janvier 2024</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-primary">86/100</div>
                            <div className="text-xs text-muted-foreground">Master Laurent</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-muted/20 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">Évaluation Technique</div>
                            <div className="text-sm text-muted-foreground">20 décembre 2023</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-primary">82/100</div>
                            <div className="text-xs text-muted-foreground">Coach Martin</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="progression" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Évolution des Performances
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={athlete.progressionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="technique" stroke="#8884d8" name="Technique" />
                      <Line type="monotone" dataKey="physical" stroke="#82ca9d" name="Physique" />
                      <Line type="monotone" dataKey="tactical" stroke="#ffc658" name="Tactique" />
                      <Line type="monotone" dataKey="overall" stroke="#ff7300" name="Global" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Historique Complet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {athlete.performanceHistory.map((performance, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
                        <div className="flex-shrink-0">
                          <Trophy
                            className={`h-8 w-8 ${
                              performance.result.includes("1st")
                                ? "text-yellow-600"
                                : performance.result.includes("2nd")
                                  ? "text-gray-600"
                                  : performance.result.includes("3rd")
                                    ? "text-orange-600"
                                    : "text-blue-600"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{performance.competition}</h4>
                          <p className="text-sm text-muted-foreground">{performance.date}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{performance.result}</div>
                          <div className="text-sm text-muted-foreground">{performance.score}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary text-lg">{performance.rating}</div>
                          <div className="text-xs text-muted-foreground">Note</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
