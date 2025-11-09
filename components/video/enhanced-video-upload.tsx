"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, Play, CheckCircle, AlertCircle, FileVideo, Lock, Globe } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { COMPETITION_TYPES } from "@/lib/utils"

interface VideoFile {
  file: File
  preview: string
  progress: number
  status: "pending" | "uploading" | "processing" | "completed" | "error"
  id: string
}

interface AthleteInfo {
  firstName: string
  lastName: string
  age: string
  gender: "male" | "female" | "other" | ""
}

interface VideoMetadata {
  athlete: AthleteInfo
  weapon: "foil" | "sabre" | "epee" | ""
  competitionType: string
  comments: string
  commentVisibility: "public" | "private"
}

export function EnhancedVideoUpload() {
  const { user } = useAuth()
  const [videoFiles, setVideoFiles] = useState<VideoFile[]>([])
  const [metadata, setMetadata] = useState<VideoMetadata>({
    athlete: {
      firstName: "",
      lastName: "",
      age: "",
      gender: "",
    },
    weapon: "",
    competitionType: "",
    comments: "",
    commentVisibility: "public",
  })

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
    multiple: true,
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

  const addTag = () => {
    // This function is no longer needed as tags are removed
  }

  const removeTag = (tagToRemove: string) => {
    // This function is no longer needed as tags are removed
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

  const handleUploadAll = async () => {
    const pendingFiles = videoFiles.filter((f) => f.status === "pending")
    for (const file of pendingFiles) {
      await simulateUpload(file.id)
    }
  }

  const isFormValid = () => {
    return (
      metadata.athlete.firstName.trim() &&
      metadata.athlete.lastName.trim() &&
      metadata.athlete.age.trim() &&
      metadata.athlete.gender &&
      metadata.weapon &&
      metadata.competitionType &&
      metadata.comments.trim() &&
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
      {/* Athlete Information */}
      <Card>
        <CardHeader>
          <CardTitle>Athlete Information</CardTitle>
          <CardDescription>Required information about the athlete in the video</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                placeholder="Enter first name"
                value={metadata.athlete.firstName}
                onChange={(e) =>
                  setMetadata((prev) => ({
                    ...prev,
                    athlete: { ...prev.athlete, firstName: e.target.value },
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="Enter last name"
                value={metadata.athlete.lastName}
                onChange={(e) =>
                  setMetadata((prev) => ({
                    ...prev,
                    athlete: { ...prev.athlete, lastName: e.target.value },
                  }))
                }
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                min="6"
                max="25"
                placeholder="Enter age"
                value={metadata.athlete.age}
                onChange={(e) =>
                  setMetadata((prev) => ({
                    ...prev,
                    athlete: { ...prev.athlete, age: e.target.value },
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Gender *</Label>
              <RadioGroup
                value={metadata.athlete.gender}
                onValueChange={(value) =>
                  setMetadata((prev) => ({
                    ...prev,
                    athlete: { ...prev.athlete, gender: value as any },
                  }))
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competition Details */}
      <Card>
        <CardHeader>
          <CardTitle>Competition Details</CardTitle>
          <CardDescription>Information about the competition and weapon used</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="weapon">Weapon *</Label>
              <Select
                value={metadata.weapon}
                onValueChange={(value) => setMetadata((prev) => ({ ...prev, weapon: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select weapon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="foil">Foil</SelectItem>
                  <SelectItem value="sabre">Sabre</SelectItem>
                  <SelectItem value="epee">Épée</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="competitionType">Competition Type *</Label>
              <Select
                value={metadata.competitionType}
                onValueChange={(value) => setMetadata((prev) => ({ ...prev, competitionType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select competition type" />
                </SelectTrigger>
                <SelectContent>
                  {COMPETITION_TYPES.map((type) => (
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

      {/* Video Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Videos</CardTitle>
          <CardDescription>
            Upload competition videos. Supported formats: MP4, MOV, AVI, MKV, WebM (max 500MB each)
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
              <p className="text-lg">Drop the videos here...</p>
            ) : (
              <div>
                <p className="text-lg mb-2">Drag & drop videos here, or click to select</p>
                <p className="text-sm text-muted-foreground">You can upload multiple videos at once</p>
              </div>
            )}
          </div>

          {videoFiles.length > 0 && (
            <div className="mt-6 space-y-4">
              <h4 className="font-medium">Selected Videos ({videoFiles.length})</h4>
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

      {/* Video Comments */}
      <Card>
        <CardHeader>
          <CardTitle>Video Comments</CardTitle>
          <CardDescription>Add detailed comments about the video content and performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="comments">Comments *</Label>
            <Textarea
              id="comments"
              placeholder="Describe the performance, techniques used, areas for improvement, notable moments, etc."
              value={metadata.comments}
              onChange={(e) => setMetadata((prev) => ({ ...prev, comments: e.target.value }))}
              rows={4}
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Comment Visibility</Label>
            <RadioGroup
              value={metadata.commentVisibility}
              onValueChange={(value) => setMetadata((prev) => ({ ...prev, commentVisibility: value as any }))}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="public" id="public" />
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-green-600" />
                  <Label htmlFor="public" className="font-medium">
                    Public
                  </Label>
                </div>
                <span className="text-sm text-muted-foreground ml-auto">Visible to all users</span>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="private" id="private" />
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-orange-600" />
                  <Label htmlFor="private" className="font-medium">
                    Private
                  </Label>
                </div>
                <span className="text-sm text-muted-foreground ml-auto">
                  Visible only to coaches and authorized users
                </span>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Remove Tags UI section (Card, Input, Button, Badge, etc.) */}

      {/* Form Validation Alert */}
      {!isFormValid() && videoFiles.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fill in all required fields: Athlete's name, age, gender, weapon, competition type, and comments.
          </AlertDescription>
        </Alert>
      )}

      {/* Submit Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Save as Draft</Button>
        <Button
          onClick={handleUploadAll}
          disabled={
            !isFormValid() ||
            videoFiles.length === 0 ||
            videoFiles.some((f) => f.status === "uploading" || f.status === "processing")
          }
        >
          Upload Video{videoFiles.length > 1 ? "s" : ""}
        </Button>
      </div>
    </div>
  )
}
