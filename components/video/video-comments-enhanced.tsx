"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Globe, Lock, MessageSquare, Send, Heart, Reply, MoreHorizontal, Flag } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
  videoTimestamp?: number
}

interface VideoCommentsEnhancedProps {
  videoId: string
  comments: Comment[]
  onAddComment: (comment: { content: string; visibility: "public" | "private" }) => void
  onReportComment?: (commentId: string) => void
  onDeleteComment?: (commentId: string) => void
}

export function VideoCommentsEnhanced({
  videoId,
  comments,
  onAddComment,
  onReportComment,
  onDeleteComment,
}: VideoCommentsEnhancedProps) {
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case "administrator":
        return "bg-red-100 text-red-800 border-red-200"
      case "coach":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "local_contact":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const canSeePrivateComments = user?.role === "coach" || user?.role === "administrator"
  const canModerate = user?.role === "administrator"

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
              {comment.author.role === "local_contact"
                ? "Contact Local"
                : comment.author.role === "coach"
                  ? "Entraîneur"
                  : "Administrateur"}
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
                  <span className="text-xs text-orange-600">Privé</span>
                </>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>

            {/* Comment Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onReportComment?.(comment.id)}>
                  <Flag className="h-4 w-4 mr-2" />
                  Signaler
                </DropdownMenuItem>
                {canModerate && (
                  <DropdownMenuItem onClick={() => onDeleteComment?.(comment.id)} className="text-red-600">
                    Supprimer
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
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
                Répondre
              </Button>
            )}
            {comment.videoTimestamp && (
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-blue-600">
                {Math.floor(comment.videoTimestamp / 60)}:{(comment.videoTimestamp % 60).toString().padStart(2, "0")}
              </Button>
            )}
          </div>

          {replyingTo === comment.id && (
            <div className="space-y-2 mt-3">
              <Textarea
                placeholder="Écrire une réponse..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleSubmitReply(comment.id)} disabled={!replyContent.trim()}>
                  <Send className="h-3 w-3 mr-1" />
                  Répondre
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)}>
                  Annuler
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
          Commentaires ({filteredComments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Comment Form */}
        <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Partagez vos observations sur cette vidéo..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />

              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Visibilité du commentaire</Label>
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
                        Privé (entraîneurs uniquement)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Publier
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
              <p>Aucun commentaire pour le moment. Soyez le premier à partager vos observations !</p>
            </div>
          ) : (
            filteredComments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
          )}
        </div>
      </CardContent>
    </Card>
  )
}
