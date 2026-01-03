import { useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressSteps } from "./ProgressSteps";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE}/api`;


interface TripData {
  id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
}

interface CreateTripScreenProps {
  setView: (view: string) => void;
  setNewTripData: (data: TripData) => void;
}

export function CreateTripScreen({ setView, setNewTripData }: CreateTripScreenProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post(`${API_URL}/trips`, {
        name,
        description,
        start_date: startDate,
        end_date: endDate
      });

      setNewTripData(data);
      setView('add-destinations');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: 'Trip Details', status: 'active' as const },
    { label: 'Add Destinations', status: 'pending' as const },
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

        {/* Form Card */}
        <Card className="max-w-2xl mx-auto border-2 animate-fade-in-up">
          <CardContent className="p-6 md:p-8">
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <CalendarDays className="h-7 w-7" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Create Your Trip</h1>
              <p className="text-muted-foreground mt-2">Let's start with the basics</p>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleNext} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Trip Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., European Summer Adventure"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What's this trip about? Add any notes or goals..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    Start Date *
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate" className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    End Date *
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    min={startDate}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setView('home')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 btn-gradient press-effect gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Next: Add Destinations
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
