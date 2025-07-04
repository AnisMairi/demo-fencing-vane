"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Send, Search, Plus, Users, Video, Pin, MoreHorizontal, Phone, VideoIcon } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface Message {
  id: string
  sender: {
    name: string
    avatar: string
    role: string
  }
  content: string
  timestamp: string
  isRead: boolean
  attachments?: {
    type: "video" | "image" | "file"
    url: string
    name: string
  }[]
}

interface Conversation {
  id: string
  participants: {
    name: string
    avatar: string
    role: string
    isOnline: boolean
  }[]
  lastMessage: Message
  unreadCount: number
  isPinned: boolean
  type: "direct" | "group" | "video_discussion"
  title?: string
  videoId?: string
}

interface VideoDiscussion {
  id: string
  videoId: string
  videoTitle: string
  participants: number
  lastActivity: string
  messages: Message[]
}

export function InternalMessagingSystem() {
  const { user } = useAuth()
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data
  const conversations: Conversation[] = [
    {
      id: "1",
      participants: [
        { name: "Coach Martin", avatar: "https://placehold.co/64x64?text=CM", role: "coach", isOnline: true },
        {
          name: user?.name || "Vous",
          avatar: user?.avatar || "https://placehold.co/64x64?text=You",
          role: user?.role || "local_contact",
          isOnline: true,
        },
      ],
      lastMessage: {
        id: "1",
        sender: { name: "Coach Martin", avatar: "https://placehold.co/64x64?text=CM", role: "coach" },
        content: "Excellente performance dans la vidéo d'aujourd'hui !",
        timestamp: "il y a 5 min",
        isRead: false,
      },
      unreadCount: 2,
      isPinned: true,
      type: "direct",
    },
    {
      id: "2",
      participants: [
        {
          name: "Master Laurent",
          avatar: "https://placehold.co/64x64?text=ML",
          role: "administrator",
          isOnline: false,
        },
        { name: "Coach Bernard", avatar: "https://placehold.co/64x64?text=CB", role: "coach", isOnline: true },
        {
          name: user?.name || "Vous",
          avatar: user?.avatar || "https://placehold.co/64x64?text=You",
          role: user?.role || "local_contact",
          isOnline: true,
        },
      ],
      lastMessage: {
        id: "2",
        sender: { name: "Coach Bernard", avatar: "https://placehold.co/64x64?text=CB", role: "coach" },
        content: "Réunion prévue demain à 14h pour discuter des nouvelles techniques",
        timestamp: "il y a 1h",
        isRead: true,
      },
      unreadCount: 0,
      isPinned: false,
      type: "group",
      title: "Équipe Entraîneurs",
    },
  ]

  const videoDiscussions: VideoDiscussion[] = [
    {
      id: "1",
      videoId: "video-1",
      videoTitle: "Championnat Régional Final - Épée",
      participants: 5,
      lastActivity: "il y a 10 min",
      messages: [
        {
          id: "1",
          sender: { name: "Coach Martin", avatar: "https://placehold.co/64x64?text=CM", role: "coach" },
          content: "Regardez la technique à 2:15, excellent exemple de parry-riposte",
          timestamp: "il y a 10 min",
          isRead: true,
        },
      ],
    },
    {
      id: "2",
      videoId: "video-2",
      videoTitle: "Circuit National Jeunes - Fleuret",
      participants: 3,
      lastActivity: "il y a 2h",
      messages: [],
    },
  ]

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  const ConversationItem = ({ conversation }: { conversation: Conversation }) => (
    <div
      className={`p-3 rounded-lg cursor-pointer transition-colors ${
        selectedConversation === conversation.id ? "bg-primary/10" : "hover:bg-muted/50"
      }`}
      onClick={() => setSelectedConversation(conversation.id)}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          {conversation.type === "direct" ? (
            <Avatar className="h-10 w-10">
              <AvatarImage src={conversation.participants[0].avatar || "/placeholder.svg"} />
              <AvatarFallback>{conversation.participants[0].name.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
          )}
          {conversation.participants[0]?.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium truncate">{conversation.title || conversation.participants[0]?.name}</h4>
            {conversation.isPinned && <Pin className="h-3 w-3 text-muted-foreground" />}
            {conversation.unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {conversation.unreadCount}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage.content}</p>
          <p className="text-xs text-muted-foreground">{conversation.lastMessage.timestamp}</p>
        </div>
      </div>
    </div>
  )

  const VideoDiscussionItem = ({ discussion }: { discussion: VideoDiscussion }) => (
    <div className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Video className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">{discussion.videoTitle}</h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{discussion.participants} participants</span>
            <span>•</span>
            <span>{discussion.lastActivity}</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-[600px] flex">
      {/* Sidebar */}
      <div className="w-80 border-r bg-muted/20">
        <Tabs defaultValue="conversations" className="h-full flex flex-col">
          <div className="p-4 border-b">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="conversations">Messages</TabsTrigger>
              <TabsTrigger value="videos">Vidéos</TabsTrigger>
            </TabsList>
          </div>

          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <TabsContent value="conversations" className="flex-1 px-4 pb-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Conversations</h3>
                <Button size="icon" variant="ghost">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {conversations.map((conversation) => (
                    <ConversationItem key={conversation.id} conversation={conversation} />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="videos" className="flex-1 px-4 pb-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Discussions Vidéo</h3>
              </div>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {videoDiscussions.map((discussion) => (
                    <VideoDiscussionItem key={discussion.id} discussion={discussion} />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-background">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/64x64?text=CM" />
                    <AvatarFallback>CM</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">Coach Martin</h3>
                    <p className="text-sm text-green-600">En ligne</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <VideoIcon className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/64x64?text=CM" />
                    <AvatarFallback>CM</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm">
                        Excellente performance dans la vidéo d'aujourd'hui ! J'ai particulièrement apprécié votre
                        technique de parry-riposte.
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">il y a 5 min</p>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <div className="flex-1 flex justify-end">
                    <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-xs">
                      <p className="text-sm">
                        Merci ! J'ai travaillé dur sur cette technique. Avez-vous des conseils pour améliorer ma vitesse
                        d'exécution ?
                      </p>
                    </div>
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Tapez votre message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={2}
                  className="resize-none"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Sélectionnez une conversation pour commencer</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
