import { Slider } from "@/catalyst-ui/ui/slider";
import { cn } from "@/catalyst-ui/utils";

export interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  showValue?: boolean;
  /** Use skill level labels (Novice, Intermediate, Advanced, Expert, Master) */
  useLabels?: boolean;
  className?: string;
}

// Skill level labels based on value ranges
const SKILL_LABELS: Record<number, string> = {
  0: "Novice",
  20: "Beginner",
  40: "Intermediate",
  60: "Advanced",
  80: "Expert",
  100: "Master",
};

function getSkillLabel(value: number): string {
  if (value >= 90) return "Master";
  if (value >= 75) return "Expert";
  if (value >= 55) return "Advanced";
  if (value >= 35) return "Intermediate";
  if (value >= 15) return "Beginner";
  return "Novice";
}

export function StatBar({
  label,
  value,
  max = 100,
  showValue = true,
  useLabels = false,
  className,
}: StatBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const skillLabel = getSkillLabel(percentage);

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {showValue && !useLabels && (
          <span className="text-sm text-muted-foreground">
            {value}/{max}
          </span>
        )}
        {useLabels && <span className="text-xs text-primary font-medium">{skillLabel}</span>}
      </div>
      <Slider
        value={[percentage]}
        max={100}
        disabled
        className="cursor-default"
        showValue={useLabels}
        labels={useLabels ? SKILL_LABELS : undefined}
        labelPosition="outside"
      />
    </div>
  );
}
