import { X, Landmark, Utensils, Mountain, Theater, ShoppingBag, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Activity {
  id: number;
  name: string;
  category: string;
  cost: number;
}

interface ActivityCardProps {
  activity: Activity;
  onDelete?: (activityId: number) => void;
  className?: string;
}

const categoryConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; class: string; label: string }> = {
  sightseeing: { icon: Landmark, class: 'category-sightseeing', label: 'Sightseeing' },
  food: { icon: Utensils, class: 'category-food', label: 'Food & Dining' },
  adventure: { icon: Mountain, class: 'category-adventure', label: 'Adventure' },
  culture: { icon: Theater, class: 'category-culture', label: 'Culture' },
  shopping: { icon: ShoppingBag, class: 'category-shopping', label: 'Shopping' },
};

export function ActivityCard({ activity, onDelete, className }: ActivityCardProps) {
  const config = categoryConfig[activity.category] || { 
    icon: MapPin, 
    class: 'bg-muted text-muted-foreground', 
    label: activity.category 
  };
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        "group flex items-center gap-4 p-4 rounded-xl border-2 border-border bg-card transition-all duration-200",
        "hover:border-primary/30 hover:shadow-md",
        className
      )}
    >
      {/* Category Icon */}
      <div className={cn(
        "flex h-12 w-12 items-center justify-center rounded-xl shrink-0",
        config.class
      )}>
        <IconComponent className="h-6 w-6" />
      </div>

      {/* Activity Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{activity.name}</p>
        <p className={cn("text-sm capitalize", config.class.replace('bg-', 'text-').split(' ')[0])}>
          {config.label}
        </p>
      </div>

      {/* Price & Delete */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-semibold text-success text-lg">
          ${activity.cost.toFixed(2)}
        </span>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onDelete(activity.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
