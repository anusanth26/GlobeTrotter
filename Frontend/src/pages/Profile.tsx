import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";


export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [upcomingTrips, setUpcomingTrips] = useState<any[]>([]);
  const [pastTrips, setPastTrips] = useState<any[]>([]);

  useEffect(() => {
    loadProfile();
    loadTrips();
  }, []);

  async function loadProfile() {
    const res = await apiFetch("/api/auth/me");
    const data = await res.json();
    setUser(data);
  }

  async function loadTrips() {
    const res = await apiFetch("/api/trips");
    const trips = await res.json();

    const today = new Date();

    setUpcomingTrips(
      trips.filter((t: any) => new Date(t.start_date) >= today)
    );

    setPastTrips(
      trips.filter((t: any) => new Date(t.end_date) < today)
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* User Info */}
      <div className="flex gap-6 items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-xl">
          👤
        </div>

        <div className="flex-1 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <p className="text-gray-600">{user?.email}</p>
          <button className="mt-2 text-blue-600">Edit Profile</button>
        </div>
      </div>

      {/* Preplanned Trips */}
      <h3 className="text-lg font-semibold mb-3">Preplanned Trips</h3>
      <TripGrid trips={upcomingTrips} />

      {/* Previous Trips */}
      <h3 className="text-lg font-semibold mt-8 mb-3">Previous Trips</h3>
      <TripGrid trips={pastTrips} />
    </div>
  );
}

function TripGrid({ trips }: { trips: any[] }) {
  if (trips.length === 0) {
    return <p className="text-gray-500">No trips found</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {trips.map(trip => (
        <div key={trip.id} className="border rounded-lg p-4">
          <h4 className="font-semibold">{trip.name}</h4>
          <p className="text-sm text-gray-600">
            {trip.start_date} → {trip.end_date}
          </p>
          <button className="mt-2 text-blue-600">View</button>
        </div>
      ))}
    </div>
  );
}
