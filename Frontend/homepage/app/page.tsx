"use client"
import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import SearchBar from "@/components/search-bar"
import DestinationsSection from "@/components/destinations-section"
import TripsSection from "@/components/trips-section"
import FAB from "@/components/floating-action-button"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <SearchBar />
      <DestinationsSection />
      <TripsSection />
      <FAB />
    </div>
  )
}
