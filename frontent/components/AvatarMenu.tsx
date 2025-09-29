"use client"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
// import userData from "../data/edquest.user.json"
// import avatarsData from "../data/avatars.json"

interface UserData {
  name: string
  avatar: string
}

export default function AvatarMenu() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // ✅ Fetch user data from backend API
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
        const response = await fetch(`/api/match/match`)
        
        if (response.ok) {
          const data = await response.json()
          const userData = data.user
          
          if (userData && userData.name) {
            setUser({
              name: userData.name,
              avatar: userData.avatarName || "/placeholder.svg?height=32&width=32"
            })
          } else {
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Failed to load user data:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <Link href="/login">
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            />
          </svg>
          Login
        </button>
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-900 hidden sm:block">{user.name}</span>
      <Image
        src={user.avatar || "/placeholder.svg?height=32&width=32"}
        alt={`${user.name} Avatar`}
        width={32}
        height={32}
        className="rounded-full border-2 border-gray-200"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.src = "/placeholder.svg?height=32&width=32"
        }}
      />
    </div>
  )
}
