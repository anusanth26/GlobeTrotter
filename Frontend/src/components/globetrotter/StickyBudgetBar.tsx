import { DollarSign, TrendingUp, ChevronUp, ChevronDown, Landmark, Hotel, Car, Utensils } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Budget {
  total: number;
  activities: number;
  accommodation: number;
  transport: number;
  meals: number;
}

interface StickyBudgetBarProps {
  budget: Budget | null;
  tripDuration: number;
}

export function StickyBudgetBar({ budget, tripDuration }: StickyBudgetBarProps) {
  const [expanded, setExpanded] = useState(false);

  if (!budget) return null;

  const dailyAverage = budget.total / tripDuration;

  const breakdownItems = [
    { icon: Landmark, label: 'Activities', amount: budget.activities, color: 'text-blue-500' },
    { icon: Hotel, label: 'Accommodation', amount: budget.accommodation, color: 'text-purple-500' },
    { icon: Car, label: 'Transport', amount: budget.transport, color: 'text-orange-500' },
    { icon: Utensils, label: 'Meals', amount: budget.meals, color: 'text-emerald-500' },
  ];

  return (
    <div className={cn(
      "sticky-budget transition-all duration-300",
      expanded ? "pb-4" : "pb-0"
    )}>
      <div className="container px-4 md:px-8">
        {/* Main Bar */}
        <div 
          className="flex items-center justify-between py-4 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-2xl font-bold text-foreground">
                ${budget.total.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:block text-right">
              <p className="text-sm text-muted-foreground">Daily Average</p>
              <p className="text-lg font-semibold text-primary flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                ${dailyAverage.toFixed(2)}/day
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-secondary"
            >
              {expanded ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronUp className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Expanded Breakdown */}
        {expanded && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 animate-fade-in">
            {breakdownItems.map((item) => (
              <div 
                key={item.label}
                className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50"
              >
                <item.icon className={cn("h-5 w-5", item.color)} />
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="font-semibold text-foreground">
                    ${item.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
