"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AthleteCard } from "./athlete-card"
import { Search, Users, Plus } from "lucide-react"
import Link from "next/link"

export function AthleteNavigation() {
  const [searchTerm, setSearchTerm] = useState("")
  const [weaponFilter, setWeaponFilter] = useState("all")
  const [skillFilter, setSkillFilter] = useState("all")

  // Mock athlete data
  const athletes = [
    {
      id: "1",
      firstName: "Marie",
      lastName: "Dubois",
      age: 16,
      gender: "female",
      weapon: "épée",
      skillLevel: "advanced",
      avatar: "https://placehold.co/64x64?text=MD",
      videosCount: 12,
      region: "Paris, France",
    },
    {
      id: "2",
      firstName: "Jean",
      lastName: "Martin",
      age: 14,
      gender: "male",
      weapon: "foil",
      skillLevel: "intermediate",
      avatar: "https://placehold.co/64x64?text=JM",
      videosCount: 8,
      region: "Lyon, France",
    },
    {
      id: "3",
      firstName: "Sophie",
      lastName: "Laurent",
      age: 17,
      gender: "female",
      weapon: "sabre",
      skillLevel: "advanced",
      avatar: "https://placehold.co/64x64?text=SL",
      videosCount: 15,
      region: "Marseille, France",
    },
    {
      id: "4",
      firstName: "Lucas",
      lastName: "Bernard",
      age: 13,
      gender: "male",
      weapon: "foil",
      skillLevel: "beginner",
      avatar: "https://placehold.co/64x64?text=LB",
      videosCount: 5,
      region: "Nice, France",
    },
  ]

  const filteredAthletes = athletes.filter((athlete) => {
    const matchesSearch =
      athlete.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      athlete.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesWeapon = weaponFilter === "all" || athlete.weapon === weaponFilter
    const matchesSkill = skillFilter === "all" || athlete.skillLevel === skillFilter

    return matchesSearch && matchesWeapon && matchesSkill
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Athletes ({filteredAthletes.length})
          </CardTitle>
          <Button size="sm" asChild>
            <Link href="/athletes/create">
              <Plus className="h-4 w-4 mr-1" />
              Add Athlete
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search athletes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={weaponFilter} onValueChange={setWeaponFilter}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Weapon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="foil">Foil</SelectItem>
              <SelectItem value="sabre">Sabre</SelectItem>
              <SelectItem value="épée">Épée</SelectItem>
            </SelectContent>
          </Select>
          <Select value={skillFilter} onValueChange={setSkillFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="elite">Elite</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Athletes Grid */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {filteredAthletes.map((athlete) => (
            <AthleteCard key={athlete.id} athlete={athlete} />
          ))}
        </div>

        {filteredAthletes.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No athletes found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
