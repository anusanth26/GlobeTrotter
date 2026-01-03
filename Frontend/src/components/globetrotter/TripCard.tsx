import { Calendar, Clock, Trash2, ArrowRight } from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Trip {
  id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
}

interface TripCardProps {
  trip: Trip;
  onView: (trip: Trip) => void;
  onDelete: (id: number, e: React.MouseEvent) => void;
  className?: string;
  index?: number;
}

export function TripCard({ trip, onView, onDelete, className, index = 0 }: TripCardProps) {
  const duration = differenceInDays(parseISO(trip.end_date), parseISO(trip.start_date)) + 1;

  return (
    <Card
      className={cn(
        "group cursor-pointer overflow-hidden border-2 border-transparent transition-all duration-300 hover:border-primary/30 card-hover animate-fade-in-up",
        className
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => onView(trip)}
    >
      <CardContent className="p-0">
        {/* Gradient Header */}
        <div className="h-3 w-full bg-gradient-to-r from-primary via-primary/80 to-accent/60" />
        
        <div className="p-5 space-y-4">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {trip.name}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => onDelete(trip.id, e)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Description */}
          {trip.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {trip.description}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-primary" />
              <span>
                {format(parseISO(trip.start_date), 'MMM d')} - {format(parseISO(trip.end_date), 'MMM d, yyyy')}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" />
              <span>{duration} days</span>
            </div>
          </div>

          {/* View Button */}
          <Button
            variant="secondary"
            className="w-full mt-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          >
            View Itinerary
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
