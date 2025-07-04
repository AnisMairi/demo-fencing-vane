"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Shield,
  FileText,
  Users,
  Camera,
  Download,
  Trash2,
  Eye,
  Lock,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"

interface ConsentRecord {
  id: string
  athleteId: string
  athleteName: string
  age: number
  consentType: "gdpr" | "image_rights" | "parental" | "data_processing"
  status: "granted" | "pending" | "revoked" | "expired"
  grantedDate: string
  expiryDate?: string
  parentName?: string
  parentEmail?: string
  ipAddress: string
  userAgent: string
}

interface DataRequest {
  id: string
  athleteId: string
  athleteName: string
  requestType: "access" | "portability" | "deletion" | "rectification"
  status: "pending" | "processing" | "completed" | "rejected"
  requestDate: string
  completionDate?: string
  description: string
}

export function ConsentManagement() {
  const [activeTab, setActiveTab] = useState("consents")
  const [selectedConsents, setSelectedConsents] = useState<string[]>([])

  // Mock data
  const consentRecords: ConsentRecord[] = [
    {
      id: "1",
      athleteId: "1",
      athleteName: "Marie Dubois",
      age: 16,
      consentType: "parental",
      status: "granted",
      grantedDate: "2023-09-15",
      expiryDate: "2024-09-15",
      parentName: "Jean Dubois",
      parentEmail: "jean.dubois@email.com",
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0...",
    },
    {
      id: "2",
      athleteId: "1",
      athleteName: "Marie Dubois",
      age: 16,
      consentType: "image_rights",
      status: "granted",
      grantedDate: "2023-09-15",
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0...",
    },
    {
      id: "3",
      athleteId: "2",
      athleteName: "Jean Martin",
      age: 14,
      consentType: "parental",
      status: "pending",
      grantedDate: "2024-01-02",
      parentName: "Sophie Martin",
      parentEmail: "sophie.martin@email.com",
      ipAddress: "192.168.1.2",
      userAgent: "Mozilla/5.0...",
    },
  ]

  const dataRequests: DataRequest[] = [
    {
      id: "1",
      athleteId: "1",
      athleteName: "Marie Dubois",
      requestType: "access",
      status: "completed",
      requestDate: "2024-01-10",
      completionDate: "2024-01-12",
      description: "Demande d'accès à toutes les données personnelles",
    },
    {
      id: "2",
      athleteId: "3",
      athleteName: "Sophie Laurent",
      requestType: "deletion",
      status: "pending",
      requestDate: "2024-01-15",
      description: "Demande de suppression de toutes les données",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "granted":
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "revoked":
      case "rejected":
        return "bg-red-100 text-red-800"
      case "expired":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getConsentTypeLabel = (type: string) => {
    switch (type) {
      case "gdpr":
        return "Consentement RGPD"
      case "image_rights":
        return "Droits à l'image"
      case "parental":
        return "Consentement parental"
      case "data_processing":
        return "Traitement des données"
      default:
        return type
    }
  }

  const getRequestTypeLabel = (type: string) => {
    switch (type) {
      case "access":
        return "Accès aux données"
      case "portability":
        return "Portabilité"
      case "deletion":
        return "Suppression"
      case "rectification":
        return "Rectification"
      default:
        return type
    }
  }

  const isMinor = (age: number) => age < 18

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Gestion RGPD
          </h1>
          <p className="text-muted-foreground">Gestion des consentements, droits à l'image et conformité RGPD</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter Registre
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Nouveau Consentement
          </Button>
        </div>
      </div>

      {/* GDPR Compliance Status */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consentements Actifs</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consentRecords.filter((c) => c.status === "granted").length}</div>
            <p className="text-xs text-muted-foreground">Sur {consentRecords.length} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consentRecords.filter((c) => c.status === "pending").length}</div>
            <p className="text-xs text-muted-foreground">Consentements à traiter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mineurs</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consentRecords.filter((c) => isMinor(c.age)).length}</div>
            <p className="text-xs text-muted-foreground">Consentement parental requis</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demandes RGPD</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataRequests.filter((r) => r.status === "pending").length}</div>
            <p className="text-xs text-muted-foreground">À traiter sous 30 jours</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="consents">Consentements</TabsTrigger>
          <TabsTrigger value="requests">Demandes RGPD</TabsTrigger>
          <TabsTrigger value="compliance">Conformité</TabsTrigger>
        </TabsList>

        <TabsContent value="consents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registre des Consentements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consentRecords.map((consent) => (
                  <div key={consent.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedConsents.includes(consent.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedConsents([...selectedConsents, consent.id])
                            } else {
                              setSelectedConsents(selectedConsents.filter((id) => id !== consent.id))
                            }
                          }}
                        />
                        <div>
                          <h4 className="font-medium">{consent.athleteName}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{getConsentTypeLabel(consent.consentType)}</span>
                            {isMinor(consent.age) && (
                              <Badge variant="outline" className="text-xs">
                                Mineur ({consent.age} ans)
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(consent.status)}>
                          {consent.status === "granted"
                            ? "Accordé"
                            : consent.status === "pending"
                              ? "En attente"
                              : consent.status === "revoked"
                                ? "Révoqué"
                                : "Expiré"}
                        </Badge>
                        <div className="text-sm text-muted-foreground">{consent.grantedDate}</div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {consent.parentName && (
                      <div className="mt-3 p-3 bg-muted/20 rounded-lg">
                        <div className="text-sm">
                          <strong>Parent/Tuteur:</strong> {consent.parentName} ({consent.parentEmail})
                        </div>
                        {consent.expiryDate && (
                          <div className="text-sm text-muted-foreground">
                            <strong>Expire le:</strong> {consent.expiryDate}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Demandes de Droits RGPD</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataRequests.map((request) => (
                  <div key={request.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{request.athleteName}</h4>
                        <div className="text-sm text-muted-foreground">{getRequestTypeLabel(request.requestType)}</div>
                        <div className="text-sm text-muted-foreground mt-1">{request.description}</div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(request.status)}>
                          {request.status === "pending"
                            ? "En attente"
                            : request.status === "processing"
                              ? "En cours"
                              : request.status === "completed"
                                ? "Terminé"
                                : "Rejeté"}
                        </Badge>
                        <div className="text-sm text-muted-foreground">{request.requestDate}</div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {request.status === "pending" && (
                            <Button variant="ghost" size="icon">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Hébergement Européen:</strong> Toutes les données sont hébergées dans l'Union Européenne
              conformément aux exigences RGPD de résidence des données.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Sécurité des Données
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Chiffrement en transit</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex justify-between">
                  <span>Chiffrement au repos</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex justify-between">
                  <span>Authentification 2FA</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex justify-between">
                  <span>Audit des accès</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Droits à l'Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Consentements signés</span>
                  <span className="font-medium">
                    {consentRecords.filter((c) => c.consentType === "image_rights" && c.status === "granted").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Mineurs avec accord parental</span>
                  <span className="font-medium">
                    {consentRecords.filter((c) => c.consentType === "parental" && c.status === "granted").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Révocations traitées</span>
                  <span className="font-medium">{consentRecords.filter((c) => c.status === "revoked").length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Actions de Conformité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Button variant="outline" className="h-auto p-4 bg-transparent">
                  <div className="text-center">
                    <FileText className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Générer Rapport</div>
                    <div className="text-xs text-muted-foreground">Rapport de conformité RGPD</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4 bg-transparent">
                  <div className="text-center">
                    <Download className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Exporter Données</div>
                    <div className="text-xs text-muted-foreground">Export pour audit</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4 bg-transparent">
                  <div className="text-center">
                    <Trash2 className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Purge Automatique</div>
                    <div className="text-xs text-muted-foreground">Suppression programmée</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
