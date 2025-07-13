"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, Heart, Reply, MoreHorizontal, Flag, Clock, Tag, X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import React from "react"

interface Comment {
  id: string
  author: {
    name: string
    avatar: string
    role: "local_contact" | "coach" | "administrator"
  }
  content: string
  timestamp: string
  likes?: number
  replies: Comment[]
  isLiked?: boolean
}

interface TimeStamp {
  id: string
  time: string
  displayTime: string
}

interface VideoTag {
  id: string
  text: string
  displayText: string
}

interface VideoCommentsProps {
  videoId: string
  comments: Comment[]
  onAddComment: (comment: { content: string }) => void
  onReportComment?: (commentId: string) => void
  onDeleteComment?: (commentId: string) => void
  commentInput?: string
  onCommentInputChange?: (value: string) => void
  onSeekToTimeStamp?: (timeString: string) => void
  onAddTag?: (tag: string) => void
  pendingTags?: string[]
  onPendingTagsChange?: (tags: string[]) => void
}

export function VideoComments({
  videoId,
  comments,
  onAddComment,
  onReportComment,
  onDeleteComment,
  commentInput = "",
  onCommentInputChange,
  onSeekToTimeStamp,
  onAddTag,
  pendingTags = [],
  onPendingTagsChange,
}: VideoCommentsProps) {
  const { user } = useAuth()
  
  const [newContent, setNewContent] = useState(commentInput)
  
  // Reply state
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")

  // Update local state when prop changes
  React.useEffect(() => {
    setNewContent(commentInput)
  }, [commentInput])

  const handleSubmit = () => {
    if (!newContent.trim() && pendingTags.length === 0) return

    let finalContent = newContent.trim()
    
    // Add tags to the comment if there are any
    if (pendingTags.length > 0) {
      const tagsText = pendingTags.map(tag => `/tag{${tag}}`).join(' ')
      if (finalContent) {
        finalContent += `\n\nTags: ${tagsText}`
      } else {
        finalContent = `Tags: ${tagsText}`
      }
    }

    onAddComment({
      content: finalContent,
    })
    
    setNewContent("")
    onPendingTagsChange?.([])
    onCommentInputChange?.("")
  }

  const handleSubmitReply = (parentId: string) => {
    if (replyContent.trim()) {
      console.log("Replying to:", parentId, "with:", replyContent)
      setReplyContent("")
      setReplyingTo(null)
    }
  }

  const removeTag = (tagToRemove: string) => {
    onPendingTagsChange?.(pendingTags.filter(tag => tag !== tagToRemove))
  }

  // Parse content to render time stamps and tags as clickable elements
  const renderContent = (content: string) => {
    const parts = content.split(/(\/time\{[^}]+\}|\/tag\{[^}]+\})/g)
    
    return parts.map((part, index) => {
      const timeMatch = part.match(/\/time\{([^}]+)\}/)
      const tagMatch = part.match(/\/tag\{([^}]+)\}/)
      
      if (timeMatch) {
        const timeString = timeMatch[1]
        return (
          <Badge 
            key={index}
            variant="secondary" 
            className="cursor-pointer hover:bg-blue-100 hover:text-blue-800 text-xs mx-1 bg-blue-50 text-blue-700 border-blue-200 transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md"
            onClick={(e) => {
              onSeekToTimeStamp?.(timeString)
              // Add a brief visual feedback
              const badge = e.currentTarget as HTMLElement
              badge.style.transform = 'scale(0.95)'
              setTimeout(() => {
                badge.style.transform = ''
              }, 150)
            }}
          >
            <Clock className="h-3 w-3 mr-1" />
            {timeString}
          </Badge>
        )
      }
      
      if (tagMatch) {
        const tagText = tagMatch[1]
        return (
          <Badge 
            key={index}
            variant="outline" 
            className="bg-purple-50 text-purple-700 border-purple-200 font-semibold text-xs mx-1"
          >
            <Tag className="h-3 w-3 mr-1" />
            {tagText}
          </Badge>
        )
      }
      
      return part
    })
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

  const CommentItem = ({ item, isReply = false }: { item: Comment; isReply?: boolean }) => (
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
            
            <span className="text-xs text-muted-foreground">
              {item.timestamp}
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
          <div className="text-sm leading-relaxed">{renderContent(item.content)}</div>

          <div className="flex items-center gap-4">
            {item.likes !== undefined && (
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                <Heart className={`h-3 w-3 mr-1 ${item.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                {item.likes}
              </Button>
            )}
            {!isReply && (
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
          {item.replies.map((reply) => (
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
          Commentaires
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
                  placeholder="Ajouter un commentaire... (Utilisez les boutons 'Add time' et 'Add tag' dans le lecteur vidéo)"
                  value={newContent}
                  onChange={(e) => {
                    setNewContent(e.target.value)
                    onCommentInputChange?.(e.target.value)
                  }}
                  rows={3}
                />

                {/* Pending Tags Display */}
                {pendingTags.length > 0 && (
                  <div className="p-3 border border-purple-200 rounded-lg bg-purple-50/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800">Tags à ajouter au commentaire:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {pendingTags.map((tag, index) => (
                        <Badge 
                          key={index}
                          variant="outline" 
                          className="bg-white text-purple-700 border-purple-300 hover:bg-purple-100 hover:border-purple-400 cursor-pointer font-medium text-sm transition-all duration-200 hover:scale-105 active:scale-95 group"
                          onClick={() => removeTag(tag)}
                        >
                          <Tag className="h-3 w-3 mr-1 text-purple-600" />
                          {tag}
                          <X className="h-3 w-3 ml-1 text-purple-500 group-hover:text-purple-700 transition-colors" />
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-purple-600 mt-2">
                      Cliquez sur un tag pour le supprimer
                    </div>
                  </div>
                )}

                {/* Input Preview */}
                {/* This section is removed as per the edit hint */}

                <div className="flex justify-end">
                  <Button onClick={handleSubmit} disabled={!newContent.trim() && pendingTags.length === 0}>
                    <Send className="h-4 w-4 mr-2" />
                    Publier
                  </Button>
                </div>
              </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun commentaire pour le moment</p>
              <p className="text-sm">Soyez le premier à commenter cette vidéo !</p>
            </div>
          ) : (
            comments.map((comment) => (
              <CommentItem key={comment.id} item={comment} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
} 