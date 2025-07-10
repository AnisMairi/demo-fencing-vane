"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Plus } from "lucide-react"

interface VideoMetadata {
  title: string
  description: string
  athlete: string
  weapon: string
  technique: string
  level: string
  isPrivate: boolean
  category: string
  duration?: string
  recordedAt?: string
}

interface VideoMetadataFormProps {
  initialData?: Partial<VideoMetadata>
  onSave: (metadata: VideoMetadata) => void
  onCancel: () => void
  isLoading?: boolean
}

export function VideoMetadataForm({ initialData, onSave, onCancel, isLoading }: VideoMetadataFormProps) {
  const [metadata, setMetadata] = useState<VideoMetadata>({
    title: "",
    description: "",
    athlete: "",
    weapon: "",
    technique: "",
    level: "",
    isPrivate: false,
    category: "",
    ...initialData,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(metadata)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Épée Training Session - Advanced Footwork"
                value={metadata.title}
                onChange={(e) => setMetadata((prev) => ({ ...prev, title: e.target.value }))}
                required
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
              rows={4}
            />
          </div>

          {/* Technical Details */}
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
                  <SelectItem value="conditioning">Conditioning</SelectItem>
                  <SelectItem value="warmup">Warm-up</SelectItem>
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

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={metadata.category}
                onValueChange={(value) => setMetadata((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="training">Training Session</SelectItem>
                  <SelectItem value="lesson">Private Lesson</SelectItem>
                  <SelectItem value="competition">Competition</SelectItem>
                  <SelectItem value="drill">Drill Practice</SelectItem>
                  <SelectItem value="analysis">Technical Analysis</SelectItem>
                  <SelectItem value="demonstration">Demonstration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recordedAt">Recording Date</Label>
              <Input
                id="recordedAt"
                type="date"
                value={metadata.recordedAt}
                onChange={(e) => setMetadata((prev) => ({ ...prev, recordedAt: e.target.value }))}
              />
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="private"
              checked={metadata.isPrivate}
              onCheckedChange={(checked) => setMetadata((prev) => ({ ...prev, isPrivate: !!checked }))}
            />
            <Label htmlFor="private">Make this video private (only visible to coaches and admins)</Label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !metadata.title}>
              {isLoading ? "Saving..." : "Save Video"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
