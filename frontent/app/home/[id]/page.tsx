import Link from "next/link"
import Image from "next/image"

async function getJobData(id: string) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
    const res = await fetch(`${backendUrl}/api/match/match`, {
      cache: "no-store",
    })

    if (!res.ok) throw new Error(`Failed to fetch matches: ${res.status}`)
    const { matches, user } = await res.json()

    // Find the job by ID
    const jobMatch = matches.find((match: any) => match.jobId === id)
    if (!jobMatch) throw new Error(`Job not found: ${id}`)

    return { ...jobMatch, isLoggedIn: !!user }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to load job details: ${errorMessage}`)
  }
}

export default async function JobDetails({ params }: { params: { id: string } }) {
  const jobData = await getJobData(params.id)
  const { matchPercent, isLoggedIn } = jobData
  const job = jobData

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Back link */}
      <Link href="/home" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to jobs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-6">
          {/* Job header */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">📦</span>
            </div>
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">NEW</span>
              </div>
              <div className="grid grid-cols-2 gap-8 text-sm mb-4">
                <div>
                  <div className="text-gray-500 mb-1">Location</div>
                  <div className="font-medium text-gray-900">{job.location}</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Job type</div>
                  <div className="font-medium text-gray-900">{job.employmentType || "Full time"}</div>
                </div>
                {job.seniorityLevel && (
                  <div>
                    <div className="text-gray-500 mb-1">Seniority Level</div>
                    <div className="font-medium text-gray-900">{job.seniorityLevel}</div>
                  </div>
                )}
                {job.timezone && (
                  <div>
                    <div className="text-gray-500 mb-1">Timezone</div>
                    <div className="font-medium text-gray-900">{job.timezone}</div>
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-500 mb-6">🕐 Posted {job.postedAt || "1 day ago"}</div>
            </div>
          </div>

          {/* Job sections */}
          {job.aboutCompany && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About Company</h2>
              <p className="text-gray-700">{job.aboutCompany}</p>
            </div>
          )}

          {job.roleOverview && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Role Overview</h2>
              <p className="text-gray-700">{job.roleOverview}</p>
            </div>
          )}

          {job.responsibilities?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2">
                {job.responsibilities.map((r: string, i: number) => (
                  <li key={i} className="text-gray-700">{r}</li>
                ))}
              </ul>
            </div>
          )}

          {job.requirements?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
              <ul className="list-disc list-inside space-y-2">
                {job.requirements.map((req: string, i: number) => (
                  <li key={i} className="text-gray-700">{req}</li>
                ))}
              </ul>
            </div>
          )}

          {!job.roleOverview && job.jobDescription && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{job.jobDescription}</p>
            </div>
          )}

          {/* Match info */}
          {isLoggedIn && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Your Skill Match</h3>
              <p className="text-sm text-gray-600">
                Match score: <span className="font-medium">{matchPercent}%</span>
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              {job.companyLogo ? (
                <Image
                  src={job.companyLogo}
                  alt={`${job.company} logo`}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{job.company?.charAt(0) || "C"}</span>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-900">{job.company}</h3>
                {job.companyUrl && (
                  <a
                    href={job.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Visit Company Website ↗
                  </a>
                )}
              </div>
            </div>

            <a
              href={job.applyUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg mb-3 text-center transition-colors"
            >
              Apply now ↗
            </a>
          </div>

          {isLoggedIn && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <h3 className="font-semibold text-gray-900 mb-3">Your Match Score</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">{matchPercent}%</div>
              <div className="text-sm text-gray-600">Skill compatibility</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
