"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, CheckCircle, AlertCircle, FileVideo } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface VideoFile {
  file: File
  preview: string
  progress: number
  status: "pending" | "uploading" | "completed" | "error"
  id: string
}

interface AthleteData {
  firstName: string
  lastName: string
  age: string
  gender: "male" | "female" | ""
  weapon: "foil" | "sabre" | "epee" | ""
  competitionType: string
}

export function SimplifiedUploadInterface() {
  const { user } = useAuth()
  const [videoFile, setVideoFile] = useState<VideoFile | null>(null)
  const [athleteData, setAthleteData] = useState<AthleteData>({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    weapon: "",
    competitionType: "",
  })

  const competitionTypes = [
    "Championnat Régional",
    "Championnat National",
    "Tournoi International",
    "Compétition Locale",
    "Match d'Entraînement",
    "Tournoi de Club",
    "Compétition Scolaire",
    "Circuit Jeunes",
    "Compétition Cadets",
    "Compétition Juniors",
  ]

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setVideoFile({
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        status: "pending",
        id: Math.random().toString(36).substr(2, 9),
      })
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".avi", ".mkv", ".webm"],
    },
    maxSize: 500 * 1024 * 1024,
    multiple: false,
  })

  const removeVideo = () => {
    if (videoFile) {
      URL.revokeObjectURL(videoFile.preview)
      setVideoFile(null)
    }
  }

  const simulateUpload = async () => {
    if (!videoFile) return

    setVideoFile((prev) => (prev ? { ...prev, status: "uploading" } : null))

    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      setVideoFile((prev) => (prev ? { ...prev, progress } : null))
    }

    setVideoFile((prev) => (prev ? { ...prev, status: "completed" } : null))
  }

  const isFormValid = () => {
    return (
      athleteData.firstName.trim() &&
      athleteData.lastName.trim() &&
      athleteData.age.trim() &&
      athleteData.gender &&
      athleteData.weapon &&
      athleteData.competitionType &&
      videoFile
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Video Upload Zone */}
      <Card>
        <CardHeader>
          <CardTitle>Télécharger une Vidéo</CardTitle>
          <CardDescription>
            Glissez-déposez votre vidéo ou cliquez pour sélectionner (MP4, MOV, AVI - max 500MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!videoFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              {isDragActive ? (
                <p className="text-xl">Déposez la vidéo ici...</p>
              ) : (
                <div>
                  <p className="text-xl mb-2">Glissez-déposez une vidéo ici</p>
                  <p className="text-sm text-muted-foreground">ou cliquez pour parcourir vos fichiers</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20">
              <div className="relative w-24 h-16 bg-muted rounded overflow-hidden">
                <video src={videoFile.preview} className="w-full h-full object-cover" muted />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <FileVideo className="h-6 w-6 text-white" />
                </div>
              </div>

              <div className="flex-1">
                <p className="font-medium">{videoFile.file.name}</p>
                <p className="text-sm text-muted-foreground">{(videoFile.file.size / (1024 * 1024)).toFixed(1)} MB</p>
                {videoFile.status === "uploading" && <Progress value={videoFile.progress} className="mt-2" />}
              </div>

              <div className="flex items-center gap-2">
                {videoFile.status === "completed" && <CheckCircle className="h-5 w-5 text-green-500" />}
                {videoFile.status === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
                <Button variant="ghost" size="icon" onClick={removeVideo}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Athlete Information Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de l'Athlète</CardTitle>
          <CardDescription>Renseignez les informations de l'athlète présent dans la vidéo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                placeholder="Prénom de l'athlète"
                value={athleteData.firstName}
                onChange={(e) => setAthleteData((prev) => ({ ...prev, firstName: e.target.value }))}
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                id="lastName"
                placeholder="Nom de famille"
                value={athleteData.lastName}
                onChange={(e) => setAthleteData((prev) => ({ ...prev, lastName: e.target.value }))}
                className="text-base"
              />
            </div>
          </div>

          {/* Age and Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="age">Âge *</Label>
              <Input
                id="age"
                type="number"
                min="6"
                max="25"
                placeholder="Âge de l'athlète"
                value={athleteData.age}
                onChange={(e) => setAthleteData((prev) => ({ ...prev, age: e.target.value }))}
                className="text-base"
              />
            </div>
            <div className="space-y-3">
              <Label>Sexe *</Label>
              <RadioGroup
                value={athleteData.gender}
                onValueChange={(value) => setAthleteData((prev) => ({ ...prev, gender: value as any }))}
                className="flex gap-8"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="text-base">
                    Masculin
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="text-base">
                    Féminin
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Weapon and Competition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weapon">Arme *</Label>
              <Select
                value={athleteData.weapon}
                onValueChange={(value) => setAthleteData((prev) => ({ ...prev, weapon: value as any }))}
              >
                <SelectTrigger className="text-base">
                  <SelectValue placeholder="Sélectionnez l'arme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="foil">Fleuret</SelectItem>
                  <SelectItem value="sabre">Sabre</SelectItem>
                  <SelectItem value="epee">Épée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="competition">Type de Compétition *</Label>
              <Select
                value={athleteData.competitionType}
                onValueChange={(value) => setAthleteData((prev) => ({ ...prev, competitionType: value }))}
              >
                <SelectTrigger className="text-base">
                  <SelectValue placeholder="Type de compétition" />
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
          </div>
        </CardContent>
      </Card>

      {/* Validation Alert */}
      {!isFormValid() && videoFile && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Veuillez remplir tous les champs obligatoires avant de télécharger la vidéo.
          </AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" size="lg">
          Sauvegarder comme Brouillon
        </Button>
        <Button size="lg" onClick={simulateUpload} disabled={!isFormValid() || videoFile?.status === "uploading"}>
          {videoFile?.status === "uploading" ? "Téléchargement..." : "Publier la Vidéo"}
        </Button>
      </div>
    </div>
  )
}
