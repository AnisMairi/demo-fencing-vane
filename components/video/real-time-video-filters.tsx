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
  gender: string
  competitionLevel: string
  competitionType: string
  year: string
}

interface RealTimeVideoFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onFiltersChange: (filters: FilterState) => void;
  totalResults: number;
}

export function RealTimeVideoFilters({ filters, setFilters, onFiltersChange, totalResults }: RealTimeVideoFiltersProps) {
  // Remove local useState for filters
  // Real-time search effect (debounce)
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onFiltersChange(filters)
    }, 300)
    return () => clearTimeout(debounceTimer)
  }, [filters, onFiltersChange])

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const COMPETITION_GROUPS = [
    {
      level: "Local",
      competitions: [
        "Compétition locale",
        "Match amical",
        "Challenge club",
        "Interclubs"
      ]
    },
    {
      level: "Departmental",
      competitions: [
        "Compétition départementale",
        "Championnat départemental"
      ]
    },
    {
      level: "Regional",
      competitions: [
        "Compétition régionale",
        "Championnat régional",
        "Circuit régional",
        "Tournoi de zone"
      ]
    },
    {
      level: "National (France)",
      competitions: [
        "Circuit national M15",
        "Circuit national Cadets",
        "Circuit national Juniors",
        "Circuit national Seniors",
        "Circuit national Vétérans",
        "Championnat de France M15",
        "Championnat de France Cadets",
        "Championnat de France Juniors",
        "Championnat de France Seniors",
        "Championnat de France Vétérans",
        "Coupe de France (par équipes)",
        "Fête des Jeunes",
        "Sélection nationale"
      ]
    },
    {
      level: "European (EFC)",
      competitions: [
        "Championnat d'Europe Cadets",
        "Championnat d'Europe Juniors",
        "Championnat d'Europe Seniors",
        "Championnat d'Europe Vétérans",
        "Circuit Européen U14",
        "Circuit Européen Cadets (U17)",
        "Coupe d’Europe des clubs",
        "Jeux Européens"
      ]
    },
    {
      level: "International (FIE)",
      competitions: [
        "Épreuve satellite",
        "Coupe du Monde Cadets",
        "Coupe du Monde Juniors",
        "Coupe du Monde Seniors",
        "Grand Prix FIE",
        "Championnat du Monde Cadets",
        "Championnat du Monde Juniors",
        "Championnat du Monde Seniors",
        "Championnat du Monde Vétérans",
        "Jeux Olympiques"
      ]
    }
  ]

  const clearFilters = () => {
    setFilters({
      search: "",
      weapon: "allWeapons",
      gender: "allGenders",
      competitionLevel: "allLevels",
      competitionType: "allCompetitions",
      year: "allYears",
    })
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.search) count++
    if (filters.weapon !== "allWeapons") count++
    if (filters.gender !== "allGenders") count++
    if (filters.competitionLevel && filters.competitionLevel !== "allLevels") count++
    if (filters.competitionType && filters.competitionType !== "allCompetitions") count++
    if (filters.year && filters.year !== "allYears") count++
    return count
  }

  const removeFilter = (key: keyof FilterState) => {
    if (key === "search") {
      updateFilter(key, "")
    } else if (key === "year") {
      updateFilter("year", "allYears")
    } else if (key === "competitionLevel") {
      updateFilter("competitionLevel", "allLevels")
      updateFilter("competitionType", "allCompetitions")
    } else if (key === "competitionType") {
      updateFilter("competitionType", "allCompetitions")
    } else {
      const defaultValues: Record<string, string> = {
        weapon: "allWeapons",
        gender: "allGenders",
        competitionLevel: "allLevels",
        competitionType: "allCompetitions",
        year: "allYears",
      }
      updateFilter(key, defaultValues[key] || "")
    }
  }

  return (
    <div className="space-y-4">
      {/* Main Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/20 rounded-lg">
        {/* Search with real-time filtering */}
        <div className="flex flex-col min-w-[200px]">
          <label className="block text-xs font-medium mb-1">Recherche</label>
          <div className="relative">
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
        </div>

        {/* Weapon Filter */}
        <div className="flex flex-col w-[120px]">
          <label className="block text-xs font-medium mb-1">Arme</label>
          <Select value={filters.weapon} onValueChange={(value) => updateFilter("weapon", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Arme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="allWeapons">Toutes Armes</SelectItem>
              <SelectItem value="foil">Fleuret</SelectItem>
              <SelectItem value="sabre">Sabre</SelectItem>
              <SelectItem value="epee">Épée</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Gender Filter */}
        <div className="flex flex-col w-[120px]">
          <label className="block text-xs font-medium mb-1">Sexe</label>
          <Select value={filters.gender} onValueChange={(value) => updateFilter("gender", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sexe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="allGenders">Tous</SelectItem>
              <SelectItem value="male">Masculin</SelectItem>
              <SelectItem value="female">Féminin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Competition Level Filter */}
        <div className="flex flex-col w-[180px]">
          <label className="block text-xs font-medium mb-1">Niveau compétition</label>
          <Select value={filters.competitionLevel} onValueChange={value => {
            updateFilter("competitionLevel", value)
            updateFilter("competitionType", "allCompetitions")
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="allLevels">Tous</SelectItem>
              {COMPETITION_GROUPS.map(group => (
                <SelectItem key={group.level} value={group.level}>{group.level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Competition Type Filter (only show if level selected) */}
        {filters.competitionLevel && filters.competitionLevel !== "allLevels" && (
          <div className="flex flex-col w-[220px]">
            <label className="block text-xs font-medium mb-1">Compétition</label>
            <Select value={filters.competitionType} onValueChange={value => updateFilter("competitionType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Compétition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="allCompetitions">Toutes</SelectItem>
                {COMPETITION_GROUPS.find(g => g.level === filters.competitionLevel)?.competitions.map(comp => (
                  <SelectItem key={comp} value={comp}>{comp}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Year Filter UI */}
        <div className="flex flex-col w-[120px]">
          <label className="block text-xs font-medium mb-1">Année</label>
          <Select value={filters.year} onValueChange={value => updateFilter("year", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="allYears">Toutes</SelectItem>
              {Array.from({ length: 10 }).map((_, i) => {
                const year = new Date().getFullYear() - i
                return (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters Button */}
        <div className="flex flex-col justify-end">
          <Button variant="outline" size="sm" onClick={clearFilters} className="mt-5">
            <RotateCcw className="h-4 w-4 mr-1" /> Réinitialiser
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (!value || (typeof value === "string" && ((key === "year") ? false : value.startsWith("all")))) return null
            if (key === "year") {
              if (filters.year === "allYears") return null
              return (
                <Badge key="year" variant="secondary" className="gap-1">
                  <span>Année:</span>
                  <span>{filters.year}</span>
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => updateFilter("year", "allYears")}
                  />
                </Badge>
              )
            }
            if (key === "competitionLevel") {
              if (filters.competitionLevel === "allLevels") return null
              // If competitionLevel is removed, also remove competitionType badge
              if (filters.competitionType === "allCompetitions") {
                return (
                  <Badge key="competitionLevel" variant="secondary" className="gap-1">
                    <span>Niveau:</span>
                    <span>{filters.competitionLevel}</span>
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => {
                        updateFilter("competitionLevel", "allLevels")
                        updateFilter("competitionType", "allCompetitions")
                      }}
                    />
                  </Badge>
                )
              }
              // If competitionType is not allCompetitions, show both badges
              return (
                <>
                  <Badge key="competitionLevel" variant="secondary" className="gap-1">
                    <span>Niveau:</span>
                    <span>{filters.competitionLevel}</span>
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => {
                        updateFilter("competitionLevel", "allLevels")
                        updateFilter("competitionType", "allCompetitions")
                      }}
                    />
                  </Badge>
                </>
              )
            }
            if (key === "competitionType") {
              if (filters.competitionType === "allCompetitions" || filters.competitionLevel === "allLevels") return null
              return (
                <Badge key="competitionType" variant="secondary" className="gap-1">
                  <span>Compétition:</span>
                  <span>{filters.competitionType}</span>
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => updateFilter("competitionType", "allCompetitions")}
                  />
                </Badge>
              )
            }
            const filterLabels: Record<string, string> = {
              search: "Recherche",
              weapon: "Arme",
              gender: "Sexe",
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
