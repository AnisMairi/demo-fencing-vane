"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Users, Shield } from "lucide-react"
import Link from "next/link"

export function RoleBasedContent() {
  const { user } = useAuth()

  const getContentByRole = () => {
    switch (user?.role) {
      case "local_contact":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Videos
                </CardTitle>
                <CardDescription>Upload new fencing videos for review and analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/videos/upload">Upload Video</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Uploads</CardTitle>
                <CardDescription>Your recently uploaded videos</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">5 videos uploaded this week</p>
              </CardContent>
            </Card>
          </div>
        )

      case "coach":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Athlete Management
                </CardTitle>
                <CardDescription>Manage and evaluate your athletes</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/athletes">View Athletes</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Evaluations</CardTitle>
                <CardDescription>Videos waiting for your review</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">12 videos pending evaluation</p>
              </CardContent>
            </Card>
          </div>
        )

      case "administrator":
        return (
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  System Administration
                </CardTitle>
                <CardDescription>Manage users and platform settings</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/admin">Admin Panel</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
                <CardDescription>Review flagged content</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">3 items need review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
                <CardDescription>View detailed platform statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/analytics">View Analytics</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Quick Actions</h2>
      {getContentByRole()}
    </div>
  )
}
