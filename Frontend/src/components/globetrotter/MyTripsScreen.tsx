import { useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TripCard } from "./TripCard";
import { EmptyState } from "./EmptyState";
import axios from "axios";

const API_URL = 'http://localhost:5000/api';

interface Trip {
  id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
}

interface MyTripsScreenProps {
  trips: Trip[];
  setTrips: (trips: Trip[]) => void;
  setSelectedTrip: (trip: Trip) => void;
  setView: (view: string) => void;
}

export function MyTripsScreen({ trips, setTrips, setSelectedTrip, setView }: MyTripsScreenProps) {
  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/trips`);
      setTrips(data);
    } catch (err) {
      console.error('Error fetching trips:', err);
    }
  };

  const deleteTrip = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await axios.delete(`${API_URL}/trips/${id}`);
        fetchTrips();
      } catch (err) {
        console.error('Error deleting trip:', err);
      }
    }
  };

  const viewItinerary = (trip: Trip) => {
    setSelectedTrip(trip);
    setView('view-itinerary');
  };

  return (
    <div className="container px-4 md:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Trips</h1>
          <p className="text-muted-foreground mt-1">View and manage all your travel plans</p>
        </div>
        <Button 
          onClick={() => setView('create-trip-name')}
          className="btn-gradient press-effect gap-2"
        >
          <Plus className="h-4 w-4" />
          Create New Trip
        </Button>
      </div>

      {/* Content */}
      {trips.length === 0 ? (
        <EmptyState
          icon="plane"
          title="No trips yet"
          description="Start planning your first adventure! Create a trip to organize destinations, activities, and track your budget."
          actionLabel="Create Your First Trip"
          onAction={() => setView('create-trip-name')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip, index) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onView={viewItinerary}
              onDelete={deleteTrip}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
