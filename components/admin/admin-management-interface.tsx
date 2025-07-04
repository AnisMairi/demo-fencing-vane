"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Video,
  MessageSquare,
  Search,
  MoreHorizontal,
  Eye,
  Trash2,
  UserCheck,
  UserX,
  Flag,
  Settings,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface User {
  id: string
  name: string
  email: string
  role: "local_contact" | "coach" | "administrator"
  status: "active" | "suspended" | "pending"
  joinDate: string
  lastActive: string
  videosUploaded: number
}

interface VideoItem {
  id: string
  title: string
  athlete: string
  uploader: string
  uploadDate: string
  status: "published" | "pending" | "flagged" | "removed"
  views: number
  comments: number
  reports: number
}

interface CommentItem {
  id: string
  author: string
  content: string
  videoTitle: string
  timestamp: string
  status: "approved" | "pending" | "flagged" | "removed"
  reports: number
}

export function AdminManagementInterface() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("users")

  // Mock data
  const users: User[] = [
    {
      id: "1",
      name: "Marie Dubois",
      email: "marie.dubois@email.com",
      role: "local_contact",
      status: "active",
      joinDate: "2023-09-15",
      lastActive: "il y a 2h",
      videosUploaded: 12,
    },
    {
      id: "2",
      name: "Coach Martin",
      email: "martin@club-escrime.fr",
      role: "coach",
      status: "active",
      joinDate: "2023-01-10",
      lastActive: "il y a 30min",
      videosUploaded: 45,
    },
    {
      id: "3",
      name: "Jean Nouveau",
      email: "jean.nouveau@email.com",
      role: "local_contact",
      status: "pending",
      joinDate: "2024-01-02",
      lastActive: "jamais",
      videosUploaded: 0,
    },
  ]

  const videos: VideoItem[] = [
    {
      id: "1",
      title: "Championnat Régional Final - Épée",
      athlete: "Marie Dubois",
      uploader: "Marie Dubois",
      uploadDate: "2024-01-01",
      status: "published",
      views: 156,
      comments: 8,
      reports: 0,
    },
    {
      id: "2",
      title: "Entraînement Technique Controversé",
      athlete: "Jean Martin",
      uploader: "Coach Bernard",
      uploadDate: "2024-01-02",
      status: "flagged",
      views: 89,
      comments: 12,
      reports: 3,
    },
  ]

  const comments: CommentItem[] = [
    {
      id: "1",
      author: "Coach Martin",
      content: "Excellente technique, continuez ainsi !",
      videoTitle: "Championnat Régional Final",
      timestamp: "il y a 2h",
      status: "approved",
      reports: 0,
    },
    {
      id: "2",
      author: "Utilisateur Anonyme",
      content: "Commentaire inapproprié signalé par plusieurs utilisateurs",
      videoTitle: "Entraînement Technique",
      timestamp: "il y a 1h",
      status: "flagged",
      reports: 5,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "published":
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "suspended":
      case "flagged":
        return "bg-red-100 text-red-800"
      case "removed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "administrator":
        return "bg-purple-100 text-purple-800"
      case "coach":
        return "bg-blue-100 text-blue-800"
      case "local_contact":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Administration</h1>
          <p className="text-muted-foreground">Gestion des utilisateurs, contenus et modération</p>
        </div>
        <Button>
          <Settings className="mr-2 h-4 w-4" />
          Paramètres Système
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">+12% ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vidéos Publiées</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+8% ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Signalements</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-red-600">À traiter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commentaires</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,456</div>
            <p className="text-xs text-muted-foreground">+15% ce mois</p>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="videos">Vidéos</TabsTrigger>
          <TabsTrigger value="comments">Commentaires</TabsTrigger>
          <TabsTrigger value="reports">Signalements</TabsTrigger>
        </TabsList>

        {/* Search Bar */}
        <div className="flex items-center gap-4 my-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dernière Activité</TableHead>
                    <TableHead>Vidéos</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://placehold.co/64x64?text=${user.name.charAt(0)}`} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role === "local_contact"
                            ? "Contact Local"
                            : user.role === "coach"
                              ? "Entraîneur"
                              : "Administrateur"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status === "active" ? "Actif" : user.status === "pending" ? "En attente" : "Suspendu"}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastActive}</TableCell>
                      <TableCell>{user.videosUploaded}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir Profil
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Approuver
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserX className="h-4 w-4 mr-2" />
                              Suspendre
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Vidéos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Athlète</TableHead>
                    <TableHead>Téléchargé par</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Vues</TableHead>
                    <TableHead>Signalements</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {videos.map((video) => (
                    <TableRow key={video.id}>
                      <TableCell className="font-medium">{video.title}</TableCell>
                      <TableCell>{video.athlete}</TableCell>
                      <TableCell>{video.uploader}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(video.status)}>
                          {video.status === "published"
                            ? "Publié"
                            : video.status === "pending"
                              ? "En attente"
                              : video.status === "flagged"
                                ? "Signalé"
                                : "Supprimé"}
                        </Badge>
                      </TableCell>
                      <TableCell>{video.views}</TableCell>
                      <TableCell>{video.reports > 0 && <Badge variant="destructive">{video.reports}</Badge>}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir Vidéo
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Approuver
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>Modération des Commentaires</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Auteur</TableHead>
                    <TableHead>Commentaire</TableHead>
                    <TableHead>Vidéo</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Signalements</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comments.map((comment) => (
                    <TableRow key={comment.id}>
                      <TableCell>{comment.author}</TableCell>
                      <TableCell className="max-w-xs truncate">{comment.content}</TableCell>
                      <TableCell>{comment.videoTitle}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(comment.status)}>
                          {comment.status === "approved"
                            ? "Approuvé"
                            : comment.status === "pending"
                              ? "En attente"
                              : comment.status === "flagged"
                                ? "Signalé"
                                : "Supprimé"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {comment.reports > 0 && <Badge variant="destructive">{comment.reports}</Badge>}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Approuver
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Signalements à Traiter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Vidéo signalée: "Entraînement Technique Controversé"</h4>
                      <p className="text-sm text-muted-foreground">3 signalements pour contenu inapproprié</p>
                      <p className="text-xs text-muted-foreground">Signalé il y a 2h</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Examiner
                      </Button>
                      <Button size="sm">Traiter</Button>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Commentaire signalé</h4>
                      <p className="text-sm text-muted-foreground">5 signalements pour langage inapproprié</p>
                      <p className="text-xs text-muted-foreground">Signalé il y a 1h</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Examiner
                      </Button>
                      <Button size="sm">Traiter</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
