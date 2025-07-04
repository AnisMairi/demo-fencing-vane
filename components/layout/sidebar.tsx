"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, Video, Users, MessageSquare, Shield, BarChart3, Upload, Bell, Star, FileText } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const { user } = useAuth()
  const pathname = usePathname()

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      roles: ["local_contact", "coach", "administrator"],
    },
    {
      name: "Videos",
      href: "/videos",
      icon: Video,
      roles: ["local_contact", "coach", "administrator"],
    },
    {
      name: "Upload Video",
      href: "/videos/upload",
      icon: Upload,
      roles: ["local_contact", "coach"],
    },
    {
      name: "Athletes",
      href: "/athletes",
      icon: Users,
      roles: ["local_contact", "coach", "administrator"],
    },
    {
      name: "Messages",
      href: "/messages",
      icon: MessageSquare,
      roles: ["local_contact", "coach", "administrator"],
    },
    {
      name: "Notifications",
      href: "/notifications",
      icon: Bell,
      roles: ["local_contact", "coach", "administrator"],
      badge: "3", // Mock unread count
    },
    {
      name: "Évaluations",
      href: "/evaluations",
      icon: Star,
      roles: ["coach", "administrator"],
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
      roles: ["coach", "administrator"],
    },
    {
      name: "RGPD",
      href: "/gdpr",
      icon: FileText,
      roles: ["administrator"],
    },
    {
      name: "Admin",
      href: "/admin",
      icon: Shield,
      roles: ["administrator"],
    },
  ]

  const filteredNavigation = navigation.filter((item) => item.roles.includes(user?.role || "local_contact"))

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Navigation</h2>
          <div className="space-y-1">
            {filteredNavigation.map((item) => (
              <Button
                key={item.name}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                  {item.badge && (
                    <Badge variant="destructive" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
