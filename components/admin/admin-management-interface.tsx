"use client"

import { useUserApi } from "@/hooks/use-user-api"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
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
import { useVideoApi } from "@/hooks/use-video-api"
import { Loading } from "@/components/common/loading"
import { UserProfileModal } from "./UserProfileModal"

interface User {
  id: string | number
  name: string
  email: string
  role: "local_contact" | "coach" | "administrator"
  status: "active" | "suspended" | "pending"
  joinDate?: string
  lastActive?: string
  videosUploaded?: number
  phone?: string
  club_name?: string
  bio?: string
  avatar_url?: string | null
  last_login?: string
  created_at?: string
  updated_at?: string
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileTab, setProfileTab] = useState<'profil' | 'details' | 'activity'>('profil')

  // Remove mock users array
  // const users: User[] = [
  //   {
  //     id: "1",
  //     name: "Marie Dubois",
  //     email: "marie.dubois@email.com",
  //     role: "local_contact",
  //     status: "active",
  //     joinDate: "2023-09-15",
  //     lastActive: "il y a 2h",
  //     videosUploaded: 12,
  //   },
  //   {
  //     id: "2",
  //     name: "Coach Martin",
  //     email: "martin@club-escrime.fr",
  //     role: "coach",
  //     status: "active",
  //     joinDate: "2023-01-10",
  //     lastActive: "il y a 30min",
  //     videosUploaded: 45,
  //   },
  //   {
  //     id: "3",
  //     name: "Jean Nouveau",
  //     email: "jean.nouveau@email.com",
  //     role: "local_contact",
  //     status: "pending",
  //     joinDate: "2024-01-02",
  //     lastActive: "jamais",
  //     videosUploaded: 0,
  //   },
  // ]

  const { getUsers, updateUserStatus, getUser, updateMe } = useUserApi()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    getUsers()
      .then(setUsers)
      .catch(() => setError("Erreur lors du chargement des utilisateurs"))
      .finally(() => setLoading(false))
  }, [])

  const activeUsersCount = users.filter(u => u.status === 'active').length;
  
  // Calculate users who joined this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const usersJoinedThisMonth = users.filter(user => {
    if (!user.created_at) return false;
    const joinDate = new Date(user.created_at);
    return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
  }).length;





  const handleSuspend = async (userId: string | number) => {
    try {
      await updateUserStatus(String(userId), "suspended")
      setUsers(users.map(u => u.id === userId ? { ...u, status: "suspended" } : u))
      toast({ title: "Utilisateur suspendu", description: "L'utilisateur a été suspendu." })
    } catch {
      toast({ title: "Erreur", description: "Impossible de suspendre l'utilisateur.", variant: "destructive" })
    }
  }

  const handleApprove = async (userId: string | number) => {
    try {
      await updateUserStatus(String(userId), "active")
      setUsers(users.map(u => u.id === userId ? { ...u, status: "active" } : u))
      toast({ title: "Utilisateur approuvé", description: "L'utilisateur a été approuvé." })
    } catch {
      toast({ title: "Erreur", description: "Impossible d'approuver l'utilisateur.", variant: "destructive" })
    }
  }

  const handleViewProfile = async (userId: string | number) => {
    setProfileLoading(true)
    setProfileError(null)
    setShowProfileModal(true)
    try {
      const user = await getUser(String(userId))
      setSelectedUser(user)
    } catch {
      setProfileError("Erreur lors du chargement du profil utilisateur.")
    } finally {
      setProfileLoading(false)
    }
  }

  // Remove mock videos array
  // const videos: VideoItem[] = [
  //   {
  //     id: "1",
  //     title: "Championnat Régional Final - Épée",
  //     athlete: "Marie Dubois",
  //     uploader: "Marie Dubois",
  //     uploadDate: "2024-01-01",
  //     status: "published",
  //     views: 156,
  //     comments: 8,
  //     reports: 0,
  //   },
  //   {
  //     id: "2",
  //     title: "Entraînement Technique Controversé",
  //     athlete: "Jean Martin",
  //     uploader: "Coach Bernard",
  //     uploadDate: "2024-01-02",
  //     status: "flagged",
  //     views: 89,
  //     comments: 12,
  //     reports: 3,
  //   },
  // ]

  const { getVideos, deleteVideo, updateVideoStatus, getVideo } = useVideoApi()
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [loadingVideos, setLoadingVideos] = useState(true)
  const [errorVideos, setErrorVideos] = useState<string | null>(null)

  useEffect(() => {
    setLoadingVideos(true)
    getVideos()
      .then(setVideos)
      .catch(() => setErrorVideos("Erreur lors du chargement des vidéos"))
      .finally(() => setLoadingVideos(false))
  }, [])

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.role?.toLowerCase().includes(searchLower) ||
      user.status?.toLowerCase().includes(searchLower)
    );
  });

  // Filter videos based on search term
  const filteredVideos = videos.filter(video => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      video.title?.toLowerCase().includes(searchLower) ||
      video.athlete?.toLowerCase().includes(searchLower) ||
      video.uploader?.toLowerCase().includes(searchLower) ||
      video.status?.toLowerCase().includes(searchLower)
    );
  });

  const handleDeleteVideo = async (videoId: string) => {
    try {
      await deleteVideo(videoId)
      setVideos(videos.filter(v => v.id !== videoId))
      toast({ title: "Vidéo supprimée", description: "La vidéo a été supprimée avec succès." })
    } catch {
      toast({ title: "Erreur", description: "Impossible de supprimer la vidéo.", variant: "destructive" })
    }
  }

  const handlePublishVideo = async (videoId: string) => {
    try {
      await updateVideoStatus(videoId, "published")
      setVideos(videos.map(v => v.id === videoId ? { ...v, status: "published" } : v))
      toast({ title: "Vidéo publiée", description: "La vidéo a été publiée." })
    } catch {
      toast({ title: "Erreur", description: "Impossible de publier la vidéo.", variant: "destructive" })
    }
  }

  const handleFlagVideo = async (videoId: string) => {
    try {
      await updateVideoStatus(videoId, "flagged")
      setVideos(videos.map(v => v.id === videoId ? { ...v, status: "flagged" } : v))
      toast({ title: "Vidéo signalée", description: "La vidéo a été signalée." })
    } catch {
      toast({ title: "Erreur", description: "Impossible de signaler la vidéo.", variant: "destructive" })
    }
  }

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

  // Helper to format dates
  function formatDate(dateStr?: string | null) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
  }
  // Helper to get relative time (minutes, hours, days)
  function relativeTime(dateStr?: string | null) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return `il y a ${diffSec} sec`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `il y a ${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `il y a ${diffH} h`;
    const diffD = Math.floor(diffH / 24);
    if (diffD < 30) return `il y a ${diffD} j`;
    return formatDate(dateStr);
  }

  const handleSaveProfile = async () => {
    if (!selectedUser) return
    setProfileLoading(true)
    try {
      // Update user profile via API
      await updateMe({
        name: selectedUser.name || '',
        phone: selectedUser.phone || '',
        club_name: selectedUser.club_name || '',
        bio: selectedUser.bio || '',
        avatar_url: selectedUser.avatar_url || '',
      })
      // Refresh users list to update last activity
      const updatedUsers = await getUsers()
      setUsers(updatedUsers)
      toast({ title: "Profil mis à jour", description: "Les informations de l'utilisateur ont été sauvegardées." })
      setShowProfileModal(false)
    } catch {
      setProfileError("Erreur lors de la sauvegarde du profil.")
    } finally {
      setProfileLoading(false)
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
            <div className="text-2xl font-bold">{activeUsersCount}</div>
              <p className="text-xs text-muted-foreground">{usersJoinedThisMonth} nouveaux ce mois</p>
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
              placeholder="Rechercher utilisateurs, vidéos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearchTerm("")}
              >
                ×
              </Button>
            )}
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
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6}>Chargement...</TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={6}>{error}</TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6}>Aucun utilisateur trouvé.</TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                              <AvatarImage src={`https://placehold.co/64x64?text=${user.name?.charAt(0) ?? "U"}`} />
                              <AvatarFallback>{user.name?.charAt(0) ?? "U"}</AvatarFallback>
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
                        <TableCell>{user.last_login ? relativeTime(user.last_login) : '-'}</TableCell>
                        <TableCell>{user.videosUploaded ?? 0}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewProfile(user.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir Profil
                            </DropdownMenuItem>
                              {user.status !== "active" && (
                                <DropdownMenuItem onClick={() => handleApprove(user.id)}>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Approuver
                            </DropdownMenuItem>
                              )}
                              {user.status === "active" && (
                                <DropdownMenuItem onClick={() => handleSuspend(user.id)}>
                              <UserX className="h-4 w-4 mr-2" />
                              Suspendre
                            </DropdownMenuItem>
                              )}

                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    ))
                  )}
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
                  {loadingVideos ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Loading />
                      </TableCell>
                    </TableRow>
                  ) : errorVideos ? (
                    <TableRow>
                      <TableCell colSpan={7}>{errorVideos}</TableCell>
                    </TableRow>
                  ) : filteredVideos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7}>Aucune vidéo trouvée.</TableCell>
                    </TableRow>
                  ) : (
                    filteredVideos.map((video) => (
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
                              <DropdownMenuItem onClick={() => getVideo(video.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir Vidéo
                            </DropdownMenuItem>
                              {video.status !== "published" && (
                                <DropdownMenuItem onClick={() => handlePublishVideo(video.id)}>
                              <UserCheck className="h-4 w-4 mr-2" />
                                  Publier
                                </DropdownMenuItem>
                              )}
                              {video.status !== "flagged" && (
                                <DropdownMenuItem onClick={() => handleFlagVideo(video.id)}>
                                  <Flag className="h-4 w-4 mr-2" />
                                  Signaler
                            </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteVideo(video.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    ))
                  )}
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
      <UserProfileModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={selectedUser}
        loading={profileLoading}
        error={profileError}
        tab={profileTab}
        setTab={setProfileTab}
        onChange={(u) => setSelectedUser(u)}
        onSave={handleSaveProfile}
      />
    </div>
  )
}
