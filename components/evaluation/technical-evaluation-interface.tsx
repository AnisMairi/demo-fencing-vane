"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Save, Send, Eye, BarChart3 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface EvaluationCriteria {
  posture: number
  speed: number
  positioning: number
  technique: number
  tactics: number
  mentalStrength: number
  adaptability: number
  consistency: number
}

interface TechnicalEvaluationInterfaceProps {
  athleteId: string
  videoId?: string
  onSave: (evaluation: any) => void
}

export function TechnicalEvaluationInterface({ athleteId, videoId, onSave }: TechnicalEvaluationInterfaceProps) {
  const { user } = useAuth()
  const [evaluation, setEvaluation] = useState<EvaluationCriteria>({
    posture: 50,
    speed: 50,
    positioning: 50,
    technique: 50,
    tactics: 50,
    mentalStrength: 50,
    adaptability: 50,
    consistency: 50,
  })

  const [comments, setComments] = useState("")
  const [evaluationType, setEvaluationType] = useState<"video" | "general">(videoId ? "video" : "general")
  const [visibility, setVisibility] = useState<"private" | "coach" | "public">("private")

  const criteriaLabels = {
    posture: "Posture et Garde",
    speed: "Vitesse d'Exécution",
    positioning: "Positionnement",
    technique: "Technique",
    tactics: "Tactique",
    mentalStrength: "Force Mentale",
    adaptability: "Adaptabilité",
    consistency: "Régularité",
  }

  const criteriaDescriptions = {
    posture: "Position du corps, équilibre, garde défensive et offensive",
    speed: "Rapidité des mouvements, temps de réaction, vitesse d'attaque",
    positioning: "Placement sur la piste, gestion de la distance",
    technique: "Exécution des mouvements techniques, précision des gestes",
    tactics: "Stratégie de combat, lecture de l'adversaire, adaptation tactique",
    mentalStrength: "Gestion du stress, concentration, détermination",
    adaptability: "Capacité à s'adapter aux différents styles d'adversaires",
    consistency: "Régularité dans les performances, fiabilité",
  }

  const updateCriteria = (key: keyof EvaluationCriteria, value: number[]) => {
    setEvaluation((prev) => ({ ...prev, [key]: value[0] }))
  }

  const calculateOverallScore = () => {
    const values = Object.values(evaluation)
    return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent"
    if (score >= 80) return "Très Bien"
    if (score >= 70) return "Bien"
    if (score >= 60) return "Satisfaisant"
    if (score >= 50) return "Moyen"
    return "À Améliorer"
  }

  const handleSave = () => {
    const evaluationData = {
      athleteId,
      videoId,
      evaluator: user?.name,
      evaluatorRole: user?.role,
      date: new Date().toISOString(),
      type: evaluationType,
      visibility,
      criteria: evaluation,
      overallScore: calculateOverallScore(),
      comments,
    }
    onSave(evaluationData)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Évaluation Technique</h1>
          <p className="text-muted-foreground">
            {videoId ? "Évaluation basée sur une vidéo spécifique" : "Évaluation générale de l'athlète"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Aperçu
          </Button>
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Statistiques
          </Button>
        </div>
      </div>

      {/* Evaluation Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres d'Évaluation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Type d'Évaluation</Label>
              <Select value={evaluationType} onValueChange={(value: any) => setEvaluationType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Évaluation Vidéo</SelectItem>
                  <SelectItem value="general">Évaluation Générale</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Visibilité</Label>
              <Select value={visibility} onValueChange={(value: any) => setVisibility(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Privé (Évaluateur uniquement)</SelectItem>
                  <SelectItem value="coach">Entraîneurs</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Évaluateur</Label>
              <div className="p-2 bg-muted rounded-md">
                <span className="font-medium">{user?.name}</span>
                <Badge variant="outline" className="ml-2">
                  {user?.role === "coach"
                    ? "Entraîneur"
                    : user?.role === "administrator"
                      ? "Administrateur"
                      : "Contact Local"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Score Display */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <div className={`text-6xl font-bold ${getScoreColor(calculateOverallScore())}`}>
              {calculateOverallScore()}
            </div>
            <div className="text-xl font-semibold">{getScoreLabel(calculateOverallScore())}</div>
            <div className="text-muted-foreground">Note Globale</div>
          </div>
        </CardContent>
      </Card>

      {/* Evaluation Criteria */}
      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(evaluation).map(([key, value]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{criteriaLabels[key as keyof EvaluationCriteria]}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold ${getScoreColor(value)}`}>{value}</span>
                  <Star className={`h-5 w-5 ${value >= 80 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{criteriaDescriptions[key as keyof EvaluationCriteria]}</p>
              <div className="space-y-2">
                <Slider
                  value={[value]}
                  onValueChange={(newValue) => updateCriteria(key as keyof EvaluationCriteria, newValue)}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 - À améliorer</span>
                  <span>50 - Moyen</span>
                  <span>100 - Excellent</span>
                </div>
              </div>
              <div className="text-center">
                <Badge variant={value >= 80 ? "default" : value >= 60 ? "secondary" : "destructive"}>
                  {getScoreLabel(value)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle>Commentaires et Observations</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Ajoutez vos observations détaillées, points forts, axes d'amélioration, recommandations..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={6}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => console.log("Save as draft")}>
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder Brouillon
        </Button>
        <Button onClick={handleSave}>
          <Send className="h-4 w-4 mr-2" />
          Publier Évaluation
        </Button>
      </div>

      {/* Evaluation Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé de l'Évaluation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{calculateOverallScore()}</div>
              <div className="text-sm text-muted-foreground">Note Globale</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Object.values(evaluation).filter((v) => v >= 80).length}
              </div>
              <div className="text-sm text-muted-foreground">Points Forts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {Object.values(evaluation).filter((v) => v >= 60 && v < 80).length}
              </div>
              <div className="text-sm text-muted-foreground">À Développer</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {Object.values(evaluation).filter((v) => v < 60).length}
              </div>
              <div className="text-sm text-muted-foreground">À Améliorer</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
