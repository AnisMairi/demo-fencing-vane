"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  MessageSquare, 
  Send, 
  Heart, 
  Reply, 
  MoreHorizontal, 
  Flag, 
  Clock, 
  Tag, 
  Plus,
  Play
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"

interface Comment {
  id: string
  author: {
    name: string
    avatar: string
    role: "local_contact" | "coach" | "administrator"
  }
  content: string
  timestamp: string
  likes: number
  replies: Comment[]
  isLiked?: boolean
  videoTimestamp?: number
}

interface TimelineComment {
  id: string
  timestamp: number
  content: string
  author: {
    name: string
    avatar: string
    role: "local_contact" | "coach" | "administrator"
  }
  createdAt: string
  likes: number
  replies: TimelineComment[]
  isLiked?: boolean
}

interface TimelineTag {
  id: string
  timestamp: number
  tag: string
  author: {
    name: string
    avatar: string
    role: "local_contact" | "coach" | "administrator"
  }
  createdAt: string
}

interface VideoCommentsWithTimelineProps {
  videoId: string
  comments: Comment[]
  timelineComments: TimelineComment[]
  timelineTags: TimelineTag[]
  currentTime: number
  onAddComment: (comment: { content: string }) => void
  onAddTimelineComment: (comment: { content: string; timestamp: number }) => void
  onAddTimelineTag: (tag: { tag: string; timestamp: number }) => void
  onSeekToTime: (time: number) => void
  onReportComment?: (commentId: string) => void
  onDeleteComment?: (commentId: string) => void
}

export function VideoCommentsWithTimeline({
  videoId,
  comments,
  timelineComments,
  timelineTags,
  currentTime,
  onAddComment,
  onAddTimelineComment,
  onAddTimelineTag,
  onSeekToTime,
  onReportComment,
  onDeleteComment,
}: VideoCommentsWithTimelineProps) {
  const { user } = useAuth()
  
  // Unified form state
  const [commentType, setCommentType] = useState<"global" | "timeline" | "tag">("global")
  const [newContent, setNewContent] = useState("")
  
  // Reply state
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")

  const handleSubmit = () => {
    if (!newContent.trim()) return

    switch (commentType) {
      case "global":
        onAddComment({
          content: newContent,
        })
        break
      case "timeline":
        onAddTimelineComment({
          content: newContent,
          timestamp: currentTime,
        })
        break
      case "tag":
        onAddTimelineTag({
          tag: newContent,
          timestamp: currentTime,
        })
        break
    }
    
    setNewContent("")
  }

  const handleSubmitReply = (parentId: string) => {
    if (replyContent.trim()) {
      console.log("Replying to:", parentId, "with:", replyContent)
      setReplyContent("")
      setReplyingTo(null)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
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

  const canModerate = user?.role === "administrator"

  // Combine all items into one chronological list
  const allItems = [
    ...comments.map(comment => ({ ...comment, type: 'global' as const })),
    ...timelineComments.map(comment => ({ ...comment, type: 'timeline' as const })),
    ...timelineTags.map(tag => ({ ...tag, type: 'tag' as const }))
  ].sort((a, b) => {
    // Sort by timestamp if available, otherwise by creation time
    if ('timestamp' in a && 'timestamp' in b) {
      return a.timestamp - b.timestamp
    }
    return 0
  })

  const CommentItem = ({ item, isReply = false }: { item: any; isReply?: boolean }) => (
    <div className={`space-y-3 ${isReply ? "ml-8 border-l-2 border-muted pl-4" : ""}`}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={item.author.avatar || "/placeholder.svg"} alt={item.author.name} />
          <AvatarFallback>{item.author.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{item.author.name}</span>
            <Badge variant="outline" className={`text-xs ${getRoleColor(item.author.role)}`}>
              {item.author.role === "local_contact"
                ? "Contact Local"
                : item.author.role === "coach"
                  ? "Entraîneur"
                  : "Administrateur"}
            </Badge>
            
            {/* Type indicator */}
            {item.type === 'global' && (
              <Badge variant="secondary" className="text-xs">
                <MessageSquare className="h-3 w-3 mr-1" />
                Commentaire global
              </Badge>
            )}
            {item.type === 'timeline' && (
              <Badge variant="default" className="text-xs bg-green-500">
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(item.timestamp)}
              </Badge>
            )}
            {item.type === 'tag' && (
              <Badge variant="outline" className="text-xs border-orange-500 text-orange-600">
                <Tag className="h-3 w-3 mr-1" />
                Tag à {formatTime(item.timestamp)}
              </Badge>
            )}
            
            <span className="text-xs text-muted-foreground">
              {item.timestamp || item.createdAt}
            </span>

            {/* Comment Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onReportComment?.(item.id)}>
                  <Flag className="h-4 w-4 mr-2" />
                  Signaler
                </DropdownMenuItem>
                {canModerate && (
                  <DropdownMenuItem onClick={() => onDeleteComment?.(item.id)} className="text-red-600">
                    Supprimer
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Content */}
          {item.type === 'tag' ? (
            <Badge variant="secondary" className="text-sm">
              {item.tag}
            </Badge>
          ) : (
            <p className="text-sm">{item.content}</p>
          )}

          <div className="flex items-center gap-4">
            {item.likes !== undefined && (
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                <Heart className={`h-3 w-3 mr-1 ${item.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                {item.likes}
              </Button>
            )}
            {!isReply && item.type !== 'tag' && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setReplyingTo(replyingTo === item.id ? null : item.id)}
              >
                <Reply className="h-3 w-3 mr-1" />
                Répondre
              </Button>
            )}
            {(item.videoTimestamp || (item.type === 'timeline' && item.timestamp)) && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs text-blue-600"
                onClick={() => onSeekToTime(item.videoTimestamp || item.timestamp)}
              >
                <Play className="h-3 w-3 mr-1" />
                {formatTime(item.videoTimestamp || item.timestamp)}
              </Button>
            )}
          </div>

          {replyingTo === item.id && (
            <div className="space-y-2 mt-3">
              <Textarea
                placeholder="Écrire une réponse..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleSubmitReply(item.id)} disabled={!replyContent.trim()}>
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

      {item.replies && item.replies.length > 0 && (
        <div className="space-y-3">
          {item.replies.map((reply: any) => (
            <CommentItem key={reply.id} item={reply} isReply={true} />
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
          Commentaires et Tags
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Unified Add Comment Form */}
        <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              {/* Comment Type Selector */}
              <div className="flex items-center gap-4">
                <Label className="text-sm font-medium">Type de contenu:</Label>
                <Select value={commentType} onValueChange={(value: any) => setCommentType(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Commentaire global
                      </div>
                    </SelectItem>
                    <SelectItem value="timeline">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Commentaire à {formatTime(currentTime)}
                      </div>
                    </SelectItem>
                    <SelectItem value="tag">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Tag à {formatTime(currentTime)}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                
                {(commentType === 'timeline' || commentType === 'tag') && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onSeekToTime(currentTime)}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Aller à {formatTime(currentTime)}
                  </Button>
                )}
              </div>

              {/* Content Input */}
              {commentType === 'tag' ? (
                <Input
                  placeholder={`Tag à ${formatTime(currentTime)} - Ex: "Parfaite exécution", "Technique épée", "Jeu de jambes"...`}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                />
              ) : (
                <Textarea
                  placeholder={
                    commentType === 'global' 
                      ? "Partagez vos observations générales sur cette vidéo..."
                      : `Commentaire à ${formatTime(currentTime)} - Partagez vos observations sur ce moment précis...`
                  }
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={3}
                />
              )}

              <div className="flex justify-end">
                <Button onClick={handleSubmit} disabled={!newContent.trim()}>
                  {commentType === 'tag' ? (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter Tag
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Publier
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Unified Comments List */}
        <div className="space-y-6">
          {allItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun commentaire ou tag pour le moment. Soyez le premier à partager vos observations !</p>
            </div>
          ) : (
            allItems.map((item) => <CommentItem key={`${item.type}-${item.id}`} item={item} />)
          )}
        </div>
      </CardContent>
    </Card>
  )
} 