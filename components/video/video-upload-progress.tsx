"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Clock, X } from "lucide-react"

interface UploadJob {
  id: string
  filename: string
  status: "queued" | "uploading" | "processing" | "completed" | "failed"
  progress: number
  size: string
  estimatedTime?: string
  error?: string
}

interface VideoUploadProgressProps {
  jobs: UploadJob[]
  onCancel: (id: string) => void
  onRetry: (id: string) => void
}

export function VideoUploadProgress({ jobs, onCancel, onRetry }: VideoUploadProgressProps) {
  if (jobs.length === 0) return null

  const getStatusColor = (status: UploadJob["status"]) => {
    switch (status) {
      case "queued":
        return "secondary"
      case "uploading":
        return "default"
      case "processing":
        return "default"
      case "completed":
        return "success"
      case "failed":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: UploadJob["status"]) => {
    switch (status) {
      case "queued":
        return <Clock className="h-4 w-4" />
      case "uploading":
      case "processing":
        return <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "failed":
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(job.status)}
                <span className="font-medium truncate">{job.filename}</span>
                <Badge variant={getStatusColor(job.status) as any}>{job.status}</Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{job.size}</span>
                {job.status === "uploading" || job.status === "queued" ? (
                  <Button variant="ghost" size="sm" onClick={() => onCancel(job.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                ) : job.status === "failed" ? (
                  <Button variant="ghost" size="sm" onClick={() => onRetry(job.id)}>
                    Retry
                  </Button>
                ) : null}
              </div>
            </div>

            {(job.status === "uploading" || job.status === "processing") && (
              <div className="space-y-1">
                <Progress value={job.progress} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{job.progress}% complete</span>
                  {job.estimatedTime && <span>{job.estimatedTime} remaining</span>}
                </div>
              </div>
            )}

            {job.error && <p className="text-sm text-red-600">{job.error}</p>}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
