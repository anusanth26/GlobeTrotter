import { useState, useEffect } from 'react';
import axios from 'axios';
import Profile from "./Profile";

import {
  Header,
  LoginScreen,
  SignupScreen,
  HomeScreen,
  MyTripsScreen,
  CreateTripScreen,
  AddDestinationsScreen,
  ViewItineraryScreen,
} from '@/components/globetrotter';

// Axios interceptor for auth
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

interface User {
  name: string;
  email?: string;
}

interface Trip {
  id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
}

interface TripData {
  id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState('login');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [newTripData, setNewTripData] = useState<TripData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setView('home');
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setView('login');
    setTrips([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} logout={logout} setView={setView} />

      {view === 'login' && <LoginScreen setUser={setUser} setView={setView} />}
      {view === 'signup' && <SignupScreen setUser={setUser} setView={setView} />}
      {view === 'home' && <HomeScreen setView={setView} trips={trips} setTrips={setTrips} />}
      {view === 'my-trips' && (
        <MyTripsScreen trips={trips} setTrips={setTrips} setSelectedTrip={setSelectedTrip} setView={setView} />
      )}
      {view === 'create-trip-name' && <CreateTripScreen setView={setView} setNewTripData={setNewTripData} />}
      {view === 'add-destinations' && newTripData && (
        <AddDestinationsScreen tripData={newTripData} setView={setView} setTrips={setTrips} />
      )}
      {view === 'view-itinerary' && selectedTrip && (
        <ViewItineraryScreen trip={selectedTrip} setView={setView} setTrips={setTrips} />
      )}
       {view === 'profile' && <Profile />}
    </div>
  );
};

export default Index;
