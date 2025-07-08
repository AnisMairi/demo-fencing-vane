import React from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Layout } from "@/components/layout/layout"
import { ComprehensiveAthleteProfile } from "@/components/athlete/comprehensive-athlete-profile"

export default function AthleteProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  
  return (
    <ProtectedRoute>
      <Layout>
        <ComprehensiveAthleteProfile athleteId={resolvedParams.id} />
      </Layout>
    </ProtectedRoute>
  )
}
