import { ProtectedRoute } from "@/components/auth/protected-route"
import { Layout } from "@/components/layout/layout"
import { TechnicalEvaluationInterface } from "@/components/evaluation/technical-evaluation-interface"

export default function AthleteEvaluationPage({ params }: { params: { id: string } }) {
  const handleSaveEvaluation = (evaluation: any) => {
    console.log("Saving evaluation:", evaluation)
    // In real app, this would save to database
  }

  return (
    <ProtectedRoute allowedRoles={["coach", "administrator"]}>
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Évaluation Technique</h1>
            <p className="text-muted-foreground">Évaluer les performances et compétences de l'athlète</p>
          </div>

          <TechnicalEvaluationInterface athleteId={params.id} onSave={handleSaveEvaluation} />
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
