"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

interface HoverContextType {
  hoveredJobId: string | null
  setHoveredJobId: (jobId: string | null) => void
}

const HoverContext = createContext<HoverContextType | undefined>(undefined)

export function HoverProvider({ children }: { children: ReactNode }) {
  const [hoveredJobId, setHoveredJobId] = useState<string | null>(null)

  return (
    <HoverContext.Provider value={{ hoveredJobId, setHoveredJobId }}>
      {children}
    </HoverContext.Provider>
  )
}

export function useHover() {
  const context = useContext(HoverContext)
  if (context === undefined) {
    throw new Error('useHover must be used within a HoverProvider')
  }
  return context
}
