"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
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
  title: string
  description: string
  athlete: string
  weapon: string
  technique: string
  level: string
  isPrivate: boolean
}

export function VideoUpload() {
  const { user } = useAuth()
  const [videoFiles, setVideoFiles] = useState<VideoFile[]>([])
  const [metadata, setMetadata] = useState<VideoMetadata>({
    title: "",
    description: "",
    athlete: "",
    weapon: "",
    technique: "",
    level: "",
    isPrivate: false,
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

  const simulateUpload = async (fileId: string) => {
    const fileIndex = videoFiles.findIndex((f) => f.id === fileId)
    if (fileIndex === -1) return

    // Update status to uploading
    setVideoFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "uploading" } : f)))

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      setVideoFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress } : f)))
    }

    // Simulate processing
    setVideoFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "processing" } : f)))

    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Complete
    setVideoFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "completed" } : f)))
  }

  const handleUploadAll = async () => {
    const pendingFiles = videoFiles.filter((f) => f.status === "pending")

    for (const file of pendingFiles) {
      await simulateUpload(file.id)
    }
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

  const getStatusText = (status: VideoFile["status"]) => {
    switch (status) {
      case "pending":
        return "Ready to upload"
      case "uploading":
        return "Uploading..."
      case "processing":
        return "Processing..."
      case "completed":
        return "Upload complete"
      case "error":
        return "Upload failed"
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Videos</CardTitle>
          <CardDescription>
            Upload fencing videos for analysis and review. Supported formats: MP4, MOV, AVI, MKV, WebM (max 500MB each)
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
        </CardContent>
      </Card>

      {/* File List */}
      {videoFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Videos ({videoFiles.length})</CardTitle>
            <CardDescription>Review and manage your selected video files</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {videoFiles.map((videoFile) => (
              <div key={videoFile.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="relative w-20 h-12 bg-muted rounded overflow-hidden">
                  <video src={videoFile.preview} className="w-full h-full object-cover" muted />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{videoFile.file.name}</p>
                  <p className="text-sm text-muted-foreground">{(videoFile.file.size / (1024 * 1024)).toFixed(1)} MB</p>

                  {videoFile.status === "uploading" && <Progress value={videoFile.progress} className="mt-2" />}
                </div>

                <div className="flex items-center gap-2">
                  {getStatusIcon(videoFile.status)}
                  <span className="text-sm">{getStatusText(videoFile.status)}</span>
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

            <div className="flex justify-between items-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                {videoFiles.filter((f) => f.status === "completed").length} of {videoFiles.length} uploaded
              </p>
              <Button onClick={handleUploadAll} disabled={videoFiles.every((f) => f.status !== "pending")}>
                Upload All Videos
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metadata Form */}
      <Card>
        <CardHeader>
          <CardTitle>Video Information</CardTitle>
          <CardDescription>Add details about your video for better organization and searchability</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Épée Training Session - Advanced Footwork"
                value={metadata.title}
                onChange={(e) => setMetadata((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="athlete">Athlete</Label>
              <Input
                id="athlete"
                placeholder="Athlete name"
                value={metadata.athlete}
                onChange={(e) => setMetadata((prev) => ({ ...prev, athlete: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what happens in this video, techniques shown, goals, etc."
              value={metadata.description}
              onChange={(e) => setMetadata((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="weapon">Weapon</Label>
              <Select
                value={metadata.weapon}
                onValueChange={(value) => setMetadata((prev) => ({ ...prev, weapon: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select weapon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="foil">Foil</SelectItem>
                  <SelectItem value="epee">Épée</SelectItem>
                  <SelectItem value="sabre">Sabre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="technique">Technique Focus</Label>
              <Select
                value={metadata.technique}
                onValueChange={(value) => setMetadata((prev) => ({ ...prev, technique: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select technique" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="footwork">Footwork</SelectItem>
                  <SelectItem value="bladework">Bladework</SelectItem>
                  <SelectItem value="attacks">Attacks</SelectItem>
                  <SelectItem value="defense">Defense</SelectItem>
                  <SelectItem value="tactics">Tactics</SelectItem>
                  <SelectItem value="competition">Competition</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Skill Level</Label>
              <Select
                value={metadata.level}
                onValueChange={(value) => setMetadata((prev) => ({ ...prev, level: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="elite">Elite</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Remove Tags UI section (Label, Input, Button, Badge, etc.) */}

          {/* Privacy Settings */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="private"
              checked={metadata.isPrivate}
              onChange={(e) => setMetadata((prev) => ({ ...prev, isPrivate: e.target.checked }))}
              className="rounded"
            />
            <Label htmlFor="private">Make this video private (only visible to coaches and admins)</Label>
          </div>

          {user?.role === "local_contact" && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                As a Local Contact, your uploaded videos will be reviewed by coaches before being made available to
                others.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Save as Draft</Button>
        <Button
          disabled={
            !metadata.title ||
            videoFiles.length === 0 ||
            videoFiles.some((f) => f.status === "uploading" || f.status === "processing")
          }
        >
          Publish Video{videoFiles.length > 1 ? "s" : ""}
        </Button>
      </div>
    </div>
  )
}
