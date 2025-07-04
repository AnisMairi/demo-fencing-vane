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
import { Upload, X, Play, CheckCircle, AlertCircle, FileVideo } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface VideoFile {
  file: File
  preview: string
  progress: number
  status: "pending" | "uploading" | "processing" | "completed" | "error"
  id: string
}

interface VideoMetadata {
  athleteFirstName: string
  athleteLastName: string
  age: string
  gender: "male" | "female" | ""
  weapon: "foil" | "sabre" | "epee" | ""
  competitionType: string
}

export function SimplifiedVideoUpload() {
  const { user } = useAuth()
  const [videoFiles, setVideoFiles] = useState<VideoFile[]>([])
  const [metadata, setMetadata] = useState<VideoMetadata>({
    athleteFirstName: "",
    athleteLastName: "",
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
    "Compétition Seniors",
  ]

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: "pending" as const,
      id: Math.random().toString(36).substr(2, 9),
    }))
    setVideoFiles((prev) => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".avi", ".mkv", ".webm"],
    },
    maxSize: 500 * 1024 * 1024, // 500MB
    multiple: false, // Only allow single file upload for simplicity
  })

  const removeFile = (id: string) => {
    setVideoFiles((prev) => {
      const file = prev.find((f) => f.id === id)
      if (file) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter((f) => f.id !== id)
    })
  }

  const simulateUpload = async (fileId: string) => {
    const fileIndex = videoFiles.findIndex((f) => f.id === fileId)
    if (fileIndex === -1) return

    setVideoFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "uploading" } : f)))

    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      setVideoFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress } : f)))
    }

    setVideoFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "processing" } : f)))
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setVideoFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "completed" } : f)))
  }

  const handleUpload = async () => {
    const pendingFiles = videoFiles.filter((f) => f.status === "pending")
    for (const file of pendingFiles) {
      await simulateUpload(file.id)
    }
  }

  const isFormValid = () => {
    return (
      metadata.athleteFirstName.trim() &&
      metadata.athleteLastName.trim() &&
      metadata.age.trim() &&
      metadata.gender &&
      metadata.weapon &&
      metadata.competitionType &&
      videoFiles.length > 0
    )
  }

  const getStatusIcon = (status: VideoFile["status"]) => {
    switch (status) {
      case "pending":
        return <FileVideo className="h-4 w-4 text-muted-foreground" />
      case "uploading":
        return <Upload className="h-4 w-4 text-blue-500 animate-pulse" />
      case "processing":
        return <Play className="h-4 w-4 text-yellow-500 animate-spin" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Video Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Télécharger une Vidéo</CardTitle>
          <CardDescription>
            Téléchargez une vidéo d'escrime pour analyse. Formats supportés: MP4, MOV, AVI, MKV, WebM (max 500MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            {isDragActive ? (
              <p className="text-lg">Déposez la vidéo ici...</p>
            ) : (
              <div>
                <p className="text-lg mb-2">Glissez-déposez une vidéo ici, ou cliquez pour sélectionner</p>
                <p className="text-sm text-muted-foreground">Une seule vidéo à la fois</p>
              </div>
            )}
          </div>

          {videoFiles.length > 0 && (
            <div className="mt-6 space-y-4">
              <h4 className="font-medium">Vidéo Sélectionnée</h4>
              {videoFiles.map((videoFile) => (
                <div key={videoFile.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="relative w-20 h-12 bg-muted rounded overflow-hidden">
                    <video src={videoFile.preview} className="w-full h-full object-cover" muted />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{videoFile.file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(videoFile.file.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                    {videoFile.status === "uploading" && <Progress value={videoFile.progress} className="mt-2" />}
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusIcon(videoFile.status)}
                    <span className="text-sm capitalize">{videoFile.status}</span>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(videoFile.id)}
                    disabled={videoFile.status === "uploading" || videoFile.status === "processing"}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Athlete Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de l'Athlète</CardTitle>
          <CardDescription>Informations requises sur l'athlète dans la vidéo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                placeholder="Entrez le prénom"
                value={metadata.athleteFirstName}
                onChange={(e) =>
                  setMetadata((prev) => ({
                    ...prev,
                    athleteFirstName: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                id="lastName"
                placeholder="Entrez le nom"
                value={metadata.athleteLastName}
                onChange={(e) =>
                  setMetadata((prev) => ({
                    ...prev,
                    athleteLastName: e.target.value,
                  }))
                }
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="age">Âge *</Label>
              <Input
                id="age"
                type="number"
                min="6"
                max="25"
                placeholder="Entrez l'âge"
                value={metadata.age}
                onChange={(e) =>
                  setMetadata((prev) => ({
                    ...prev,
                    age: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Sexe *</Label>
              <RadioGroup
                value={metadata.gender}
                onValueChange={(value) =>
                  setMetadata((prev) => ({
                    ...prev,
                    gender: value as any,
                  }))
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Masculin</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Féminin</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="weapon">Arme *</Label>
              <Select
                value={metadata.weapon}
                onValueChange={(value) => setMetadata((prev) => ({ ...prev, weapon: value as any }))}
              >
                <SelectTrigger>
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
              <Label htmlFor="competitionType">Type de Compétition *</Label>
              <Select
                value={metadata.competitionType}
                onValueChange={(value) => setMetadata((prev) => ({ ...prev, competitionType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type" />
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

      {/* Form Validation Alert */}
      {!isFormValid() && videoFiles.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Veuillez remplir tous les champs obligatoires: Prénom, Nom, Âge, Sexe, Arme et Type de compétition.
          </AlertDescription>
        </Alert>
      )}

      {/* Submit Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Sauvegarder comme Brouillon</Button>
        <Button
          onClick={handleUpload}
          disabled={
            !isFormValid() ||
            videoFiles.length === 0 ||
            videoFiles.some((f) => f.status === "uploading" || f.status === "processing")
          }
        >
          Télécharger la Vidéo
        </Button>
      </div>
    </div>
  )
}
