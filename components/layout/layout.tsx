"use client"

import type React from "react"

import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { Footer } from "./footer"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="w-full h-screen min-h-screen min-w-full bg-background flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0 min-w-0 h-full w-full">
        <aside className="relative w-64 border-r bg-background overflow-y-auto h-full min-h-0">
          <Sidebar />
        </aside>
        <main className="flex-1 p-6 px-6 overflow-y-auto h-full min-h-0 min-w-0 flex flex-col">
          <div className="flex-1">{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  )
}
