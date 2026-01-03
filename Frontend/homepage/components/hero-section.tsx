"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div style={{ y: scrollY * 0.5 }} className="absolute inset-0">
        <img src="/beautiful-tropical-beach-destination-with-clear-wa.jpg" alt="Travel destination" className="w-full h-full object-cover" />
      </motion.div>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-4"
        >
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white text-balance">
            Plan Your Next
            <br />
            <span className="bg-gradient-to-r from-accent via-pink-400 to-accent bg-clip-text text-transparent">
              Adventure
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto text-pretty">
            Create personalized itineraries, discover hidden gems, and share your journey with the world
          </p>
        </motion.div>
      </div>
    </div>
  )
}
