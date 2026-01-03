import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, MapPin, DollarSign, ChevronDown, ChevronRight, Plus, Loader2 } from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { StickyBudgetBar } from "./StickyBudgetBar";
import { ActivityCard } from "./ActivityCard";
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

interface Activity {
  id: number;
  name: string;
  category: string;
  cost: number;
}

interface Stop {
  id: number;
  city_name: string;
  country: string;
  start_date: string;
  end_date: string;
  activities?: Activity[];
}

interface Budget {
  total: number;
  activities: number;
  accommodation: number;
  transport: number;
  meals: number;
}

interface ViewItineraryScreenProps {
  trip: Trip;
  setView: (view: string) => void;
  setTrips: (trips: Trip[]) => void;
}

export function ViewItineraryScreen({ trip, setView, setTrips }: ViewItineraryScreenProps) {
  const [stops, setStops] = useState<Stop[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'budget'>('itinerary');

  useEffect(() => {
    fetchStops();
    fetchBudget();
  }, [trip.id]);

  const fetchStops = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/trips/${trip.id}/stops`);

      const stopsWithActivities = await Promise.all(
        data.map(async (stop: Stop) => {
          const { data: activities } = await axios.get(`${API_URL}/stops/${stop.id}/activities`);
          return { ...stop, activities };
        })
      );

      setStops(stopsWithActivities);
    } catch (err) {
      console.error('Error fetching stops:', err);
    }
  };

  const fetchBudget = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/trips/${trip.id}/budget`);
      setBudget(data);
    } catch (err) {
      console.error('Error fetching budget:', err);
    }
  };

  const deleteStop = async (stopId: number) => {
    if (window.confirm('Remove this destination from your trip?')) {
      try {
        await axios.delete(`${API_URL}/stops/${stopId}`);
        fetchStops();
        fetchBudget();
      } catch (err) {
        console.error('Error deleting stop:', err);
      }
    }
  };

  const tripDuration = differenceInDays(parseISO(trip.end_date), parseISO(trip.start_date)) + 1;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-secondary/30 to-background pb-28">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container px-4 md:px-8 py-6">
          <Button
            variant="ghost"
            onClick={() => setView('my-trips')}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Trips
          </Button>

          <div className="animate-fade-in">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{trip.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" />
                <span>
                  {format(parseISO(trip.start_date), 'MMMM d')} - {format(parseISO(trip.end_date), 'MMMM d, yyyy')}
                </span>
              </div>
              <span className="text-muted-foreground">•</span>
              <span>{tripDuration} days</span>
            </div>
            {trip.description && (
              <p className="text-muted-foreground mt-2">{trip.description}</p>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            <Button
              variant={activeTab === 'itinerary' ? 'default' : 'outline'}
              onClick={() => setActiveTab('itinerary')}
              className={activeTab === 'itinerary' ? 'btn-gradient' : ''}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Itinerary
            </Button>
            <Button
              variant={activeTab === 'budget' ? 'default' : 'outline'}
              onClick={() => setActiveTab('budget')}
              className={activeTab === 'budget' ? 'btn-gradient' : ''}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Budget
            </Button>
          </div>
        </div>
      </div>

      <div className="container px-4 md:px-8 py-8">
        {activeTab === 'budget' && budget && (
          <BudgetView budget={budget} tripDuration={tripDuration} />
        )}

        {activeTab === 'itinerary' && (
          <>
            {stops.length === 0 ? (
              <EmptyState
                icon="map"
                title="No destinations added yet"
                description="Add some destinations to start building your itinerary"
                actionLabel="Add Destinations"
                onAction={() => setView('my-trips')}
              />
            ) : (
              <div className="space-y-4 max-w-3xl mx-auto">
                {stops.map((stop, index) => (
                  <StopCard
                    key={stop.id}
                    stop={stop}
                    index={index}
                    isLast={index === stops.length - 1}
                    onDelete={() => deleteStop(stop.id)}
                    onUpdate={fetchStops}
                    onBudgetUpdate={fetchBudget}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Sticky Budget Bar */}
      <StickyBudgetBar budget={budget} tripDuration={tripDuration} />
    </div>
  );
}

interface BudgetViewProps {
  budget: Budget;
  tripDuration: number;
}

function BudgetView({ budget, tripDuration }: BudgetViewProps) {
  const breakdownItems = [
    { icon: '🎯', label: 'Activities', amount: budget.activities },
    { icon: '🏨', label: 'Accommodation', amount: budget.accommodation },
    { icon: '🚗', label: 'Transport', amount: budget.transport },
    { icon: '🍽️', label: 'Meals', amount: budget.meals },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Total Card */}
      <Card className="border-0 overflow-hidden">
        <div className="gradient-bg p-8 text-white text-center">
          <p className="text-white/80 text-sm font-medium mb-2">Total Estimated Cost</p>
          <p className="text-5xl font-bold mb-2">${budget.total.toFixed(2)}</p>
          <p className="text-white/70">For {tripDuration} days</p>
        </div>
      </Card>

      {/* Breakdown */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {breakdownItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-xl font-semibold text-foreground">
                    ${item.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface StopCardProps {
  stop: Stop;
  index: number;
  isLast: boolean;
  onDelete: () => void;
  onUpdate: () => void;
  onBudgetUpdate: () => void;
}

function StopCard({ stop, index, isLast, onDelete, onUpdate, onBudgetUpdate }: StopCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [activityName, setActivityName] = useState('');
  const [activityCost, setActivityCost] = useState('');
  const [activityCategory, setActivityCategory] = useState('sightseeing');
  const [loading, setLoading] = useState(false);

  const addActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(`${API_URL}/stops/${stop.id}/activities`, {
        name: activityName,
        category: activityCategory,
        cost: parseFloat(activityCost) || 0,
        activity_date: stop.start_date
      });
      setActivityName('');
      setActivityCost('');
      setShowAddActivity(false);
      onUpdate();
      onBudgetUpdate();
    } catch (err) {
      console.error('Error adding activity:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteActivity = async (activityId: number) => {
    if (window.confirm('Remove this activity?')) {
      try {
        await axios.delete(`${API_URL}/activities/${activityId}`);
        onUpdate();
        onBudgetUpdate();
      } catch (err) {
        console.error('Error deleting activity:', err);
      }
    }
  };

  return (
    <div className="relative animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
      {/* Timeline */}
      <div className="absolute left-6 top-0 bottom-0 flex flex-col items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg z-10 shadow-glow">
          {index + 1}
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 bg-gradient-to-b from-primary to-border" />
        )}
      </div>

      {/* Card */}
      <div className="ml-20">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <Card className="border-2 hover:border-primary/30 transition-colors">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-secondary/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      {stop.city_name}, {stop.country}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(parseISO(stop.start_date), 'MMM d')} - {format(parseISO(stop.end_date), 'MMM d')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                      }}
                    >
                      Remove
                    </Button>
                    {isOpen ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <CardContent className="pt-0">
                {/* Activities Header */}
                <div className="flex items-center justify-between mb-4 pt-4 border-t border-border">
                  <h4 className="font-semibold text-foreground">Activities & Things to Do</h4>
                  <Button
                    size="sm"
                    onClick={() => setShowAddActivity(!showAddActivity)}
                    className="gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add Activity
                  </Button>
                </div>

                {/* Add Activity Form */}
                {showAddActivity && (
                  <form onSubmit={addActivity} className="p-4 rounded-xl bg-secondary/50 mb-4 animate-fade-in space-y-3">
                    <Input
                      type="text"
                      placeholder="Activity name (e.g., Visit Eiffel Tower)"
                      value={activityName}
                      onChange={(e) => setActivityName(e.target.value)}
                      required
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Select value={activityCategory} onValueChange={setActivityCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sightseeing">🏛️ Sightseeing</SelectItem>
                          <SelectItem value="food">🍽️ Food & Dining</SelectItem>
                          <SelectItem value="adventure">🏔️ Adventure</SelectItem>
                          <SelectItem value="culture">🎭 Culture</SelectItem>
                          <SelectItem value="shopping">🛍️ Shopping</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="Cost ($)"
                        value={activityCost}
                        onChange={(e) => setActivityCost(e.target.value)}
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={loading} className="flex-1">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddActivity(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}

                {/* Activities List */}
                {stop.activities && stop.activities.length > 0 ? (
                  <div className="space-y-2">
                    {stop.activities.map((activity) => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        onDelete={deleteActivity}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    No activities added yet. Click "Add Activity" to get started!
                  </p>
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>
    </div>
  );
}
