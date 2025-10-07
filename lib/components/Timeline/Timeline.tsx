import * as React from "react";
import { cn } from "@/catalyst-ui/utils";

export interface TimelineItemProps {
  date: string;
  title: string;
  company?: string;
  description?: string;
  achievements?: string[];
  isLast?: boolean;
  className?: string;
}

export function TimelineItem({
  date,
  title,
  company,
  description,
  achievements,
  isLast = false,
  className,
}: TimelineItemProps) {
  return (
    <div className={cn("relative flex gap-4 pb-8", className)}>
      {/* Vertical line */}
      {!isLast && (
        <div className="absolute left-[7px] top-[28px] h-full w-0.5 bg-border" />
      )}

      {/* Date marker */}
      <div className="relative z-10 mt-1">
        <div className="h-4 w-4 rounded-full border-2 border-primary bg-background" />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1.5 pt-0">
        <div className="text-xs text-muted-foreground">{date}</div>
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        {company && (
          <div className="text-sm text-muted-foreground">{company}</div>
        )}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {achievements && achievements.length > 0 && (
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {achievements.map((achievement, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary mt-0.5">▸</span>
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export interface TimelineProps {
  children: React.ReactNode;
  className?: string;
}

export function Timeline({ children, className }: TimelineProps) {
  return <div className={cn("space-y-0", className)}>{children}</div>;
}
