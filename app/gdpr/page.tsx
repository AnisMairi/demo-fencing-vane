import { ProtectedRoute } from "@/components/auth/protected-route"
import { Layout } from "@/components/layout/layout"
import { ConsentManagement } from "@/components/gdpr/consent-management"

export default function GDPRPage() {
  return (
    <ProtectedRoute allowedRoles={["administrator"]}>
      <Layout>
        <ConsentManagement />
      </Layout>
    </ProtectedRoute>
  )
}
