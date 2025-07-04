"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Search, Filter, RotateCcw } from "lucide-react"

interface FilterState {
  search: string
  weapon: string[]
  ageRange: [number, number]
  gender: string[]
  region: string[]
  skillLevel: string[]
  competitionType: string[]
  commentVisibility: string[]
  dateRange: {
    from: string
    to: string
  }
}

interface DynamicVideoFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  totalResults: number
}

export function DynamicVideoFilters({ onFiltersChange, totalResults }: DynamicVideoFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    weapon: [],
    ageRange: [6, 25],
    gender: [],
    region: [],
    skillLevel: [],
    competitionType: [],
    commentVisibility: [],
    dateRange: {
      from: "",
      to: "",
    },
  })

  const [isExpanded, setIsExpanded] = useState(false)

  const weapons = ["foil", "sabre", "epee"]
  const genders = ["male", "female", "other"]
  const regions = [
    "North America",
    "Europe",
    "Asia",
    "South America",
    "Africa",
    "Oceania",
    "Local",
    "Regional",
    "National",
    "International",
  ]
  const skillLevels = ["beginner", "intermediate", "advanced", "elite"]
  const competitionTypes = [
    "Regional Championship",
    "National Championship",
    "International Tournament",
    "Local Competition",
    "Training Match",
    "Club Tournament",
    "School Competition",
    "Youth Circuit",
    "Cadet Competition",
    "Junior Competition",
    "Senior Competition",
  ]
  const visibilityOptions = ["public", "private"]

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFiltersChange(updated)
  }

  const toggleArrayFilter = (key: keyof FilterState, value: string) => {
    const currentArray = filters[key] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]

    updateFilters({ [key]: newArray })
  }

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      search: "",
      weapon: [],
      ageRange: [6, 25],
      gender: [],
      region: [],
      skillLevel: [],
      competitionType: [],
      commentVisibility: [],
      dateRange: {
        from: "",
        to: "",
      },
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.search) count++
    if (filters.weapon.length > 0) count++
    if (filters.ageRange[0] !== 6 || filters.ageRange[1] !== 25) count++
    if (filters.gender.length > 0) count++
    if (filters.region.length > 0) count++
    if (filters.skillLevel.length > 0) count++
    if (filters.competitionType.length > 0) count++
    if (filters.commentVisibility.length > 0) count++
    if (filters.dateRange.from || filters.dateRange.to) count++
    return count
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFilterCount()}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{totalResults} videos</span>
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "Collapse" : "Expand"}
            </Button>
            {getActiveFilterCount() > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Clear
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
            placeholder="Search videos, athletes, or comments..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="pl-10"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          {weapons.map((weapon) => (
            <Button
              key={weapon}
              variant={filters.weapon.includes(weapon) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleArrayFilter("weapon", weapon)}
              className="capitalize"
            >
              {weapon}
            </Button>
          ))}
        </div>

        {isExpanded && (
          <div className="space-y-6 pt-4 border-t">
            {/* Age Range */}
            <div className="space-y-2">
              <Label>
                Age Range: {filters.ageRange[0]} - {filters.ageRange[1]} years
              </Label>
              <Slider
                value={filters.ageRange}
                onValueChange={(value) => updateFilters({ ageRange: value as [number, number] })}
                min={6}
                max={25}
                step={1}
                className="w-full"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label>Gender</Label>
              <div className="flex flex-wrap gap-2">
                {genders.map((gender) => (
                  <div key={gender} className="flex items-center space-x-2">
                    <Checkbox
                      id={`gender-${gender}`}
                      checked={filters.gender.includes(gender)}
                      onCheckedChange={() => toggleArrayFilter("gender", gender)}
                    />
                    <Label htmlFor={`gender-${gender}`} className="capitalize">
                      {gender}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Region */}
            <div className="space-y-2">
              <Label>Region</Label>
              <div className="grid grid-cols-2 gap-2">
                {regions.map((region) => (
                  <div key={region} className="flex items-center space-x-2">
                    <Checkbox
                      id={`region-${region}`}
                      checked={filters.region.includes(region)}
                      onCheckedChange={() => toggleArrayFilter("region", region)}
                    />
                    <Label htmlFor={`region-${region}`} className="text-sm">
                      {region}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Level */}
            <div className="space-y-2">
              <Label>Skill Level</Label>
              <div className="flex flex-wrap gap-2">
                {skillLevels.map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <Checkbox
                      id={`skill-${level}`}
                      checked={filters.skillLevel.includes(level)}
                      onCheckedChange={() => toggleArrayFilter("skillLevel", level)}
                    />
                    <Label htmlFor={`skill-${level}`} className="capitalize">
                      {level}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Competition Type */}
            <div className="space-y-2">
              <Label>Competition Type</Label>
              <div className="space-y-2">
                {competitionTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`comp-${type}`}
                      checked={filters.competitionType.includes(type)}
                      onCheckedChange={() => toggleArrayFilter("competitionType", type)}
                    />
                    <Label htmlFor={`comp-${type}`} className="text-sm">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Comment Visibility */}
            <div className="space-y-2">
              <Label>Comment Visibility</Label>
              <div className="flex gap-4">
                {visibilityOptions.map((visibility) => (
                  <div key={visibility} className="flex items-center space-x-2">
                    <Checkbox
                      id={`visibility-${visibility}`}
                      checked={filters.commentVisibility.includes(visibility)}
                      onCheckedChange={() => toggleArrayFilter("commentVisibility", visibility)}
                    />
                    <Label htmlFor={`visibility-${visibility}`} className="capitalize">
                      {visibility}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label>Upload Date Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="date-from" className="text-xs">
                    From
                  </Label>
                  <Input
                    id="date-from"
                    type="date"
                    value={filters.dateRange.from}
                    onChange={(e) =>
                      updateFilters({
                        dateRange: { ...filters.dateRange, from: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="date-to" className="text-xs">
                    To
                  </Label>
                  <Input
                    id="date-to"
                    type="date"
                    value={filters.dateRange.to}
                    onChange={(e) =>
                      updateFilters({
                        dateRange: { ...filters.dateRange, to: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
