import { MapPin, TrendingUp, Plus, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface City {
  id: number;
  name: string;
  country: string;
  region?: string;
  cost_index: number;
}

interface CityCardProps {
  city: City;
  onAdd?: (city: City) => void;
  onRemove?: (cityId: number) => void;
  isSelected?: boolean;
  orderNumber?: number;
  variant?: 'search' | 'selected' | 'display';
  className?: string;
}

export function CityCard({ 
  city, 
  onAdd, 
  onRemove, 
  isSelected = false, 
  orderNumber,
  variant = 'display',
  className 
}: CityCardProps) {
  const getCostColor = (cost: number) => {
    if (cost <= 3) return 'bg-success/10 text-success border-success/20';
    if (cost <= 6) return 'bg-warning/10 text-warning border-warning/20';
    return 'bg-destructive/10 text-destructive border-destructive/20';
  };

  if (variant === 'search') {
    return (
      <div
        className={cn(
          "group flex items-center justify-between p-4 rounded-xl border-2 border-border bg-card cursor-pointer transition-all duration-200",
          "hover:border-primary/50 hover:bg-secondary/50 hover:shadow-md",
          isSelected && "border-primary bg-primary/5",
          className
        )}
        onClick={() => onAdd?.(city)}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-foreground">{city.name}</p>
            <p className="text-sm text-muted-foreground">
              {city.country}{city.region ? ` • ${city.region}` : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={cn("text-xs", getCostColor(city.cost_index))}>
            <TrendingUp className="h-3 w-3 mr-1" />
            {city.cost_index}/10
          </Badge>
          <Button
            size="sm"
            className="gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onAdd?.(city);
            }}
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    );
  }

  if (variant === 'selected') {
    return (
      <div
        className={cn(
          "flex items-center gap-4 p-4 rounded-xl border-2 border-primary bg-primary/5 animate-scale-in",
          className
        )}
      >
        {orderNumber && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
            {orderNumber}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{city.name}</p>
          <p className="text-sm text-muted-foreground truncate">{city.country}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => onRemove?.(city.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Display variant
  return (
    <Card className={cn("overflow-hidden card-hover", className)}>
      <CardContent className="p-0">
        <div className="h-2 w-full bg-gradient-to-r from-primary to-accent" />
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold text-foreground">{city.name}</h4>
              <p className="text-sm text-muted-foreground">{city.country}</p>
            </div>
            <Badge variant="outline" className={cn("text-xs shrink-0", getCostColor(city.cost_index))}>
              Cost: {city.cost_index}/10
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
