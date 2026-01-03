import { useState, useEffect } from "react";
import { Plane, Map, Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CityCard } from "./CityCard";
import axios from "axios";

const API_URL = 'http://localhost:5000/api';

interface Trip {
  id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
}

interface City {
  id: number;
  name: string;
  country: string;
  region?: string;
  cost_index: number;
}

interface HomeScreenProps {
  setView: (view: string) => void;
  trips: Trip[];
  setTrips: (trips: Trip[]) => void;
}

export function HomeScreen({ setView, trips, setTrips }: HomeScreenProps) {
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    fetchTrips();
    fetchCities();
  }, []);

  const fetchTrips = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/trips`);
      setTrips(data);
    } catch (err) {
      console.error('Error fetching trips:', err);
    }
  };

  const fetchCities = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/cities`);
      setCities(data.slice(0, 6));
    } catch (err) {
      console.error('Error fetching cities:', err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30" />
        
        <div className="container relative px-4 md:px-8 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Plan smarter, travel better</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
              Where will your next{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                adventure
              </span>{' '}
              take you?
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 mb-8 animate-fade-in-up stagger-1">
              Create personalized itineraries, track your budget, and discover amazing destinations around the world.
            </p>
            
            <Button 
              size="lg"
              className="btn-coral press-effect text-lg px-8 py-6 h-auto animate-fade-in-up stagger-2"
              onClick={() => setView('create-trip-name')}
            >
              <Plane className="mr-2 h-5 w-5" />
              Create New Trip
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <div className="container px-4 md:px-8 py-12 space-y-12">
        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 -mt-16 relative z-10">
          <Card 
            className="group cursor-pointer card-hover border-2 border-transparent hover:border-primary/30 animate-fade-in-up"
            onClick={() => setView('my-trips')}
          >
            <CardContent className="p-6 flex items-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Map className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-1">My Trips</h3>
                <p className="text-muted-foreground">View and manage your travel plans</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </CardContent>
          </Card>

          <Card 
            className="group cursor-pointer card-hover border-2 border-transparent hover:border-accent/30 animate-fade-in-up stagger-1"
            onClick={() => setView('create-trip-name')}
          >
            <CardContent className="p-6 flex items-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <Plane className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-1">Plan New Trip</h3>
                <p className="text-muted-foreground">Start your next adventure today</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
            </CardContent>
          </Card>
        </section>

        {/* Recent Trips */}
        {trips.length > 0 && (
          <section className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Recent Trips</h2>
              <Button variant="ghost" onClick={() => setView('my-trips')} className="gap-2">
                View all
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trips.slice(0, 3).map((trip, index) => (
                <Card 
                  key={trip.id} 
                  className="group cursor-pointer card-hover border-2 border-transparent hover:border-primary/30 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setView('my-trips')}
                >
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                      {trip.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(trip.start_date), 'MMM d')} - {format(parseISO(trip.end_date), 'MMM d, yyyy')}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Popular Destinations */}
        {cities.length > 0 && (
          <section className="animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Popular Destinations</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cities.map((city, index) => (
                <div
                  key={city.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CityCard city={city} variant="display" />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
