import Leaderboard from "@/components/Leaderboard"
import JobCard from "@/components/JobCard"

async function getData() {
  try {
    // ✅ Call the backend API running on port 5000
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
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
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
    const res = await fetch(`${backendUrl}/api/stats/skill-stats`, {
      cache: "no-store", // always fresh
    })
    if (!res.ok) throw new Error("Failed to fetch skill stats")
    return await res.json()
  } catch (err) {
    console.error("Error fetching skill stats:", err)
    // Return fallback data in case of error
    return { skillScore: 0, completedRoadmaps: 0, totalRoadmaps: 0, certificates: 0 }
  }
}

export default async function HomePage() {
  const { matches, user } = await getData()
  const skillStats = await getSkillStats()
  const isLoggedIn = !!user

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- Hero + Search --- */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Connecting exceptional talent with
          </h1>
          <h1 className="text-3xl font-semibold text-gray-900 mb-8">bold visions</h1>

          {/* Search bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 p-1">
              <div className="flex items-center flex-1 px-3">
                <svg
                  className="w-4 h-4 text-gray-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  className="flex-1 py-2 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 text-sm"
                  placeholder="Search your dream job"
                />
              </div>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-md text-sm">
                Filter
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm">
                Search
              </button>
            </div>
          </div>

          {/* Real stats from backend */}
          <div className="flex justify-center gap-12 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{skillStats.skillScore}%</div>
              <div className="text-sm text-gray-600">Skillscore</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{skillStats.completedRoadmaps}</div>
              <div className="text-sm text-gray-600">Roadmaps</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{skillStats.certificates}</div>
              <div className="text-sm text-gray-600">Certificates</div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm">
              I am a job seeker
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-700 font-medium px-6 py-2.5 rounded-lg border border-gray-300 text-sm">
              I am a recruiter
            </button>
          </div>
        </div>
      </div>

      {/* --- Job Matches --- */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          <div className="bg-white rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Your Top Matches</h2>
                <span className="text-sm text-gray-500">{matches.length} jobs</span>
              </div>

              <div className="max-h-[600px] overflow-y-auto space-y-4 pr-2">
                {matches.map((match: any) => (
                  <JobCard
                    key={match.jobId}
                    job={match}
                    match={match.matchPercent}
                    isLoggedIn={isLoggedIn}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-6 lg:self-start">
            <Leaderboard />
          </div>
        </div>
      </div>
    </div>
  )
}
