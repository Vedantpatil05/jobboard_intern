"use client"

import { useState } from "react"
import { Bookmark, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useHover } from "./hover-context"

type Props = {
  jobId: string
  companyLogo: string
  role: string
  company: string
  tags?: string[]
  meta: string
  skills: string[]
  preferred: string
  cta: string
  detailsLabel: string
  aboutCompany?: string
  roleOverview?: string
  responsibilities?: string[]
  requirements?: string[]
  jobDescription?: string
  matchPercent?: number
}

export function JobCard({
  jobId,
  companyLogo,
  role,
  company,
  tags = [],
  meta,
  skills,
  preferred,
  cta,
  detailsLabel,
  aboutCompany,
  roleOverview,
  responsibilities = [],
  requirements = [],
  jobDescription,
  matchPercent
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { setHoveredJobId } = useHover()

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const handleMouseEnter = () => {
    console.log("Hovering over job:", jobId)
    setHoveredJobId(jobId)
  }

  const handleMouseLeave = () => {
    console.log("Leaving job hover:", jobId)
    setHoveredJobId(null)
  }

  return (
    <article
      className="relative rounded-2xl bg-white p-4 shadow-lg transition-all duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button aria-label="Save job" className="absolute right-3 top-3 text-gray-400 hover:text-gray-900">
        <Bookmark size={16} />
      </button>

      <div className="flex items-start gap-3">
        <img
          src={companyLogo || "/placeholder.svg"}
          alt={`${company} logo`}
          className="h-8 w-8 rounded-md object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-gray-900 truncate">{role}</h3>
            {tags.map((t) => (
              <span key={t} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-900">
                {t}
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-600 truncate mb-1">{company}</div>
          <div className="text-xs text-gray-500 mb-2">{meta}</div>

          <div className="flex flex-wrap gap-1 mb-2">
            {skills.slice(0, 4).map((s) => (
              <span
                key={s}
                className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-900"
              >
                {s}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                +{skills.length - 4}
              </span>
            )}
          </div>

          <div className="text-xs text-gray-600">
            Preferred: <span className="text-gray-900">{preferred}</span>
          </div>
        </div>
      </div>

      {/* Expandable Details Section */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="max-h-96 overflow-y-auto space-y-4 text-sm">
            {aboutCompany && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">About Company</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{aboutCompany}</p>
              </div>
            )}

            {roleOverview && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Role Overview</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{roleOverview}</p>
              </div>
            )}

            {responsibilities.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Responsibilities</h4>
                <ul className="space-y-1">
                  {responsibilities.slice(0, 8).map((responsibility, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                      <span className="text-gray-900 mt-1">•</span>
                      <span className="flex-1">{responsibility}</span>
                    </li>
                  ))}
                  {responsibilities.length > 8 && (
                    <li className="text-xs text-gray-600">
                      +{responsibilities.length - 8} more...
                    </li>
                  )}
                </ul>
              </div>
            )}

            {requirements.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Requirements</h4>
                <ul className="space-y-1">
                  {requirements.slice(0, 8).map((requirement, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                      <span className="text-gray-900 mt-1">•</span>
                      <span className="flex-1">{requirement}</span>
                    </li>
                  ))}
                  {requirements.length > 8 && (
                    <li className="text-xs text-gray-600">
                      +{requirements.length - 8} more...
                    </li>
                  )}
                </ul>
              </div>
            )}

            {jobDescription && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{jobDescription}</p>
              </div>
            )}

            {matchPercent && (
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Your Skill Match</h4>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Match score:</span>
                  <span className="text-lg font-bold text-gray-900">{matchPercent}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fixed Bottom Section - Buttons */}
      <div className="mt-3 flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          onClick={toggleExpanded}
          className="rounded-full bg-white text-gray-900 shadow-md hover:bg-gray-50 text-xs px-3 py-1 h-7 transition-all duration-200 border border-gray-200"
        >
          {detailsLabel}
          <div className={`ml-1 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronDown className="h-3 w-3" />
          </div>
        </Button>
        <Button className="rounded-full bg-gray-900 text-white hover:opacity-90 text-xs px-3 py-1 h-7">{cta}</Button>
      </div>
    </article>
  )
}
