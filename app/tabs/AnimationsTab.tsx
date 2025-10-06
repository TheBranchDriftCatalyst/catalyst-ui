import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { Label } from "@/catalyst-ui/ui/label";
import { Button } from "@/catalyst-ui/ui/button";
import { Typography } from "@/catalyst-ui/ui/typography";

export function AnimationsTab() {
  return (
    <div className="space-y-4 mt-0">
      <Card>
        <CardHeader>
          <CardTitle>CSS Animations</CardTitle>
          <CardDescription>
            Ultra-subtle animations from the Catalyst theme • Hover to see effects • Best viewed in dark mode
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Border Shimmer */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Border Shimmer</Label>
            <div
              className="h-32 rounded-lg border-2 flex items-center justify-center text-sm"
              style={{
                borderColor: 'var(--primary)',
                animation: 'border-shimmer 8s linear infinite',
                background: 'linear-gradient(90deg, transparent, rgba(var(--neon-cyan-rgb), 0.05), transparent)'
              }}
            >
              Subtle shimmer animation (8s loop)
            </div>
            <code className="text-xs text-muted-foreground">animation: border-shimmer 8s linear infinite</code>
          </div>

          {/* Laser Pulse */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Laser Pulse</Label>
            <div
              className="h-32 rounded-lg bg-card flex items-center justify-center text-sm"
              style={{
                animation: 'laser-pulse 8s ease-in-out infinite'
              }}
            >
              Ultra-subtle pulsing glow (8s loop)
            </div>
            <code className="text-xs text-muted-foreground">animation: laser-pulse 8s ease-in-out infinite</code>
          </div>

          {/* Glitter */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Glitter / Sparkle</Label>
            <div
              className="h-32 rounded-lg bg-primary/10 border border-primary flex items-center justify-center text-sm relative overflow-hidden"
              style={{
                animation: 'glitter 8s ease-in-out infinite'
              }}
            >
              Glimmer effect (8s loop)
            </div>
            <code className="text-xs text-muted-foreground">animation: glitter 8s ease-in-out infinite</code>
          </div>

          {/* Border Scan */}
          {/* TODO: Note border scab doesnt really look good/work */}
          {/* <div className="space-y-2">
            <Label className="text-sm font-semibold">Border Scan</Label>
            <div
              className="h-32 rounded-lg border-2 border-primary/30 flex items-center justify-center text-sm relative"
              style={{
                animation: 'border-scan 4s linear infinite'
              }}
            >
              Traveling light along border (4s loop)
            </div>
            <code className="text-xs text-muted-foreground">animation: border-scan 4s linear infinite</code>
          </div> */}

          {/* Neon Underline */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Neon Underline (for links)</Label>
            <div className="h-32 flex items-center justify-center">
              <a
                href="#"
                className="text-2xl relative inline-block"
                style={{
                  animation: 'neon-underline 4s ease-in-out infinite'
                }}
              >
                Hover me for subtle glow
              </a>
            </div>
            <code className="text-xs text-muted-foreground">animation: neon-underline 4s ease-in-out infinite</code>
          </div>

          {/* Hover Card Demo */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Card Hover Effect</Label>
            <Card className="hover:shadow-[var(--shadow-neon-lg)] transition-all duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle>Interactive Card</CardTitle>
                <CardDescription>Hover to see the laser-pulse animation</CardDescription>
              </CardHeader>
              <CardContent>
                In the Catalyst dark theme, cards automatically get the laser-pulse animation on hover.
                This creates a very subtle, almost imperceptible glow that adds depth.
              </CardContent>
            </Card>
            <code className="text-xs text-muted-foreground">.theme-catalyst.dark [class*="card"]:hover</code>
          </div>

          {/* Button Shimmer */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Button Shimmer on Hover</Label>
            <div className="flex gap-4">
              <Button className="relative overflow-hidden">
                Hover for shimmer
              </Button>
              <Button variant="outline" className="relative overflow-hidden">
                Outline variant
              </Button>
              <Button variant="secondary" className="relative overflow-hidden">
                Secondary variant
              </Button>
            </div>
            <code className="text-xs text-muted-foreground">Buttons get button-shimmer animation on hover (applied via theme CSS)</code>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2 border-t pt-4">
          <Typography variant="h4" className="text-sm font-semibold">Animation Design Philosophy:</Typography>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li><strong>Ultra-Subtle</strong> - Opacity values reduced by 60-85% for barely perceptible effects</li>
            <li><strong>Slow Timing</strong> - 4-10 second durations to avoid being distracting</li>
            <li><strong>Theme-Specific</strong> - Only applied in Catalyst theme for cybersynthpunk aesthetic</li>
            <li><strong>Performance</strong> - Uses GPU-accelerated properties (box-shadow, opacity, transform)</li>
            <li><strong>Contextual</strong> - Applied on hover or specific elements to add depth without overwhelming</li>
          </ul>
        </CardFooter>
      </Card>
    </div>
  );
}
