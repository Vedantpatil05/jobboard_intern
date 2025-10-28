"use client"

import { PieChart, Pie, Cell } from "recharts"
import { useHover } from "./hover-context"
import { useState, useEffect } from "react"

export function SkillPassport({
  overall,
  skillScore,
  personaScore,
  userData,
}: {
  overall: number
  skillScore: number
  personaScore: number
  userData: {
    completedRoadmaps: number
    totalRoadmaps: number
    personalityCategoryScores: any
    softSkillScores: any
  }
}) {
  const { hoveredJobId } = useHover()
  const [jobMatch, setJobMatch] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Debug logging - only in development
  if (process.env.NODE_ENV === 'development') {
    console.log("SkillPassport received props:", {
      overall,
      skillScore,
      personaScore,
      hoveredJobId,
      userData
    })
  }

  // Fetch job-specific match data when hovering
  useEffect(() => {
    if (hoveredJobId) {
      setLoading(true)
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/stats/job-match/${hoveredJobId}`)
        .then(res => res.json())
        .then(data => {
          if (process.env.NODE_ENV === 'development') {
            console.log("Job match data received:", data)
          }
          setJobMatch(data)
          setLoading(false)
        })
        .catch(err => {
          console.error("Error fetching job match:", err)
          setLoading(false)
        })
    } else {
      setJobMatch(null)
    }
  }, [hoveredJobId])

  // Show job-specific data when hovering
  if (jobMatch && !loading) {
    const jobOverall = jobMatch.overallMatchPercent || 0
    const jobHardSkill = jobMatch.hardSkillPercent || 0
    const jobSoftSkill = jobMatch.softSkillPercent || 0

    return (
      <div className="rounded-2xl bg-white p-4 shadow-lg border">
        <h3 className="mb-3 text-sm font-medium text-gray-900">
          Job Match: {jobMatch.jobTitle || 'Unknown Job'}
        </h3>

        <div className="rounded-xl bg-gray-50 p-3">
          <div className="mx-auto flex w-full flex-col items-center">
            <PieChart width={120} height={100} className="mb-1">
              <Pie
                data={[
                  { name: "match", value: jobOverall },
                  { name: "rest", value: 100 - jobOverall }
                ]}
                dataKey="value"
                cx={60}
                cy={50}
                innerRadius={28}
                outerRadius={40}
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                <Cell key="match" fill="#3086ff" />
                <Cell key="rest" fill="rgba(48,134,255,0.15)" />
              </Pie>
            </PieChart>
            <div className="mb-2 -mt-12 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md text-sm font-semibold text-gray-900">
              {jobOverall}%
            </div>
            <div className="text-xs font-medium text-gray-900">Job Match</div>
          </div>

          <div className="mt-3 space-y-2">
            <Bar label="Hard Skills" value={jobHardSkill} />
            <Bar label="Soft Skills" value={jobSoftSkill} accent />
          </div>
        </div>
      </div>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-lg border">
        <h3 className="mb-3 text-sm font-medium text-gray-900">Calculating Match...</h3>
        <div className="rounded-xl bg-gray-50 p-3">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show user stats when not hovering over any job
  const safeOverall = Math.max(0, Math.min(100, overall || 0))
  const safeSkillScore = Math.max(0, Math.min(100, skillScore || 0))
  const safePersonaScore = Math.max(0, Math.min(100, personaScore || 0))

  console.log('🎨 SkillPassport rendering with:', {
    overall: safeOverall,
    skillScore: safeSkillScore,
    personaScore: safePersonaScore,
    hasData: safeOverall > 0 || safeSkillScore > 0 || safePersonaScore > 0
  })

  const data = [
    { name: "value", value: safeOverall },
    { name: "rest", value: 100 - safeOverall },
  ]

  // Don't render if we don't have valid data
  if (safeOverall === 0 && safeSkillScore === 0 && safePersonaScore === 0) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-lg border min-h-[200px]">
        <h3 className="mb-3 text-sm font-medium text-gray-900">Skill Passport</h3>
        <div className="rounded-xl bg-gray-50 p-3">
          <div className="text-center text-gray-500 text-sm">
            ⚠️ No data received from API
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-lg border min-h-[200px]">
      <h3 className="mb-3 text-sm font-medium text-gray-900">Skill Passport</h3>

      <div className="rounded-xl bg-gray-50 p-3">
        <div className="mx-auto flex w-full flex-col items-center">
          <PieChart width={120} height={100} className="mb-1">
            <Pie
              data={data}
              dataKey="value"
              cx={60}
              cy={50}
              innerRadius={28}
              outerRadius={40}
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              <Cell key="val" fill="#3086ff" />
              <Cell key="rest" fill="rgba(48,134,255,0.15)" />
            </Pie>
          </PieChart>
          <div className="mb-2 -mt-12 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md text-sm font-semibold text-gray-900">
            {safeOverall}%
          </div>
          <div className="text-xs font-medium text-gray-900">Overall</div>
        </div>

        <div className="mt-3 space-y-2">
          <Bar label="Skills" value={safeSkillScore} />
          <Bar label="Persona" value={safePersonaScore} accent />
        </div>
      </div>
    </div>
  )
}

function Bar({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  const safeValue = Math.max(0, Math.min(100, value || 0))

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[10px] text-gray-600">
        <span className="truncate">{label}</span>
        <span className="text-gray-900 ml-2">{safeValue}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{
            width: `${safeValue}%`,
            background: accent ? "rgba(48,134,255,0.6)" : "#3086ff",
          }}
        />
      </div>
    </div>
  )
}
