import { useState, useEffect } from "react";
import { ArrowLeft, Search, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProgressSteps } from "./ProgressSteps";
import { CityCard } from "./CityCard";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE}/api`;


interface TripData {
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

interface Trip {
  id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
}

interface AddDestinationsScreenProps {
  tripData: TripData;
  setView: (view: string) => void;
  setTrips: (trips: Trip[]) => void;
}

export function AddDestinationsScreen({ tripData, setView, setTrips }: AddDestinationsScreenProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCities, setSelectedCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/cities`);
      setCities(data);
    } catch (err) {
      console.error('Error fetching cities:', err);
    }
  };

  const addCity = (city: City) => {
    if (!selectedCities.find(c => c.id === city.id)) {
      setSelectedCities([...selectedCities, city]);
    }
  };

  const removeCity = (cityId: number) => {
    setSelectedCities(selectedCities.filter(c => c.id !== cityId));
  };

  const handleFinish = async () => {
    if (selectedCities.length === 0) {
      alert('Please add at least one destination');
      return;
    }

    setLoading(true);
    try {
      for (let i = 0; i < selectedCities.length; i++) {
        const city = selectedCities[i];
        await axios.post(`${API_URL}/trips/${tripData.id}/stops`, {
          city_name: city.name,
          country: city.country,
          start_date: tripData.start_date,
          end_date: tripData.end_date,
          stop_order: i + 1
        });
      }

      const { data: allTrips } = await axios.get(`${API_URL}/trips`);
      setTrips(allTrips);
      setView('my-trips');
    } catch (err) {
      console.error('Error adding destinations:', err);
      alert('Failed to add some destinations');
    } finally {
      setLoading(false);
    }
  };

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const steps = [
    { label: 'Trip Details', status: 'complete' as const },
    { label: 'Add Destinations', status: 'active' as const },
    { label: 'View Itinerary', status: 'pending' as const },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-secondary/30 to-background">
      <div className="container px-4 md:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setView('home')}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          
          <ProgressSteps steps={steps} />
        </div>

        {/* Title */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Add Destinations to "{tripData.name}"
          </h1>
          <p className="text-muted-foreground mt-2">
            Search and select cities you want to visit
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Search Panel */}
          <Card className="border-2 animate-fade-in-up">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Search className="h-5 w-5 text-primary" />
                Search Cities
              </CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search cities or countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {filteredCities.slice(0, 20).map((city) => (
                    <CityCard
                      key={city.id}
                      city={city}
                      variant="search"
                      isSelected={selectedCities.some(c => c.id === city.id)}
                      onAdd={addCity}
                    />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Selected Panel */}
          <Card className="border-2 border-primary/20 animate-fade-in-up stagger-1">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                Selected Destinations
                <span className="ml-auto text-sm font-normal text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                  {selectedCities.length} selected
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {selectedCities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                    <MapPin className="h-8 w-8" />
                  </div>
                  <p className="font-medium">No destinations selected yet</p>
                  <p className="text-sm mt-1">Add cities from the search panel</p>
                </div>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-2">
                    {selectedCities.map((city, index) => (
                      <CityCard
                        key={city.id}
                        city={city}
                        variant="selected"
                        orderNumber={index + 1}
                        onRemove={removeCity}
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 justify-center mt-8 max-w-md mx-auto">
          <Button
            variant="outline"
            onClick={() => setView('home')}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleFinish}
            disabled={loading || selectedCities.length === 0}
            className="flex-1 btn-gradient press-effect gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Finish & View Itinerary'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
