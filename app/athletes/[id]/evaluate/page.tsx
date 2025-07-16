"use client"
import React, { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Layout } from "@/components/layout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Save, Send, Eye, BarChart3, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useEvaluationApi } from "@/hooks/use-evaluation-api"
import { useVideoApi } from "@/hooks/use-video-api"
import { useToast } from "@/hooks/use-toast"
import { Loading } from "@/components/common/loading"

export default function AthleteEvaluationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const { user } = useAuth()
  const { createEvaluation } = useEvaluationApi()
  const { getVideos } = useVideoApi()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [videos, setVideos] = useState<any[]>([])
  const [selectedVideoId, setSelectedVideoId] = useState<string>("")
  const [evaluation, setEvaluation] = useState({
    technique_score: 5,
    tactics_score: 5,
    physical_score: 5,
    mental_score: 5,
    strengths: "",
    areas_for_improvement: "",
    specific_feedback: "",
    recommendations: ""
  })

  // Load videos for this athlete
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const response = await getVideos({ 
          athleteRight_id: parseInt(resolvedParams.id),
          limit: 100 
        })
        setVideos(response.videos || [])
      } catch (err) {
        console.error("Error loading videos:", err)
        toast({
          title: "Erreur",
          description: "Impossible de charger les vidéos de l'athlète",
          variant: "destructive",
        })
      }
    }
    loadVideos()
  }, [resolvedParams.id, getVideos, toast])

  const handleSaveEvaluation = async () => {
    if (!selectedVideoId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une vidéo pour l'évaluation",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const evaluationData = {
        athlete_id: parseInt(resolvedParams.id),
        technique_score: evaluation.technique_score,
        tactics_score: evaluation.tactics_score,
        physical_score: evaluation.physical_score,
        mental_score: evaluation.mental_score,
        overall_score: calculateOverallScore(),
        comments: evaluation.specific_feedback || "",
        strengths: evaluation.strengths || undefined,
        areas_for_improvement: evaluation.areas_for_improvement || undefined,
        specific_feedback: evaluation.specific_feedback || undefined,
        recommendations: evaluation.recommendations || undefined,
      }

      await createEvaluation(parseInt(selectedVideoId), evaluationData)
      
      toast({
        title: "Succès",
        description: "Évaluation enregistrée avec succès",
      })
      
      // Reset form
      setEvaluation({
        technique_score: 5,
        tactics_score: 5,
        physical_score: 5,
        mental_score: 5,
        strengths: "",
        areas_for_improvement: "",
        specific_feedback: "",
        recommendations: ""
      })
      setSelectedVideoId("")
      
    } catch (err) {
      console.error("Error saving evaluation:", err)
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'évaluation",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateOverallScore = () => {
    const scores = [
      evaluation.technique_score,
      evaluation.tactics_score,
      evaluation.physical_score,
      evaluation.mental_score
    ]
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600"
    if (score >= 6) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 9) return "Excellent"
    if (score >= 8) return "Très Bien"
    if (score >= 7) return "Bien"
    if (score >= 6) return "Satisfaisant"
    if (score >= 5) return "Moyen"
    return "À Améliorer"
  }

  return (
    <ProtectedRoute allowedRoles={["coach", "administrator"]}>
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Évaluation Technique</h1>
            <p className="text-muted-foreground">Évaluer les performances et compétences de l'athlète</p>
          </div>

          {/* Video Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Sélection de la Vidéo</CardTitle>
            </CardHeader>
            <CardContent>
              {videos.length === 0 ? (
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>Aucune vidéo disponible pour cet athlète. Une vidéo est requise pour créer une évaluation.</span>
                </div>
              ) : (
                <Select value={selectedVideoId} onValueChange={setSelectedVideoId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une vidéo pour l'évaluation" />
                  </SelectTrigger>
                  <SelectContent>
                    {videos.map((video) => (
                      <SelectItem key={video.id} value={video.id.toString()}>
                        {video.title} - {new Date(video.created_at).toLocaleDateString('fr-FR')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
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
                <div className="text-muted-foreground">Note Globale (sur 10)</div>
              </div>
            </CardContent>
          </Card>

          {/* Evaluation Criteria */}
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { key: 'technique_score', label: 'Technique', description: 'Exécution des mouvements techniques, précision des gestes' },
              { key: 'tactics_score', label: 'Tactique', description: 'Stratégie de combat, lecture de l\'adversaire' },
              { key: 'physical_score', label: 'Physique', description: 'Condition physique, endurance, vitesse' },
              { key: 'mental_score', label: 'Mental', description: 'Gestion du stress, concentration, détermination' }
            ].map(({ key, label, description }) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{label}</span>
                    <Badge variant="outline">{evaluation[key as keyof typeof evaluation]}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>0</span>
                      <span>5</span>
                      <span>10</span>
                    </div>
                    <Slider
                      value={[evaluation[key as keyof typeof evaluation] as number]}
                      onValueChange={(value) => setEvaluation(prev => ({ ...prev, [key]: value[0] }))}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Text Feedback */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Points Forts</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Décrivez les points forts de l'athlète..."
                  value={evaluation.strengths}
                  onChange={(e) => setEvaluation(prev => ({ ...prev, strengths: e.target.value }))}
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Axes d'Amélioration</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Identifiez les axes d'amélioration..."
                  value={evaluation.areas_for_improvement}
                  onChange={(e) => setEvaluation(prev => ({ ...prev, areas_for_improvement: e.target.value }))}
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Feedback Spécifique</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Donnez un feedback détaillé sur la performance..."
                value={evaluation.specific_feedback}
                onChange={(e) => setEvaluation(prev => ({ ...prev, specific_feedback: e.target.value }))}
                rows={4}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommandations</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Proposez des recommandations pour l'entraînement..."
                value={evaluation.recommendations}
                onChange={(e) => setEvaluation(prev => ({ ...prev, recommendations: e.target.value }))}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" disabled={loading}>
              Annuler
            </Button>
            <Button 
              onClick={handleSaveEvaluation} 
              disabled={loading || !selectedVideoId || videos.length === 0}
              className="min-w-[120px]"
            >
              {loading ? <Loading /> : <Save className="h-4 w-4 mr-2" />}
              Enregistrer
            </Button>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
