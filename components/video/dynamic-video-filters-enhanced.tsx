"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Search, Filter, RotateCcw, X } from "lucide-react"

interface FilterState {
  search: string
  weapon: string
  ageRange: [number, number]
  gender: string
  region: string
  level: string
  competitionType: string
  dateRange: string
}

interface DynamicVideoFiltersEnhancedProps {
  onFiltersChange: (filters: FilterState) => void
  totalResults: number
}

export function DynamicVideoFiltersEnhanced({ onFiltersChange, totalResults }: DynamicVideoFiltersEnhancedProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    weapon: "all",
    ageRange: [6, 25],
    gender: "all",
    region: "all",
    level: "all",
    competitionType: "all",
    dateRange: "all",
  })

  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onFiltersChange(filters)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [filters, onFiltersChange])

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      weapon: "all",
      ageRange: [6, 25],
      gender: "all",
      region: "all",
      level: "all",
      competitionType: "all",
      dateRange: "all",
    })
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.search) count++
    if (filters.weapon !== "all") count++
    if (filters.ageRange[0] !== 6 || filters.ageRange[1] !== 25) count++
    if (filters.gender !== "all") count++
    if (filters.region !== "all") count++
    if (filters.level !== "all") count++
    if (filters.competitionType !== "all") count++
    if (filters.dateRange !== "all") count++
    return count
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
            {getActiveFilterCount() > 0 && <Badge variant="secondary">{getActiveFilterCount()}</Badge>}
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{totalResults} vidéos</span>
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "Réduire" : "Étendre"}
            </Button>
            {getActiveFilterCount() > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Effacer
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, athlète, tags..."
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

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          {["foil", "sabre", "epee"].map((weapon) => (
            <Button
              key={weapon}
              variant={filters.weapon === weapon ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("weapon", filters.weapon === weapon ? "all" : weapon)}
              className="capitalize"
            >
              {weapon === "foil" ? "Fleuret" : weapon === "sabre" ? "Sabre" : "Épée"}
            </Button>
          ))}
        </div>

        {isExpanded && (
          <div className="space-y-6 pt-4 border-t">
            {/* Age Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Âge: {filters.ageRange[0]} - {filters.ageRange[1]} ans
              </label>
              <Slider
                value={filters.ageRange}
                onValueChange={(value) => updateFilter("ageRange", value as [number, number])}
                min={6}
                max={25}
                step={1}
                className="w-full"
              />
            </div>

            {/* Other Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sexe</label>
                <Select value={filters.gender} onValueChange={(value) => updateFilter("gender", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="male">Masculin</SelectItem>
                    <SelectItem value="female">Féminin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Niveau</label>
                <Select value={filters.level} onValueChange={(value) => updateFilter("level", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous niveaux</SelectItem>
                    <SelectItem value="beginner">Débutant</SelectItem>
                    <SelectItem value="intermediate">Intermédiaire</SelectItem>
                    <SelectItem value="advanced">Avancé</SelectItem>
                    <SelectItem value="elite">Elite</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Région</label>
                <Select value={filters.region} onValueChange={(value) => updateFilter("region", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes régions</SelectItem>
                    <SelectItem value="paris">Île-de-France</SelectItem>
                    <SelectItem value="lyon">Auvergne-Rhône-Alpes</SelectItem>
                    <SelectItem value="marseille">Provence-Alpes-Côte d'Azur</SelectItem>
                    <SelectItem value="toulouse">Occitanie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type de Compétition</label>
                <Select
                  value={filters.competitionType}
                  onValueChange={(value) => updateFilter("competitionType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous types</SelectItem>
                    <SelectItem value="regional">Championnat Régional</SelectItem>
                    <SelectItem value="national">Championnat National</SelectItem>
                    <SelectItem value="international">Tournoi International</SelectItem>
                    <SelectItem value="local">Compétition Locale</SelectItem>
                    <SelectItem value="training">Entraînement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Période</label>
                <Select value={filters.dateRange} onValueChange={(value) => updateFilter("dateRange", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toute période</SelectItem>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="month">Ce mois</SelectItem>
                    <SelectItem value="quarter">Ce trimestre</SelectItem>
                    <SelectItem value="year">Cette année</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
