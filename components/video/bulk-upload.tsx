"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { FolderOpen, Upload, CheckCircle, AlertCircle } from "lucide-react"

interface BulkUploadSettings {
  weapon: string
  technique: string
  level: string
  category: string
  isPrivate: boolean
  athletePrefix: string
  autoGenerateTitles: boolean
}

export function BulkUpload() {
  const [files, setFiles] = useState<File[]>([])
  const [settings, setSettings] = useState<BulkUploadSettings>({
    weapon: "",
    technique: "",
    level: "",
    category: "",
    isPrivate: false,
    athletePrefix: "",
    autoGenerateTitles: true,
  })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleBulkUpload = async () => {
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate bulk upload process
    for (let i = 0; i < files.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setUploadProgress(((i + 1) / files.length) * 100)
    }

    setIsUploading(false)
    setUploadProgress(100)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Bulk Upload Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Bulk upload allows you to upload multiple videos with shared metadata. Individual videos can be edited
              later.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bulk-weapon">Default Weapon</Label>
              <Select
                value={settings.weapon}
                onValueChange={(value) => setSettings((prev) => ({ ...prev, weapon: value }))}
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
              <Label htmlFor="bulk-technique">Default Technique</Label>
              <Select
                value={settings.technique}
                onValueChange={(value) => setSettings((prev) => ({ ...prev, technique: value }))}
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
              <Label htmlFor="bulk-level">Default Level</Label>
              <Select
                value={settings.level}
                onValueChange={(value) => setSettings((prev) => ({ ...prev, level: value }))}
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

            <div className="space-y-2">
              <Label htmlFor="bulk-category">Default Category</Label>
              <Select
                value={settings.category}
                onValueChange={(value) => setSettings((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="training">Training Session</SelectItem>
                  <SelectItem value="lesson">Private Lesson</SelectItem>
                  <SelectItem value="competition">Competition</SelectItem>
                  <SelectItem value="drill">Drill Practice</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="athlete-prefix">Athlete Name Prefix</Label>
            <Input
              id="athlete-prefix"
              placeholder="e.g., 'Training Group A -' (will be added to filename)"
              value={settings.athletePrefix}
              onChange={(e) => setSettings((prev) => ({ ...prev, athletePrefix: e.target.value }))}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="auto-titles"
                checked={settings.autoGenerateTitles}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, autoGenerateTitles: !!checked }))}
              />
              <Label htmlFor="auto-titles">Auto-generate titles from filenames</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="bulk-private"
                checked={settings.isPrivate}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, isPrivate: !!checked }))}
              />
              <Label htmlFor="bulk-private">Make all videos private</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Select Files</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="bulk-files">Choose Video Files</Label>
            <Input id="bulk-files" type="file" multiple accept="video/*" onChange={handleFileSelect} className="mt-2" />
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">{files.length} files selected:</p>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between text-sm p-2 bg-muted rounded">
                    <span className="truncate">{file.name}</span>
                    <span className="text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uploading...</span>
                <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          <Button onClick={handleBulkUpload} disabled={files.length === 0 || isUploading} className="w-full">
            {isUploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-pulse" />
                Uploading {files.length} videos...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload {files.length} videos
              </>
            )}
          </Button>

          {uploadProgress === 100 && !isUploading && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>All {files.length} videos have been uploaded successfully!</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
