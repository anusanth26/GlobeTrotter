"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"

const filterOptions = [
  { id: "budget", label: "Budget-Friendly", color: "from-green-400 to-green-600" },
  { id: "adventure", label: "Adventure", color: "from-red-400 to-red-600" },
  { id: "culture", label: "Culture", color: "from-purple-400 to-purple-600" },
  { id: "relaxation", label: "Relaxation", color: "from-blue-400 to-blue-600" },
]

export default function SearchBar() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [isFocused, setIsFocused] = useState(false)

  const toggleFilter = (id: string) => {
    setSelectedFilters((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative -mt-20 mx-4 md:mx-auto max-w-3xl z-20"
    >
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-2xl p-6 space-y-4">
        {/* Search Input */}
        <motion.div
          className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            isFocused ? "bg-white/40 ring-2 ring-accent/50" : "bg-white/20"
          }`}
        >
          <Search className="w-5 h-5 text-foreground/60" />
          <input
            type="text"
            placeholder="Search destinations, activities, or experiences..."
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-foreground/50"
          />
        </motion.div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((filter) => (
            <motion.button
              key={filter.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleFilter(filter.id)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                selectedFilters.includes(filter.id)
                  ? `bg-gradient-to-r ${filter.color} text-white shadow-lg`
                  : "bg-white/30 text-foreground hover:bg-white/40"
              }`}
            >
              {filter.label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
