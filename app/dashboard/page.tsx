import { ProtectedRoute } from "@/components/auth/protected-route"
import { Layout } from "@/components/layout/layout"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RoleBasedContent } from "@/components/dashboard/role-based-content"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your fencing platform dashboard</p>
          </div>

          <DashboardStats />
          <RoleBasedContent />
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
