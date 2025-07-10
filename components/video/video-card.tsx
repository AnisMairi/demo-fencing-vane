"use client"

import { useState } from "react"
import Link from "next/link"
import { Play, MessageSquare, Eye, Globe, Lock, Send, MessageCirclePlus, X } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface VideoCardProps {
  video: {
    id: string
    title: string
    thumbnail: string
    duration: string
    views: number
    comments: number
    athlete: string
    uploadedAt: string
    commentVisibility?: "public" | "private"
  }
}

export function VideoCard({ video }: VideoCardProps) {
  const [showCommentBox, setShowCommentBox] = useState(false)
  const [commentText, setCommentText] = useState("")

  const postComment = () => {
    if (!commentText.trim()) return
    console.log("Posting comment:", commentText)
    setCommentText("")
    setShowCommentBox(false)
  }

  return (
    <Card className="overflow-hidden">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted">
        <img
          src={video.thumbnail || "https://placehold.co/400x225?text=Video"}
          alt={video.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Button size="icon" variant="secondary" className="rounded-full">
            <Play className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
          {video.duration}
        </div>
      </div>

      {/* Card content */}
      <CardContent className="p-4 space-y-3">
        {/* Title & meta */}
        <h3 className="font-semibold line-clamp-2">{video.title}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          <span>{video.athlete}</span>
          <span>•</span>
          <span>{video.uploadedAt}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {video.views}
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {video.comments}
          </div>
          {video.commentVisibility && (
            <div className="flex items-center gap-1">
              {video.commentVisibility === "public" ? (
                <Globe className="h-3 w-3 text-green-600" />
              ) : (
                <Lock className="h-3 w-3 text-orange-600" />
              )}
              <span className="text-xs capitalize">{video.commentVisibility}</span>
            </div>
          )}
        </div>

        {/* Remove tags display section (Badge, etc.) */}

        {/* Actions */}
        <Button asChild className="w-full">
          <Link href={`/videos/${video.id}`}>Watch Video</Link>
        </Button>

        {/* Comment placeholder */}
        <div className="border-t pt-3">
          {showCommentBox ? (
            <div className="space-y-2">
              <Input
                placeholder="Write a comment…"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={postComment} disabled={!commentText.trim()}>
                  <Send className="h-4 w-4 mr-1" />
                  Post
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setCommentText("")
                    setShowCommentBox(false)
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground"
              onClick={() => setShowCommentBox(true)}
            >
              <MessageCirclePlus className="h-4 w-4 mr-2" />
              Add a comment…
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
