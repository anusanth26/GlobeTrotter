"use client"

import { motion } from "framer-motion"
import { Globe, Menu } from "lucide-react"

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className="sticky top-0 z-40 backdrop-blur-md bg-white/30 border-b border-white/20 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-primary">GlobeTrotter</span>
          </motion.div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex gap-8">
              <motion.a
                whileHover={{ color: "#FF6B6B" }}
                href="#explore"
                className="text-foreground hover:text-accent transition-colors"
              >
                Explore
              </motion.a>
              <motion.a
                whileHover={{ color: "#FF6B6B" }}
                href="#trips"
                className="text-foreground hover:text-accent transition-colors"
              >
                My Trips
              </motion.a>
            </div>

            {/* Profile Circle */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center cursor-pointer shadow-lg ring-2 ring-transparent hover:ring-accent/50 transition-all"
            >
              <span className="text-white text-sm font-bold">JD</span>
            </motion.div>

            {/* Mobile Menu */}
            <button className="sm:hidden p-2 hover:bg-white/20 rounded-lg transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
