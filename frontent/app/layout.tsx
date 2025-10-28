import type React from "react"
// Root layout with navigation header
import "./globals.css"
import { TopBarProfile } from "@/components/topbar-profile"

async function getUserData() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001"
    const res = await fetch(`${backendUrl}/api/match/match`, {
      cache: "no-store",
    })
    if (!res.ok) throw new Error("Failed to fetch user data")
    const data = await res.json()
    return data.user || null
  } catch (err) {
    console.error("Error fetching user data:", err)
    return null
  }
}

export const metadata = {
  title: "EdQuest Job Board",
  description: "Connecting exceptional talent with bold visions",
  generator: "v0.app",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUserData()

  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <header className="border-b border-gray-200 bg-white shadow-sm">
          <nav className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
            <div className="rounded-full bg-[var(--surface)] shadow-neo px-5 py-3 text-sm text-[var(--text)]">
              Job Board
            </div>
            <TopBarProfile user={user} />
          </nav>
        </header>

        <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
          <div className="mx-auto max-w-6xl px-6 py-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
