// Match percentage badge with circular progress indicator
export default function MatchBadge({ pct }: { pct: number }) {
  const circumference = 2 * Math.PI * 16 // radius = 16
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (pct / 100) * circumference

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-12 w-12" aria-label={`Match ${pct}%`}>
        <svg className="h-12 w-12 transform -rotate-90" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="none" className="text-gray-200" />
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="text-blue-500 transition-all duration-300"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-gray-900">{pct}%</span>
        </div>
      </div>
      <span className="text-sm font-medium text-gray-700">Match</span>
    </div>
  )
}
