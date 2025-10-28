"use client"

import { JobCard } from "@/components/job-card"
import { useSearch } from "./search-context"

type Job = {
  jobId: string
  companyLogo?: string
  title: string
  company: string
  employmentType?: string
  location: string
  postedAt?: string
  requirements?: string[]
  aboutCompany?: string
  roleOverview?: string
  responsibilities?: string[]
  jobDescription?: string
  matchPercent?: number
}

type JobListProps = {
  jobs: Job[]
}

export function JobList({ jobs }: JobListProps) {
  const { searchQuery } = useSearch()

  // Filter jobs based on search query
  const filteredJobs = jobs.filter((job) => {
    if (!searchQuery.trim()) return true

    const query = searchQuery.toLowerCase()
    return (
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.requirements?.some(skill => skill.toLowerCase().includes(query)) ||
      job.location.toLowerCase().includes(query) ||
      job.employmentType?.toLowerCase().includes(query) ||
      job.aboutCompany?.toLowerCase().includes(query) ||
      job.roleOverview?.toLowerCase().includes(query) ||
      job.jobDescription?.toLowerCase().includes(query)
    )
  })

  // Show message if no jobs match the search
  if (filteredJobs.length === 0 && searchQuery.trim()) {
    return (
      <div className="text-center py-8">
        <p className="text-[var(--muted)] mb-2">No jobs found matching "{searchQuery}"</p>
        <p className="text-sm text-[var(--muted)]">Try adjusting your search terms</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {filteredJobs.map((job) => (
        <JobCard
          key={job.jobId}
          jobId={job.jobId}
          companyLogo={job.companyLogo || "/placeholder.svg"}
          role={job.title}
          company={job.company}
          tags={job.employmentType ? [job.employmentType] : []}
          meta={`${job.location} • ${job.postedAt || "Recently"}`}
          skills={job.requirements?.slice(0, 5) || []}
          preferred="Collaborative Builder"
          cta="Apply Now"
          detailsLabel="View details"
          aboutCompany={job.aboutCompany}
          roleOverview={job.roleOverview}
          responsibilities={job.responsibilities}
          requirements={job.requirements}
          jobDescription={job.jobDescription}
          matchPercent={job.matchPercent}
        />
      ))}
    </div>
  )
}
