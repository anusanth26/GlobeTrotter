"use client"

import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import { useState } from "react"

export default function FAB() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed bottom-8 right-8 z-30">
      {/* Background Pulse */}
      <motion.div
        className="absolute inset-0 rounded-full bg-accent/20 animate-pulse-slow"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
      />

      {/* Main Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative w-16 h-16 rounded-full bg-gradient-to-br from-accent to-pink-600 text-white shadow-2xl flex items-center justify-center font-bold text-xl group"
      >
        <motion.div animate={{ rotate: isExpanded ? 45 : 0 }} transition={{ duration: 0.3 }}>
          <Plus className="w-6 h-6" />
        </motion.div>

        {/* Expanded Text */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={isExpanded ? { opacity: 1, width: "auto" } : { opacity: 0, width: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute right-20 whitespace-nowrap font-semibold text-foreground"
        >
          New Trip
        </motion.div>
      </motion.button>

      {/* Tooltip on Hover */}
      <motion.div
        className="absolute bottom-20 right-0 bg-foreground text-background px-3 py-2 rounded-lg text-sm font-semibold pointer-events-none"
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        Plan your next adventure
      </motion.div>
    </div>
  )
}
