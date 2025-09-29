// file: src/types/index.ts

// Avatar type
export type Avatar = {
  avatar_tag?: string | null
  avatar_name: string
  avatar_link: string
}

// Job posting type
export type Job = {
  jobId: string
  title: string
  company: string
  companyUrl?: string
  companyLogo?: string
  location: string
  employmentType?: string
  postedAt?: string
  postedDate?: string
  howRecent?: string
  jobDescription?: string
  roleOverview?: string
  aboutCompany?: string
  responsibilities?: string[]
  requirements?: string[]
  seniorityLevel?: string
  timezone?: string
  source?: string
  applyUrl?: string
  applyLink?: string
  tags?: string[]
  embedding?: number[]
  matchPercent?: number
  hardSkillPercent?: number
  softSkillPercent?: number
}

// User profile type (simplified for job-matching)
export type UserProfile = {
  uid: string
  first_name?: string
  last_name?: string
  email?: string
  interests?: string[]
  skills?: string[]
  avatarName?: string
  level?: string
  roles?: string[]
}

// Roadmap definition
export type Roadmap = {
  uid: string
  roadmap_title: string
  skill_objectives?: string[]
  modules?: {
    short_title?: string
    module_title?: string
  }[]
}
