import { ProtectedRoute } from "@/components/auth/protected-route"
import { Layout } from "@/components/layout/layout"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RoleBasedContent } from "@/components/dashboard/role-based-content"
import { RecentVideosTable } from "@/components/dashboard/recent-videos-table"
import { TopAthletes } from "@/components/dashboard/top-athletes"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex flex-col min-h-full pb-6">
          <div className="space-y-6 flex-1">
            <div>
              <h1 className="text-3xl font-bold">Tableau de bord</h1>
              <p className="text-muted-foreground">Bienvenue sur votre plateforme de détection de jeunes talents en escrime</p>
            </div>

            <DashboardStats />
            <RoleBasedContent />
            <RecentVideosTable />
            <TopAthletes />
          </div>

          {/* Footer */}
          <footer className="text-center text-[10px] text-muted-foreground pt-4 mt-auto">
            <p>
              © {new Date().getFullYear()} Fédération Française d'Escrime — Développé par{" "}
              <Link
                href="https://vane-solutions.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline underline-offset-4"
              >
                Vane Solutions
              </Link>
            </p>
          </footer>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
