"use client"

import type React from "react"

import { Header } from "./header"
import { Sidebar } from "./sidebar"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex h-[calc(100vh-3.5rem)]">
        <aside className="relative w-64 border-r bg-background overflow-y-auto">
          <Sidebar />
        </aside>
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
