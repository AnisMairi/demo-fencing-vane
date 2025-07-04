import { ProtectedRoute } from "@/components/auth/protected-route"
import { Layout } from "@/components/layout/layout"
import { ComprehensiveAthleteProfile } from "@/components/athlete/comprehensive-athlete-profile"

export default function AthleteProfilePage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute>
      <Layout>
        <ComprehensiveAthleteProfile athleteId={params.id} />
      </Layout>
    </ProtectedRoute>
  )
}
