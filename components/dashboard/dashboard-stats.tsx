"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Users, MessageSquare, TrendingUp } from "lucide-react"

export function DashboardStats() {
  const stats = [
    {
      title: "Total Videos",
      value: "1,234",
      description: "+20.1% from last month",
      icon: Video,
    },
    {
      title: "Active Athletes",
      value: "89",
      description: "+5 new this week",
      icon: Users,
    },
    {
      title: "Messages",
      value: "456",
      description: "12 unread",
      icon: MessageSquare,
    },
    {
      title: "Engagement",
      value: "92%",
      description: "+2.5% from last week",
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
