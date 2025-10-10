import { cn } from "@/catalyst-ui/utils";
import { Sheet, SheetContent } from "@/catalyst-ui/ui/sheet";
import { ScrollArea } from "@/catalyst-ui/ui/scroll-area";
import { Button } from "@/catalyst-ui/ui/button";
import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

export interface SidebarNavItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface SidebarNavProps {
  items: SidebarNavItem[];
  activeValue: string;
  onValueChange: (value: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

/**
 * SidebarNav - Responsive sidebar navigation component with proximity reveal
 *
 * Desktop (≥768px): Hover near left edge to peek, fixed sidebar that pushes content right when open
 * Mobile (<768px): Tap edge handle to open Sheet overlay with backdrop
 */
export function SidebarNav({
  items,
  activeValue,
  onValueChange,
  open,
  onOpenChange,
  className,
}: SidebarNavProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isPeeking, setIsPeeking] = useState(false);

  // Track window size for responsive behavior
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Desktop: Track mouse proximity to left edge
  useEffect(() => {
    if (isMobile || open) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Trigger zone: 50px from left edge
      const proximityThreshold = 50;
      const isNearEdge = e.clientX < proximityThreshold;
      setIsPeeking(isNearEdge);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile, open]);

  const handleItemClick = (value: string) => {
    onValueChange(value);
    // Auto-close sidebar on mobile after selection
    if (isMobile) {
      onOpenChange(false);
    }
  };

  const navContent = (
    <div className="h-full flex flex-col backdrop-blur-sm">
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-0.5 p-3">
          {items.map((item, index) => {
            const isActive = item.value === activeValue;

            return (
              <button
                key={item.value}
                onClick={() => handleItemClick(item.value)}
                style={{ animationDelay: `${index * 30}ms` }}
                className={cn(
                  "group relative w-full text-left px-3 py-2.5 text-sm font-medium rounded-md overflow-hidden",
                  "transition-all duration-300 ease-out",
                  "hover:translate-x-0.5",
                  isActive
                    ? "text-foreground bg-gradient-to-r from-primary/20 to-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                )}
              >
                {/* Active indicator with glow */}
                {isActive && (
                  <>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-[0_0_8px_rgba(var(--primary-rgb),0.6)]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50" />
                  </>
                )}

                <span className="relative flex items-center gap-2.5 z-10">
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  <span className="truncate">{item.label}</span>
                </span>

                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );

  return (
    <>
      {/* Desktop: Fixed sidebar with proximity reveal (≥768px) */}
      <aside
        className={cn(
          "hidden md:block border-r border-primary/10 bg-card/95 backdrop-blur-md relative group/sidebar",
          "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "shadow-[2px_0_20px_rgba(var(--primary-rgb),0.1)]",
          open ? "w-60" : isPeeking ? "w-16" : "w-0 overflow-hidden",
          className
        )}
        onMouseEnter={() => !open && setIsPeeking(true)}
        onMouseLeave={() => setIsPeeking(false)}
      >
        {open ? (
          <div className="animate-in fade-in-0 slide-in-from-left-4 duration-300 h-full relative">
            {navContent}
            {/* Extended hover zone to keep button visible */}
            <div className="absolute right-0 top-0 bottom-0 w-8 group-hover/sidebar:bg-transparent" />
            {/* Close button on hover - subtle tab on right edge */}
            <div className="absolute -right-5 top-1/2 -translate-y-1/2 z-20">
              <button
                onClick={() => onOpenChange(false)}
                onMouseEnter={e => {
                  // Keep the button visible when hovering over it
                  e.currentTarget.style.opacity = "1";
                }}
                className="group relative h-16 w-4 rounded-r-full transition-all duration-300 bg-card/80 backdrop-blur-sm border-y border-r border-primary/20 hover:w-5 hover:border-primary/50 shadow-lg opacity-0 group-hover/sidebar:opacity-100"
                title="Close sidebar"
              >
                <div className="absolute inset-0 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_12px_rgba(var(--primary-rgb),0.4)]" />
                {/* Subtle chevron hint */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ChevronLeft className="h-3.5 w-3.5 text-primary" />
                </div>
                {/* Indicator dots */}
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
                  <div className="w-0.5 h-0.5 rounded-full bg-primary/50" />
                  <div className="w-0.5 h-0.5 rounded-full bg-primary/50" />
                  <div className="w-0.5 h-0.5 rounded-full bg-primary/50" />
                </div>
              </button>
            </div>
          </div>
        ) : isPeeking ? (
          <div className="h-full flex items-center justify-center p-2 animate-in fade-in-0 zoom-in-95 duration-200">
            <button
              onClick={() => onOpenChange(true)}
              className="group relative h-16 w-4 rounded-l-full transition-all duration-300 bg-card/80 backdrop-blur-sm border-y border-l border-primary/20 hover:w-5 hover:border-primary/50 shadow-lg"
              title="Open sidebar"
            >
              <div className="absolute inset-0 rounded-l-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_12px_rgba(var(--primary-rgb),0.4)]" />
              {/* Subtle chevron hint */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <ChevronRight className="h-3.5 w-3.5 text-primary" />
              </div>
              {/* Indicator dots */}
              <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
                <div className="w-0.5 h-0.5 rounded-full bg-primary/50" />
                <div className="w-0.5 h-0.5 rounded-full bg-primary/50" />
                <div className="w-0.5 h-0.5 rounded-full bg-primary/50" />
              </div>
            </button>
          </div>
        ) : null}
      </aside>

      {/* Edge indicator when sidebar is closed (desktop only) - animated pulse */}
      {!open && !isMobile && !isPeeking && (
        <div className="hidden md:block fixed left-0 top-1/2 -translate-y-1/2 z-10 animate-in fade-in-0 slide-in-from-left-2 duration-700">
          <div
            className={cn(
              "relative w-1 h-20 bg-gradient-to-b from-transparent via-primary/40 to-transparent rounded-r-full",
              "transition-all duration-500",
              "hover:w-1.5 hover:via-primary/70 hover:shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]",
              "before:absolute before:inset-0 before:bg-primary/20 before:rounded-r-full before:animate-pulse"
            )}
          />
        </div>
      )}

      {/* Mobile: Edge handle + Sheet overlay (<768px) - cyberpunk style */}
      {!open && isMobile && (
        <div className="md:hidden fixed left-0 top-1/2 -translate-y-1/2 z-10 animate-in fade-in-0 slide-in-from-left-2 duration-500">
          <button
            onClick={() => onOpenChange(true)}
            className="group relative h-20 w-6 rounded-r-lg bg-card/80 backdrop-blur-sm border-y border-r border-primary/20 shadow-lg transition-all duration-300 hover:w-8 hover:border-primary/50"
          >
            <ChevronRight className="h-4 w-4 mx-auto text-muted-foreground group-hover:text-primary transition-all duration-300" />
            <div className="absolute inset-0 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)]" />
            {/* Pulsing indicator dots */}
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-1">
              <div
                className="w-1 h-1 rounded-full bg-primary/40 animate-pulse"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-1 h-1 rounded-full bg-primary/40 animate-pulse"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-1 h-1 rounded-full bg-primary/40 animate-pulse"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </button>
        </div>
      )}

      <Sheet open={open && isMobile} onOpenChange={onOpenChange}>
        <SheetContent
          side="left"
          className={cn(
            "w-[280px] p-0 md:hidden",
            "bg-card/95 backdrop-blur-xl border-primary/20",
            "shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]"
          )}
        >
          <div className="animate-in fade-in-0 slide-in-from-left-8 duration-300">{navContent}</div>
        </SheetContent>
      </Sheet>
    </>
  );
}
