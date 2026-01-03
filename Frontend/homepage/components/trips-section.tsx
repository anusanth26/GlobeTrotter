"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin } from "lucide-react"

const trips = [
  {
    id: 1,
    name: "Summer in Europe",
    dateRange: "Jun 15 - Jul 30, 2024",
    cities: 5,
    budget: 4500,
    spent: 2700,
    status: "upcoming",
    image: "/european-countryside-summer-landscape.jpg",
  },
  {
    id: 2,
    name: "Asian Adventure",
    dateRange: "Nov 20 - Dec 25, 2023",
    cities: 4,
    budget: 3200,
    spent: 3200,
    status: "completed",
    image: "/asian-temple-culture-architecture.jpg",
  },
  {
    id: 3,
    name: "Caribbean Getaway",
    dateRange: "Mar 10 - Mar 20, 2024",
    cities: 3,
    budget: 2800,
    spent: 1400,
    status: "planning",
    image: "/caribbean-beach-tropical-paradise.jpg",
  },
]

export default function TripsSection() {
  return (
    <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Section Header */}
        <div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-2">Your Journey</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-accent to-primary rounded-full" />
        </div>

        {/* Trip Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip, idx) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              <div className="relative rounded-2xl overflow-hidden bg-card shadow-lg hover:shadow-2xl transition-shadow h-full">
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <motion.img
                    src={trip.image}
                    alt={trip.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                        trip.status === "upcoming"
                          ? "bg-green-500"
                          : trip.status === "completed"
                            ? "bg-gray-500"
                            : "bg-blue-500"
                      }`}
                    >
                      {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">{trip.name}</h3>
                    <div className="flex items-center gap-2 text-foreground/60 text-sm mb-2">
                      <Calendar className="w-4 h-4" />
                      {trip.dateRange}
                    </div>
                    <div className="flex items-center gap-2 text-foreground/60 text-sm">
                      <MapPin className="w-4 h-4" />
                      {trip.cities} Cities
                    </div>
                  </div>

                  {/* Budget Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-foreground">Budget Status</span>
                      <span className="text-sm font-bold text-accent">
                        {Math.round((trip.spent / trip.budget) * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-accent to-primary rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(trip.spent / trip.budget) * 100}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.15 }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-foreground/60">
                      <span>${trip.spent} spent</span>
                      <span>${trip.budget} budget</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ backgroundColor: "hsl(0 0% 95%)" }}
                    className="w-full py-2 rounded-lg bg-muted text-foreground font-semibold transition-colors"
                  >
                    View Details
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
