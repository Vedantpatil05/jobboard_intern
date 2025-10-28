"use client"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal } from "lucide-react"
import { useState } from "react"
import { useSearch } from "./search-context"

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useSearch()

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-full items-center rounded-full bg-gray-100 shadow-md px-4">
        <Search size={18} className="text-gray-400 mr-2" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search jobs by title, company, or skills..."
          className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-500"
        />
      </div>
      <Button className="rounded-full bg-gray-100 text-gray-900 shadow-md hover:bg-gray-200">
        Search
      </Button>
      <button
        aria-label="Filters"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-900 shadow-md"
      >
        <SlidersHorizontal size={18} className="text-gray-400" />
      </button>
    </div>
  )
}
