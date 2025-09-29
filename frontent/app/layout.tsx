import type React from "react"
// Root layout with navigation header
import "./globals.css"
import Link from "next/link"
import AvatarMenu from "@/components/AvatarMenu"

export const metadata = {
  title: "EdQuest Job Board",
  description: "Connecting exceptional talent with bold visions",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const logo = process.env.NEXT_PUBLIC_FIGMA_NAV_LOGO_URL || "/job-board-logo.png"

  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <header className="border-b border-gray-200 bg-white shadow-sm">
          <nav className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
            {/* 👇 Change href to /home instead of / */}
            <Link href="/home" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">JS</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Job Board</span>
            </Link>

            <AvatarMenu />
          </nav>
        </header>

        <main>{children}</main>
      </body>
    </html>
  )
}
