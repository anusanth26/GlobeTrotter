"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { ChevronRight, Star } from "lucide-react"

const destinations = [
  {
    id: 1,
    name: "Bali, Indonesia",
    image: "/tropical-beach-bali-with-temple-sunset.jpg",
    rating: 4.8,
    reviews: 2840,
    avgCost: 45,
    country: "Indonesia",
  },
  {
    id: 2,
    name: "Tokyo, Japan",
    image: "/tokyo-cityscape-neon-lights-night.jpg",
    rating: 4.9,
    reviews: 3200,
    avgCost: 75,
    country: "Japan",
  },
  {
    id: 3,
    name: "Barcelona, Spain",
    image: "/barcelona-sagrada-familia-architecture.png",
    rating: 4.7,
    reviews: 2500,
    avgCost: 65,
    country: "Spain",
  },
  {
    id: 4,
    name: "Dubai, UAE",
    image: "/dubai-burj-khalifa-skyline-modern.jpg",
    rating: 4.6,
    reviews: 2100,
    avgCost: 85,
    country: "United Arab Emirates",
  },
  {
    id: 5,
    name: "Paris, France",
    image: "/paris-eiffel-tower-romantic-sunset.jpg",
    rating: 4.9,
    reviews: 3800,
    avgCost: 80,
    country: "France",
  },
]

export default function DestinationsSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Section Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-2">Explore Destinations</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-accent to-primary rounded-full" />
          </div>
          <motion.button
            whileHover={{ gap: "0.75rem" }}
            className="hidden md:flex items-center gap-2 text-accent hover:text-primary transition-colors font-semibold"
          >
            View All
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Scrollable Cards */}
        <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-6 scroll-smooth scrollbar-hide">
          {destinations.map((dest, idx) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onHoverStart={() => setHoveredId(dest.id)}
              onHoverEnd={() => setHoveredId(null)}
              className="flex-shrink-0 group cursor-pointer"
            >
              <div className="relative w-72 h-80 rounded-2xl overflow-hidden shadow-xl">
                {/* Image */}
                <motion.img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover"
                  animate={{ scale: hoveredId === dest.id ? 1.05 : 1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={hoveredId === dest.id ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-1 text-yellow-300">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-semibold">
                        {dest.rating} ({dest.reviews})
                      </span>
                    </div>
                    <p className="text-white/80 text-sm">${dest.avgCost}/day avg</p>
                  </motion.div>

                  <h3 className="text-2xl font-bold text-white mt-2">{dest.name}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
