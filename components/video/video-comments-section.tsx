"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Globe, Lock, MessageSquare, Send, Heart, Reply } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface Comment {
  id: string
  author: {
    name: string
    avatar: string
    role: "local_contact" | "coach" | "administrator"
  }
  content: string
  visibility: "public" | "private"
  timestamp: string
  likes: number
  replies: Comment[]
  isLiked?: boolean
}

interface VideoCommentsSectionProps {
  videoId: string
  comments: Comment[]
  onAddComment: (comment: { content: string; visibility: "public" | "private" }) => void
}

export function VideoCommentsSection({ videoId, comments, onAddComment }: VideoCommentsSectionProps) {
  const { user } = useAuth()
  const [newComment, setNewComment] = useState("")
  const [commentVisibility, setCommentVisibility] = useState<"public" | "private">("public")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment({
        content: newComment,
        visibility: commentVisibility,
      })
      setNewComment("")
    }
  }

  const handleSubmitReply = (parentId: string) => {
    if (replyContent.trim()) {
      console.log("Replying to:", parentId, "with:", replyContent)
      setReplyContent("")
      setReplyingTo(null)
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    // Simple time formatting - in real app, use a library like date-fns
    return timestamp
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "administrator":
        return "bg-red-100 text-red-800"
      case "coach":
        return "bg-blue-100 text-blue-800"
      case "local_contact":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const canSeePrivateComments = user?.role === "coach" || user?.role === "administrator"

  const filteredComments = comments.filter((comment) => comment.visibility === "public" || canSeePrivateComments)

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`space-y-3 ${isReply ? "ml-8 border-l-2 border-muted pl-4" : ""}`}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
          <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{comment.author.name}</span>
            <Badge variant="outline" className={`text-xs ${getRoleColor(comment.author.role)}`}>
              {comment.author.role.replace("_", " ")}
            </Badge>
            <div className="flex items-center gap-1">
              {comment.visibility === "public" ? (
                <>
                  <Globe className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">Public</span>
                </>
              ) : (
                <>
                  <Lock className="h-3 w-3 text-orange-600" />
                  <span className="text-xs text-orange-600">Private</span>
                </>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{formatTimeAgo(comment.timestamp)}</span>
          </div>

          <p className="text-sm">{comment.content}</p>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              <Heart className={`h-3 w-3 mr-1 ${comment.isLiked ? "fill-red-500 text-red-500" : ""}`} />
              {comment.likes}
            </Button>
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}
          </div>

          {replyingTo === comment.id && (
            <div className="space-y-2 mt-3">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleSubmitReply(comment.id)} disabled={!replyContent.trim()}>
                  <Send className="h-3 w-3 mr-1" />
                  Reply
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments ({filteredComments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Comment Form */}
        <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar || "https://placehold.co/64x64?text=You"} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Share your thoughts about this video..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />

              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Comment Visibility</Label>
                  <RadioGroup
                    value={commentVisibility}
                    onValueChange={(value) => setCommentVisibility(value as "public" | "private")}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="public" id="comment-public" />
                      <Label htmlFor="comment-public" className="flex items-center gap-1 text-sm">
                        <Globe className="h-3 w-3 text-green-600" />
                        Public
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="private" id="comment-private" />
                      <Label htmlFor="comment-private" className="flex items-center gap-1 text-sm">
                        <Lock className="h-3 w-3 text-orange-600" />
                        Private
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {filteredComments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            filteredComments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
          )}
        </div>
      </CardContent>
    </Card>
  )
}
