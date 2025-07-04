"use client"

import { useState } from "react"
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

interface HorizontalVideoFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  totalResults: number
}

export function HorizontalVideoFilters({ onFiltersChange, totalResults }: HorizontalVideoFiltersProps) {
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

  const updateFilter = (key: keyof FilterState, value: string) => {
    const updated = { ...filters, [key]: value }
    setFilters(updated)
    onFiltersChange(updated)
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
    onFiltersChange(clearedFilters)
  }

  const getActiveFilterCount = () => {
    return Object.values(filters).filter((value) => value !== "").length
  }

  const removeFilter = (key: keyof FilterState) => {
    updateFilter(key, "")
  }

  return (
    <div className="space-y-4">
      {/* Main Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/20 rounded-lg">
        {/* Search */}
        <div className="relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search videos..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Weapon Filter */}
        <Select value={filters.weapon} onValueChange={(value) => updateFilter("weapon", value)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Weapon" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="allWeapons">All Weapons</SelectItem>
            <SelectItem value="foil">Foil</SelectItem>
            <SelectItem value="sabre">Sabre</SelectItem>
            <SelectItem value="epee">Épée</SelectItem>
          </SelectContent>
        </Select>

        {/* Age Range Filter */}
        <Select value={filters.ageRange} onValueChange={(value) => updateFilter("ageRange", value)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Age" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="allAges">All Ages</SelectItem>
            <SelectItem value="6-10">6-10 years</SelectItem>
            <SelectItem value="11-14">11-14 years</SelectItem>
            <SelectItem value="15-18">15-18 years</SelectItem>
            <SelectItem value="19-25">19-25 years</SelectItem>
          </SelectContent>
        </Select>

        {/* Gender Filter */}
        <Select value={filters.gender} onValueChange={(value) => updateFilter("gender", value)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="allGenders">All Genders</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        {/* Skill Level Filter */}
        <Select value={filters.skillLevel} onValueChange={(value) => updateFilter("skillLevel", value)}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Skill Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="allLevels">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
            <SelectItem value="elite">Elite</SelectItem>
          </SelectContent>
        </Select>

        {/* Competition Type Filter */}
        <Select value={filters.competitionType} onValueChange={(value) => updateFilter("competitionType", value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Competition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="allCompetitions">All Competitions</SelectItem>
            <SelectItem value="regional">Regional</SelectItem>
            <SelectItem value="national">National</SelectItem>
            <SelectItem value="international">International</SelectItem>
            <SelectItem value="local">Local</SelectItem>
            <SelectItem value="training">Training</SelectItem>
          </SelectContent>
        </Select>

        {/* Comment Visibility Filter */}
        <Select value={filters.commentVisibility} onValueChange={(value) => updateFilter("commentVisibility", value)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Comments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="allComments">All Comments</SelectItem>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="private">Private</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {getActiveFilterCount() > 0 && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Clear ({getActiveFilterCount()})
          </Button>
        )}

        {/* Results Count */}
        <div className="ml-auto text-sm text-muted-foreground">{totalResults} videos found</div>
      </div>

      {/* Active Filters */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null
            return (
              <Badge key={key} variant="secondary" className="gap-1">
                <span className="capitalize">{key}:</span>
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
