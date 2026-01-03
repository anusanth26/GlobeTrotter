import { Plane, MapPin, Calendar, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: 'plane' | 'map' | 'calendar' | 'compass';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const icons = {
  plane: Plane,
  map: MapPin,
  calendar: Calendar,
  compass: Compass,
};

export function EmptyState({ 
  icon = 'plane', 
  title, 
  description, 
  actionLabel, 
  onAction,
  className 
}: EmptyStateProps) {
  const IconComponent = icons[icon];

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl bg-card border-2 border-dashed border-border animate-fade-in",
      className
    )}>
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary animate-float">
          <IconComponent className="h-10 w-10" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      
      {actionLabel && onAction && (
        <Button onClick={onAction} className="btn-gradient press-effect">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
