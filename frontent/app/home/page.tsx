import { SearchBar } from "@/components/search-bar"
import { JobList } from "@/components/JobList"
import { SkillPassport } from "@/components/skill-passport"
import { Leaderboard } from "@/components/leaderboard"
import { TopBarProfile } from "@/components/topbar-profile"
import { SearchProvider } from "@/components/search-context"
import { HoverProvider } from "@/components/hover-context"

async function getData() {
  try {
    // ✅ Call the backend API running on port 5000
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001"
    const res = await fetch(`${backendUrl}/api/match/match`, {
      cache: "no-store", // always fresh
    })
    if (!res.ok) throw new Error("Failed to fetch match data")
    return await res.json()
  } catch (err) {
    console.error("Error fetching matches:", err)
    return { matches: [], user: null }
  }
}

async function getSkillStats() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001"
    const res = await fetch(`${backendUrl}/api/stats/skill-stats`, {
      cache: "no-store", // always fresh
    })
    if (!res.ok) throw new Error("Failed to fetch skill stats")
    return await res.json()
  } catch (err) {
    console.error("Error fetching skill stats:", err)
    // Return fallback data in case of error
    return {
      skillScore: 0,
      personaScore: 0,
      overallScore: 0,
      completedRoadmaps: 0,
      totalRoadmaps: 0,
      certificates: 0,
      personalityCategoryScores: {},
      softSkillScores: {}
    }
  }
}

export default async function Page() {
  let matches = []
  let user = null
  let skillStats = {
    skillScore: 0,
    personaScore: 0,
    overallScore: 0,
    completedRoadmaps: 0,
    totalRoadmaps: 0,
    certificates: 0,
    personalityCategoryScores: {},
    softSkillScores: {}
  }

  try {
    const data = await getData()
    matches = data.matches || []
    user = data.user || null
  } catch (error) {
    console.error("Error fetching match data:", error)
    matches = []
    user = null
  }

  try {
    skillStats = await getSkillStats()
  } catch (error) {
    console.error("Error fetching skill stats:", error)
    skillStats = {
      skillScore: 0,
      personaScore: 0,
      overallScore: 0,
      completedRoadmaps: 0,
      totalRoadmaps: 0,
      certificates: 0,
      personalityCategoryScores: {},
      softSkillScores: {}
    }
  }

  // Debug logging for skill stats
  if (process.env.NODE_ENV === 'development') {
    console.log("Home page received skillStats:", skillStats)
  }

  const isLoggedIn = !!user

  return (
    <SearchProvider>
      <HoverProvider>
        <main className="h-screen bg-gray-50 text-gray-900 overflow-hidden">
          <div className="mx-auto max-w-6xl px-6 py-4 h-full flex flex-col">
            {/* Main content area - two column layout */}
            <div className="flex gap-4 flex-1 min-h-0">
              {/* Left column - everything (greeting, search, jobs) */}
              <div className="flex-1 flex flex-col min-h-0">
                {/* Greeting and Search - Fixed */}
                <div className="mb-4 flex-shrink-0">
                  <h1 className="text-2xl font-semibold tracking-tight mb-3 text-gray-900">
                    Hi {user?.name || 'User'}, here's your growth journey!
                  </h1>
                  <SearchBar />
                </div>

                {/* Scrollable Jobs Section */}
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="mb-3 flex-shrink-0">
                    <h2 className="text-lg font-medium text-gray-900">Job Matches</h2>
                  </div>
                  <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-white">
                    <JobList jobs={matches} />
                  </div>
                </div>
              </div>

              {/* Right column - progress widgets */}
              <aside className="w-72 flex-shrink-0 flex flex-col min-h-0">
                <div className="mb-3 flex-shrink-0">
                  <h2 className="text-lg font-medium text-gray-900">Your Progress</h2>
                </div>

                {/* Skill Passport - top */}
                <div className="mb-4 flex-shrink-0">
                  <SkillPassport
                    overall={skillStats.overallScore || 0}
                    skillScore={skillStats.skillScore || 0}
                    personaScore={skillStats.personaScore || 0}
                    userData={{
                      completedRoadmaps: skillStats.completedRoadmaps || 0,
                      totalRoadmaps: skillStats.totalRoadmaps || 0,
                      personalityCategoryScores: skillStats.personalityCategoryScores || {},
                      softSkillScores: skillStats.softSkillScores || {}
                    }}
                  />
                </div>

                {/* Leaderboard - bottom, scrollable */}
                <div className="flex-1 min-h-0">
                  <div className="bg-white rounded-lg p-3 h-full flex flex-col border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Leaderboard</h3>
                    <div className="flex-1 overflow-y-auto">
                      <Leaderboard
                        items={[
                          { name: "Sarah Chen", subtitle: "TechCorp • Senior Frontend Developer", score: 98 },
                          { name: "Mike Rodriguez", subtitle: "Startup XYZ • Full Stack Engineer", score: 96 },
                          { name: "Emily Zhang", subtitle: "DesignStudio • React Developer", score: 94 },
                          { name: "Daniel Lee", subtitle: "DataVision • Machine Learning Engineer", score: 85 },
                          { name: "Sophia Turner", subtitle: "CreativeHub • UI/UX Designer", score: 84 },
                          { name: "Raj Patel", subtitle: "SkyNets • Cloud Solutions Architect", score: 83 },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </HoverProvider>
    </SearchProvider>
  )
}
