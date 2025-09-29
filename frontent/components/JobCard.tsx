"use client"

import Link from "next/link"
import type { Job } from "@/types"

interface JobCardProps {
  job: Job
  match: number
  isLoggedIn: boolean
}

export default function JobCard({ job, match, isLoggedIn }: JobCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Company logo */}
        <div className="flex-shrink-0">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={`${job.company} logo`}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {job.company?.charAt(0) || "C"}
              </span>
            </div>
          )}
        </div>

        {/* Job details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              {/* ✅ Updated link */}
              <Link href={`/home/${job.jobId}`}>
                <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                  {job.title}
                </h3>
              </Link>
              <p className="text-sm text-gray-600">
                {job.company} • {job.location} • {job.postedAt}
              </p>
            </div>

            {/* Bookmark icon */}
            <button className="text-gray-400 hover:text-gray-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>
          </div>

          {/* Skills tags - extract from requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {job.requirements
                .slice(0, 4)
                .map((requirement: string, index: number) => {
                  const skillMatch = requirement.match(
                    /\b(React|TypeScript|JavaScript|CSS|Node\.?js|Python|Java|C\+\+|SQL|MongoDB|PostgreSQL|AWS|Docker|Kubernetes|GraphQL|Vue|Angular|Svelte|PHP|Ruby|Go|Rust|Swift|Kotlin|Flutter|iOS|Android|Machine Learning|AI|Data Science|DevOps|Git|Linux|Windows|macOS)\b/i
                  )
                  if (skillMatch) {
                    const skill = skillMatch[1]
                    const colors = [
                      "bg-green-100 text-green-800",
                      "bg-blue-100 text-blue-800",
                      "bg-purple-100 text-purple-800",
                      "bg-orange-100 text-orange-800",
                    ]
                    const colorClass = colors[index % colors.length]
                    return (
                      <span
                        key={index}
                        className={`px-2 py-1 ${colorClass} text-xs rounded-full`}
                      >
                        {skill}
                      </span>
                    )
                  }
                  return null
                })
                .filter(Boolean)}
            </div>
          )}

          {/* Show employment type or seniority level */}
          {(job.employmentType || job.seniorityLevel) && (
            <p className="text-sm text-gray-600 mb-4">
              {job.employmentType && job.seniorityLevel
                ? `${job.seniorityLevel} • ${job.employmentType}`
                : job.employmentType || job.seniorityLevel}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {/* ✅ Updated link */}
              <Link href={`/home/${job.jobId}`}>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                  View Details
                </button>
              </Link>
              <a
                href={job.applyUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors inline-block"
              >
                Apply Now
              </a>
            </div>
          </div>
        </div>

        {/* Match percentage breakdown or login prompt */}
        <div className="flex-shrink-0">
          {isLoggedIn ? (
            <div className="text-center">
              {/* Main match percentage circle */}
              <div className="relative w-16 h-16 mb-2">
                <svg
                  className="w-16 h-16 transform -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray={`${match}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-900">
                    {match}%
                  </span>
                </div>
              </div>
              
              {/* Hard and soft skill percentages */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Hard Skills:</span>
                  <span className="font-medium text-green-600">{job.hardSkillPercent || 0}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Soft Skills:</span>
                  <span className="font-medium text-purple-600">{job.softSkillPercent || 0}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Average:</span>
                  <span className="font-medium text-blue-600">{match}%</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-16 text-center">
              <div className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">
                Login to see skill match
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
