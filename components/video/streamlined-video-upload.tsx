"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Upload,
  X,
  Check,
  ChevronsUpDown,
  User,
  Calendar,
  Users,
  Sword,
  Trophy,
  Tag,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Athlete {
  id: string
  name: string
  age: number
  gender: "M" | "F"
  weapons: string[]
  club: string
}

interface UploadedFile {
  file: File
  progress: number
  status: "uploading" | "completed" | "error"
}

const mockAthletes: Athlete[] = [
  { id: "1", name: "Marie Dubois", age: 16, gender: "F", weapons: ["Fleuret", "Épée"], club: "Club d'Escrime Paris" },
  { id: "2", name: "Pierre Martin", age: 17, gender: "M", weapons: ["Sabre"], club: "Escrime Lyon" },
  { id: "3", name: "Sophie Laurent", age: 15, gender: "F", weapons: ["Fleuret"], club: "Club d'Escrime Marseille" },
  { id: "4", name: "Lucas Bernard", age: 18, gender: "M", weapons: ["Épée", "Sabre"], club: "Escrime Toulouse" },
  {
    id: "5",
    name: "Emma Moreau",
    age: 16,
    gender: "F",
    weapons: ["Fleuret", "Sabre", "Épée"],
    club: "Club d'Escrime Nice",
  },
]

const weapons = ["Fleuret", "Sabre", "Épée"]

const competitionTypes = [
  "Compétition locale",
  "Championnat régional",
  "Championnat national",
  "Coupe de France",
  "Championnat d'Europe",
  "Championnat du monde",
  "Jeux Olympiques",
  "Tournoi international",
  "Challenge jeunes",
  "Coupe cadets",
  "Championnat juniors",
  "Grand Prix",
  "Épreuve satellite",
  "Match amical",
]

const popularTags = [
  "Technique",
  "Tactique",
  "Attaque",
  "Défense",
  "Parade",
  "Riposte",
  "Entraînement",
  "Compétition",
  "Analyse",
  "Progression",
]

export function StreamlinedVideoUpload() {
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null)
  const [selectedWeapon, setSelectedWeapon] = useState("")
  const [competitionType, setCompetitionType] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isAthleteOpen, setIsAthleteOpen] = useState(false)
  const [athleteSearch, setAthleteSearch] = useState("")

  const filteredAthletes = mockAthletes.filter(
    (athlete) =>
      athlete.name.toLowerCase().includes(athleteSearch.toLowerCase()) ||
      athlete.club.toLowerCase().includes(athleteSearch.toLowerCase()),
  )

  const handleFileUpload = useCallback((uploadedFiles: FileList | null) => {
    if (!uploadedFiles) return

    const newFiles: UploadedFile[] = Array.from(uploadedFiles).map((file) => ({
      file,
      progress: 0,
      status: "uploading" as const,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Simulate upload progress
    newFiles.forEach((uploadFile, index) => {
      const interval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => (f.file === uploadFile.file ? { ...f, progress: Math.min(f.progress + 10, 100) } : f)),
        )
      }, 200)

      setTimeout(
        () => {
          clearInterval(interval)
          setFiles((prev) =>
            prev.map((f) => (f.file === uploadFile.file ? { ...f, progress: 100, status: "completed" } : f)),
          )
        },
        2000 + index * 500,
      )
    })
  }, [])

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = () => {
    if (!selectedAthlete || !selectedWeapon || !competitionType || files.length === 0) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    console.log("Submitting:", {
      athlete: selectedAthlete,
      weapon: selectedWeapon,
      competitionType,
      tags,
      files: files.map((f) => f.file.name),
    })
  }

  const isWeaponCompatible = selectedAthlete && selectedWeapon ? selectedAthlete.weapons.includes(selectedWeapon) : true

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Téléchargement de Vidéo Simplifié
          </CardTitle>
          <CardDescription>
            Interface simplifiée pour télécharger des vidéos d'escrime avec toutes les informations nécessaires
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Section */}
          <div className="space-y-4">
            <Label htmlFor="video-upload" className="text-base font-medium">
              Fichiers Vidéo *
            </Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium">Glissez-déposez vos vidéos ici</p>
                <p className="text-sm text-muted-foreground">ou cliquez pour sélectionner des fichiers</p>
                <Input
                  id="video-upload"
                  type="file"
                  multiple
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
                <Button variant="outline" onClick={() => document.getElementById("video-upload")?.click()}>
                  Sélectionner des fichiers
                </Button>
              </div>
            </div>

            {/* Upload Progress */}
            {files.length > 0 && (
              <div className="space-y-3">
                {files.map((file, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{file.file.name}</span>
                      <span className="text-muted-foreground">
                        {file.status === "completed" ? "Terminé" : `${file.progress}%`}
                      </span>
                    </div>
                    <Progress value={file.progress} className="h-2" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Athlete Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Sélection d'Athlète *
            </Label>
            <Popover open={isAthleteOpen} onOpenChange={setIsAthleteOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isAthleteOpen}
                  className="w-full justify-between bg-transparent"
                >
                  {selectedAthlete ? selectedAthlete.name : "Sélectionner un athlète..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Rechercher un athlète..."
                    value={athleteSearch}
                    onValueChange={setAthleteSearch}
                  />
                  <CommandList>
                    <CommandEmpty>Aucun athlète trouvé.</CommandEmpty>
                    <CommandGroup>
                      {filteredAthletes.map((athlete) => (
                        <CommandItem
                          key={athlete.id}
                          value={athlete.name}
                          onSelect={() => {
                            setSelectedAthlete(athlete)
                            setIsAthleteOpen(false)
                            setAthleteSearch("")
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedAthlete?.id === athlete.id ? "opacity-100" : "opacity-0",
                            )}
                          />
                          <div className="flex flex-col">
                            <span className="font-medium">{athlete.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {athlete.age} ans • {athlete.gender === "M" ? "Homme" : "Femme"} •{" "}
                              {athlete.weapons.join(", ")}
                            </span>
                            <span className="text-xs text-muted-foreground">{athlete.club}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Athlete Details Display */}
            {selectedAthlete && (
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedAthlete.age} ans</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedAthlete.gender === "M" ? "Homme" : "Femme"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sword className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedAthlete.weapons.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{selectedAthlete.club}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Weapon Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <Sword className="h-4 w-4" />
              Sélection d'Arme *
            </Label>
            <Select value={selectedWeapon} onValueChange={setSelectedWeapon}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une arme..." />
              </SelectTrigger>
              <SelectContent>
                {weapons.map((weapon) => (
                  <SelectItem key={weapon} value={weapon}>
                    {weapon}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Weapon Compatibility Warning */}
            {selectedAthlete && selectedWeapon && !isWeaponCompatible && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Attention: {selectedAthlete.name} ne pratique habituellement pas le {selectedWeapon}. Armes
                  pratiquées: {selectedAthlete.weapons.join(", ")}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Competition Type */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Type de Compétition *
            </Label>
            <Select value={competitionType} onValueChange={setCompetitionType}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type de compétition..." />
              </SelectTrigger>
              <SelectContent>
                {competitionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </Label>

            {/* Popular Tags */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Tags populaires:</p>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    onClick={() => addTag(tag)}
                    disabled={tags.includes(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Tag Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Ajouter un tag personnalisé..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTag(newTag)}
              />
              <Button onClick={() => addTag(newTag)} disabled={!newTag}>
                Ajouter
              </Button>
            </div>

            {/* Selected Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              onClick={handleSubmit}
              className="w-full"
              size="lg"
              disabled={!selectedAthlete || !selectedWeapon || !competitionType || files.length === 0}
            >
              Télécharger les Vidéos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
