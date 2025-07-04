import { ProtectedRoute } from "@/components/auth/protected-route"
import { Layout } from "@/components/layout/layout"
import { EnhancedAthleteCard } from "@/components/athlete/enhanced-athlete-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Users, Plus, Filter } from "lucide-react"
import Link from "next/link"

export default function AthletesPage() {
  // Mock athletes data
  const athletes = [
    {
      id: "1",
      firstName: "Marie",
      lastName: "Dubois",
      age: 16,
      gender: "female",
      weapon: "épée",
      skillLevel: "advanced",
      avatar: "https://placehold.co/200x200?text=Marie+Dubois",
      videosCount: 12,
      region: "Paris, France",
      club: "Cercle d'Escrime de Paris",
      coach: "Master Laurent",
      ranking: "#3 Regional U17",
      recentActivity: "2 days ago",
    },
    {
      id: "2",
      firstName: "Jean",
      lastName: "Martin",
      age: 14,
      gender: "male",
      weapon: "foil",
      skillLevel: "intermediate",
      avatar: "https://placehold.co/200x200?text=Jean+Martin",
      videosCount: 8,
      region: "Lyon, France",
      club: "Lyon Escrime Club",
      coach: "Coach Bernard",
      ranking: "#7 Regional U15",
      recentActivity: "1 week ago",
    },
    {
      id: "3",
      firstName: "Sophie",
      lastName: "Laurent",
      age: 17,
      gender: "female",
      weapon: "sabre",
      skillLevel: "advanced",
      avatar: "https://placehold.co/200x200?text=Sophie+Laurent",
      videosCount: 15,
      region: "Marseille, France",
      club: "Marseille Fencing Academy",
      coach: "Master Dubois",
      ranking: "#1 Regional U18",
      recentActivity: "3 days ago",
    },
    {
      id: "4",
      firstName: "Lucas",
      lastName: "Bernard",
      age: 13,
      gender: "male",
      weapon: "foil",
      skillLevel: "beginner",
      avatar: "https://placehold.co/200x200?text=Lucas+Bernard",
      videosCount: 5,
      region: "Nice, France",
      club: "Nice Fencing Club",
      coach: "Coach Martin",
      ranking: "Unranked",
      recentActivity: "5 days ago",
    },
    {
      id: "5",
      firstName: "Emma",
      lastName: "Rousseau",
      age: 15,
      gender: "female",
      weapon: "épée",
      skillLevel: "intermediate",
      avatar: "https://placehold.co/200x200?text=Emma+Rousseau",
      videosCount: 9,
      region: "Toulouse, France",
      club: "Toulouse Épée Club",
      coach: "Master Claire",
      ranking: "#5 Regional U16",
      recentActivity: "1 day ago",
    },
    {
      id: "6",
      firstName: "Thomas",
      lastName: "Moreau",
      age: 18,
      gender: "male",
      weapon: "sabre",
      skillLevel: "elite",
      avatar: "https://placehold.co/200x200?text=Thomas+Moreau",
      videosCount: 22,
      region: "Bordeaux, France",
      club: "Bordeaux Elite Fencing",
      coach: "Master Antoine",
      ranking: "#2 National U20",
      recentActivity: "4 hours ago",
    },
  ]

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Athletes</h1>
              <p className="text-muted-foreground">
                Discover and connect with talented young fencers from around the region
              </p>
            </div>
            <Button asChild>
              <Link href="/athletes/create">
                <Plus className="mr-2 h-4 w-4" />
                Add Athlete
              </Link>
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Athletes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="relative min-w-[250px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search athletes..." className="pl-10" />
                </div>

                <Select defaultValue="all-weapons">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Weapon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-weapons">All Weapons</SelectItem>
                    <SelectItem value="foil">Foil</SelectItem>
                    <SelectItem value="sabre">Sabre</SelectItem>
                    <SelectItem value="épée">Épée</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all-levels">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Skill Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-levels">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="elite">Elite</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all-ages">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Age Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-ages">All Ages</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="11-14">11-14 years</SelectItem>
                    <SelectItem value="15-18">15-18 years</SelectItem>
                    <SelectItem value="19-25">19-25 years</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all-regions">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-regions">All Regions</SelectItem>
                    <SelectItem value="paris">Paris</SelectItem>
                    <SelectItem value="lyon">Lyon</SelectItem>
                    <SelectItem value="marseille">Marseille</SelectItem>
                    <SelectItem value="toulouse">Toulouse</SelectItem>
                    <SelectItem value="bordeaux">Bordeaux</SelectItem>
                    <SelectItem value="nice">Nice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Athletes Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {athletes.map((athlete) => (
              <EnhancedAthleteCard key={athlete.id} athlete={athlete} />
            ))}
          </div>

          {/* Stats Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Platform Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{athletes.length}</div>
                  <div className="text-sm text-muted-foreground">Total Athletes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {athletes.reduce((sum, athlete) => sum + athlete.videosCount, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Videos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {new Set(athletes.map((athlete) => athlete.club)).size}
                  </div>
                  <div className="text-sm text-muted-foreground">Clubs Represented</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {new Set(athletes.map((athlete) => athlete.region)).size}
                  </div>
                  <div className="text-sm text-muted-foreground">Regions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
