"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TechnicalEvaluationInterface } from "@/components/evaluation/technical-evaluation-interface"
import { useEvaluationApi } from "@/hooks/use-evaluation-api"
import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"

interface EvaluationModalProps {
  isOpen: boolean
  onClose: () => void
  videoId: string
  athleteId: string
  athleteName: string
  onEvaluationSubmitted: () => void
}

export function EvaluationModal({
  isOpen,
  onClose,
  videoId,
  athleteId,
  athleteName,
  onEvaluationSubmitted
}: EvaluationModalProps) {
  const { createEvaluation } = useEvaluationApi()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSave = async (evaluationData: any) => {
    try {
      setIsSubmitting(true)
      
      // Transform the evaluation data to match the API schema
      const apiEvaluationData = {
        athlete_id: parseInt(athleteId),
        technique_score: evaluationData.criteria.technique,
        tactics_score: evaluationData.criteria.tactics,
        speed_score: evaluationData.criteria.speed,
        mental_strength_score: evaluationData.criteria.mentalStrength,
        overall_score: parseFloat(evaluationData.overallScore),
        comments: evaluationData.comments,
      }

      await createEvaluation(parseInt(videoId), apiEvaluationData)
      
      toast({
        title: "Évaluation soumise",
        description: `L'évaluation de ${athleteName} a été enregistrée avec succès.`,
      })
      
      onEvaluationSubmitted()
      onClose()
    } catch (error: any) {
      console.error('Error submitting evaluation:', error)
      
      let errorMessage = "Erreur lors de la soumission de l'évaluation."
      if (error?.message) {
        errorMessage = error.message
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Évaluer {athleteName}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <TechnicalEvaluationInterface
            athleteId={athleteId}
            videoId={videoId}
            onSave={handleSave}
          />
        </div>
        
        {isSubmitting && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg">
              <p>Soumission de l'évaluation...</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 