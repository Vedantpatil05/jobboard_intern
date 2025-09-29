// Leaderboard component matching exact Figma design
export default function Leaderboard() {
  const items = [
    { name: "Sarah Chen", role: "Senior Software Engineer", score: 95, avatar: "SC" },
    { name: "Mike Rodriguez", role: "Full Stack Developer", score: 92, avatar: "MR" },
    { name: "Emily Zhang", role: "Frontend Developer", score: 89, avatar: "EZ" },
    { name: "Daniel Lee", role: "Backend Engineer", score: 85, avatar: "DL" },
    { name: "Sophia Turner", role: "DevOps Engineer", score: 84, avatar: "ST" },
    { name: "Raj Patel", role: "UI/UX Designer", score: 82, avatar: "RP" },
  ]

  return (
    <aside className="w-full lg:w-80 shrink-0">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Top matches leaderboard</h3>
        </div>

        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-semibold">{item.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm">{item.name}</div>
                <div className="text-xs text-gray-500">{item.role}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xs font-semibold">{i + 1}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
