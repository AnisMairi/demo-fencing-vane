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
      <div className="flex">
        <aside className="hidden w-64 border-r bg-background md:block">
          <Sidebar />
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
