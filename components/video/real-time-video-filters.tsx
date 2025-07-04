"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, X, RotateCcw } from "lucide-react"

interface FilterState {
  search: string
  weapon: string
  ageRange: string
  gender: string
  region: string
  skillLevel: string
  competitionType: string
  commentVisibility: string
}

interface RealTimeVideoFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  totalResults: number
}

export function RealTimeVideoFilters({ onFiltersChange, totalResults }: RealTimeVideoFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    weapon: "allWeapons",
    ageRange: "allAges",
    gender: "allGenders",
    region: "",
    skillLevel: "allLevels",
    competitionType: "allCompetitions",
    commentVisibility: "allComments",
  })

  // Real-time search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onFiltersChange(filters)
    }, 300) // 300ms debounce for search

    return () => clearTimeout(debounceTimer)
  }, [filters, onFiltersChange])

  const updateFilter = (key: keyof FilterState, value: string) => {
    const updated = { ...filters, [key]: value }
    setFilters(updated)
  }

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      search: "",
      weapon: "allWeapons",
      ageRange: "allAges",
      gender: "allGenders",
      region: "",
      skillLevel: "allLevels",
      competitionType: "allCompetitions",
      commentVisibility: "allComments",
    }
    setFilters(clearedFilters)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.search) count++
    if (filters.weapon !== "allWeapons") count++
    if (filters.ageRange !== "allAges") count++
    if (filters.gender !== "allGenders") count++
    if (filters.region) count++
    if (filters.skillLevel !== "allLevels") count++
    if (filters.competitionType !== "allCompetitions") count++
    if (filters.commentVisibility !== "allComments") count++
    return count
  }

  const removeFilter = (key: keyof FilterState) => {
    if (key === "search") {
      updateFilter(key, "")
    } else {
      const defaultValues: Record<string, string> = {
        weapon: "allWeapons",
        ageRange: "allAges",
        gender: "allGenders",
        region: "",
        skillLevel: "allLevels",
        competitionType: "allCompetitions",
        commentVisibility: "allComments",
      }
      updateFilter(key, defaultValues[key] || "")
    }
  }

  return (
    <div className="space-y-4">
      {/* Main Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/20 rounded-lg">
        {/* Search with real-time filtering */}
        <div className="relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des vidéos..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10"
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
              onClick={() => updateFilter("search", "")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Weapon Filter */}
        <Select value={filters.weapon} onValueChange={(value) => updateFilter("weapon", value)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Arme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="allWeapons">Toutes Armes</SelectItem>
            <SelectItem value="foil">Fleuret</SelectItem>
            <SelectItem value="sabre">Sabre</SelectItem>
            <SelectItem value="epee">Épée</SelectItem>
          </SelectContent>
        </Select>

        {/* Age Range Filter */}
        <Select value={filters.ageRange} onValueChange={(value) => updateFilter("ageRange", value)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Âge" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="allAges">Tous Âges</SelectItem>
            <SelectItem value="6-10">6-10 ans</SelectItem>
            <SelectItem value="11-14">11-14 ans</SelectItem>
            <SelectItem value="15-18">15-18 ans</SelectItem>
            <SelectItem value="19-25">19-25 ans</SelectItem>
          </SelectContent>
        </Select>

        {/* Gender Filter */}
        <Select value={filters.gender} onValueChange={(value) => updateFilter("gender", value)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Sexe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="allGenders">Tous</SelectItem>
            <SelectItem value="male">Masculin</SelectItem>
            <SelectItem value="female">Féminin</SelectItem>
          </SelectContent>
        </Select>

        {/* Skill Level Filter */}
        <Select value={filters.skillLevel} onValueChange={(value) => updateFilter("skillLevel", value)}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Niveau" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="allLevels">Tous Niveaux</SelectItem>
            <SelectItem value="beginner">Débutant</SelectItem>
            <SelectItem value="intermediate">Intermédiaire</SelectItem>
            <SelectItem value="advanced">Avancé</SelectItem>
            <SelectItem value="elite">Elite</SelectItem>
          </SelectContent>
        </Select>

        {/* Competition Type Filter */}
        <Select value={filters.competitionType} onValueChange={(value) => updateFilter("competitionType", value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Compétition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="allCompetitions">Toutes</SelectItem>
            <SelectItem value="regional">Régional</SelectItem>
            <SelectItem value="national">National</SelectItem>
            <SelectItem value="international">International</SelectItem>
            <SelectItem value="local">Local</SelectItem>
            <SelectItem value="training">Entraînement</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {getActiveFilterCount() > 0 && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Effacer ({getActiveFilterCount()})
          </Button>
        )}

        {/* Results Count */}
        <div className="ml-auto text-sm text-muted-foreground">
          {totalResults} vidéo{totalResults !== 1 ? "s" : ""} trouvée{totalResults !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Active Filters */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (!value || (typeof value === "string" && value.startsWith("all"))) return null

            const filterLabels: Record<string, string> = {
              search: "Recherche",
              weapon: "Arme",
              ageRange: "Âge",
              gender: "Sexe",
              region: "Région",
              skillLevel: "Niveau",
              competitionType: "Compétition",
              commentVisibility: "Commentaires",
            }

            return (
              <Badge key={key} variant="secondary" className="gap-1">
                <span>{filterLabels[key]}:</span>
                <span>{value}</span>
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => removeFilter(key as keyof FilterState)}
                />
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
