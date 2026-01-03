import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  status: 'pending' | 'active' | 'complete';
}

interface ProgressStepsProps {
  steps: Step[];
  className?: string;
}

export function ProgressSteps({ steps, className }: ProgressStepsProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2 flex-wrap", className)}>
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center">
          {/* Step */}
          <div
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
              step.status === 'pending' && "bg-muted text-muted-foreground",
              step.status === 'active' && "bg-primary text-primary-foreground shadow-glow",
              step.status === 'complete' && "bg-success text-success-foreground"
            )}
          >
            {step.status === 'complete' ? (
              <Check className="h-4 w-4" />
            ) : (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-current/20 text-xs">
                {index + 1}
              </span>
            )}
            <span className="hidden sm:inline">{step.label}</span>
          </div>

          {/* Connector */}
          {index < steps.length - 1 && (
            <div className={cn(
              "w-8 h-0.5 mx-1",
              step.status === 'complete' ? "bg-success" : "bg-border"
            )} />
          )}
        </div>
      ))}
    </div>
  );
}
