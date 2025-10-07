import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/catalyst-ui/ui/card";
import { Label } from "@/catalyst-ui/ui/label";
import { Button } from "@/catalyst-ui/ui/button";
import { Typography } from "@/catalyst-ui/ui/typography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/catalyst-ui/ui/tabs";
import { AnimatedFlipDemo } from "../demos/AnimatedFlipDemo";
import { AnimatedFadeDemo } from "../demos/AnimatedFadeDemo";
import { AnimatedSlideDemo } from "../demos/AnimatedSlideDemo";
import { AnimatedBounceDemo } from "../demos/AnimatedBounceDemo";
import { ScrollSnapItem } from "@/catalyst-ui/effects";
import { D4Loader } from "../components/D4Loader";
import { useTheme } from "@/catalyst-ui/contexts/Theme/ThemeContext";
import { Badge } from "@/catalyst-ui/ui/badge";

export function AnimationsTab() {
  const { effects } = useTheme();

  return (
    <div className="space-y-6 mt-0">
      {/* Overview Card */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>Animation System</CardTitle>
            <CardDescription>
              Two approaches to animations: React HOCs for interactive components • CSS keyframes
              for theme effects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Typography variant="h4" className="text-sm font-semibold">
                  React Animation HOCs
                </Typography>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>AnimatedFlip - 3D card flipping</li>
                  <li>AnimatedFade - Opacity transitions</li>
                  <li>AnimatedSlide - Directional sliding</li>
                  <li>AnimatedBounce - Spring-like scaling</li>
                </ul>
                <p className="text-xs text-muted-foreground italic pt-2">
                  ✅ Best for: Custom components, state-driven animations, CodeFlipCard-style
                  interactions
                </p>
              </div>
              <div className="space-y-2">
                <Typography variant="h4" className="text-sm font-semibold">
                  Scroll Snap HOCs
                </Typography>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>ScrollSnapContainer - Scrollable area</li>
                  <li>ScrollSnapItem - Snap points</li>
                  <li>Mandatory/Proximity modes</li>
                  <li>Smooth card-to-card flow</li>
                </ul>
                <p className="text-xs text-muted-foreground italic pt-2">
                  ✅ Best for: Card galleries, full-page sections, presentation-style UIs
                </p>
              </div>
              <div className="space-y-2">
                <Typography variant="h4" className="text-sm font-semibold">
                  Theme Effect Layers
                </Typography>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Glow - Neon shadows on buttons/cards/inputs</li>
                  <li>Scanlines - Grid/scanline overlays</li>
                  <li>Borders - Shimmer, scan, pulse effects</li>
                  <li>Gradients - Animated heading/bg gradients</li>
                </ul>
                <p className="text-xs text-muted-foreground italic pt-2">
                  ✅ Toggle in Settings dropdown • Pure CSS with data attributes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollSnapItem>

      {/* Scroll Snap Demo */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>ScrollSnap HOCs</CardTitle>
            <CardDescription>
              CSS Scroll Snap API wrapped in React HOCs • Try scrolling in the demo below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Typography variant="p" className="text-sm text-muted-foreground">
              The entire Kitchen Sink app uses ScrollSnapContainer! Each card you see snaps into
              place as you scroll. Below is a miniature demo showing the same behavior in a smaller
              container.
            </Typography>

            {/* Mini Demo */}
            <div className="border-2 border-primary/20 rounded-lg overflow-hidden">
              <div
                className="h-64 overflow-y-auto scrollbar-hide"
                style={{
                  scrollSnapType: "y mandatory",
                  scrollBehavior: "smooth",
                }}
              >
                {[
                  { bg: "bg-gradient-to-br from-cyan-500/20 to-blue-500/20", label: "Card 1" },
                  { bg: "bg-gradient-to-br from-purple-500/20 to-pink-500/20", label: "Card 2" },
                  { bg: "bg-gradient-to-br from-yellow-500/20 to-orange-500/20", label: "Card 3" },
                  { bg: "bg-gradient-to-br from-green-500/20 to-emerald-500/20", label: "Card 4" },
                  { bg: "bg-gradient-to-br from-red-500/20 to-rose-500/20", label: "Card 5" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`h-64 flex items-center justify-center ${item.bg} border-b border-border/40`}
                    style={{
                      scrollSnapAlign: "start",
                      scrollSnapStop: "always",
                    }}
                  >
                    <div className="text-center">
                      <Typography variant="h3" className="font-bold">
                        {item.label}
                      </Typography>
                      <Typography variant="small" className="text-muted-foreground">
                        Scroll to snap to next card
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-accent/10 border border-primary/20 rounded">
              <Typography variant="small" className="text-xs">
                <strong>Usage:</strong> Wrap your scrollable container with{" "}
                <code className="text-primary">ScrollSnapContainer</code>, then wrap each snap point
                with <code className="text-primary">ScrollSnapItem</code>. The Kitchen Sink uses
                this pattern with <code className="text-primary">behavior="mandatory"</code> for
                aggressive snapping.
              </Typography>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <code className="text-xs text-muted-foreground">
              import {"{ScrollSnapContainer, ScrollSnapItem}"} from '@/catalyst-ui/effects';
            </code>
          </CardFooter>
        </Card>
      </ScrollSnapItem>

      {/* D4 Loader Demo */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>D4 Loader - 4D Hypercube</CardTitle>
            <CardDescription>
              Tesseract projection with D3.js • Used as lazy-loading fallback throughout the app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Typography variant="p" className="text-sm text-muted-foreground">
              A rotating 4-dimensional hypercube (tesseract) projected into 2D space, with orbiting
              particles and neon glow effects. Features 16 vertices, 32 edges, and rotations through
              XY, ZW, XZ, and YW planes.
            </Typography>

            <div className="border border-primary/20 rounded-lg bg-accent/5 p-4">
              <D4Loader />
            </div>

            <div className="p-3 bg-accent/10 border border-primary/20 rounded">
              <Typography variant="small" className="text-xs">
                <strong>Technical details:</strong> 60fps animation using D3 intervals, perspective
                projection from 4D→3D→2D, depth-based opacity fading, and SVG filter effects for
                glows. All synchronized to theme colors.
              </Typography>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <code className="text-xs text-muted-foreground">
              import {"{ D4Loader }"} from '@/catalyst-ui/components/D4Loader';
            </code>
          </CardFooter>
        </Card>
      </ScrollSnapItem>

      {/* Tabbed Content */}
      <Tabs defaultValue="hocs" className="w-full">
        <ScrollSnapItem>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="hocs">React HOCs</TabsTrigger>
            <TabsTrigger value="effects">Effect Layers</TabsTrigger>
          </TabsList>
        </ScrollSnapItem>
        {/* React HOCs Tab */}
        <TabsContent value="hocs" className="space-y-6 mt-4">
          <ScrollSnapItem align="start">
            <Card>
              <CardHeader>
                <CardTitle>AnimatedFlip</CardTitle>
                <CardDescription>
                  3D flip animation for cards and components • Used in CodeFlipCard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatedFlipDemo />
              </CardContent>
              <CardFooter className="border-t pt-4">
                <code className="text-xs text-muted-foreground">
                  import {"{ AnimatedFlip }"} from '@/catalyst-ui/effects';
                </code>
              </CardFooter>
            </Card>
          </ScrollSnapItem>

          <ScrollSnapItem align="start">
            <Card>
              <CardHeader>
                <CardTitle>AnimatedFade</CardTitle>
                <CardDescription>
                  Smooth opacity transitions • Perfect for overlays and modals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatedFadeDemo />
              </CardContent>
              <CardFooter className="border-t pt-4">
                <code className="text-xs text-muted-foreground">
                  import {"{ AnimatedFade }"} from '@/catalyst-ui/effects';
                </code>
              </CardFooter>
            </Card>
          </ScrollSnapItem>

          <ScrollSnapItem align="start">
            <Card>
              <CardHeader>
                <CardTitle>AnimatedSlide</CardTitle>
                <CardDescription>
                  Directional slide animations from 4 directions • Great for drawers and toasts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatedSlideDemo />
              </CardContent>
              <CardFooter className="border-t pt-4">
                <code className="text-xs text-muted-foreground">
                  import {"{ AnimatedSlide }"} from '@/catalyst-ui/effects';
                </code>
              </CardFooter>
            </Card>
          </ScrollSnapItem>

          <ScrollSnapItem align="start">
            <Card>
              <CardHeader>
                <CardTitle>AnimatedBounce</CardTitle>
                <CardDescription>
                  Spring-like bounce effects • Adds playful interaction to buttons and icons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatedBounceDemo />
              </CardContent>
              <CardFooter className="border-t pt-4">
                <code className="text-xs text-muted-foreground">
                  import {"{ AnimatedBounce }"} from '@/catalyst-ui/effects';
                </code>
              </CardFooter>
            </Card>
          </ScrollSnapItem>

          {/* Design Principles */}
          <ScrollSnapItem align="start">
            <Card>
              <CardHeader>
                <CardTitle>Design Principles</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>
                    <strong>Controlled & Uncontrolled Modes</strong> - All HOCs support both
                    patterns for flexibility
                  </li>
                  <li>
                    <strong>Content Agnostic</strong> - Works with any React component, not tied to
                    specific content
                  </li>
                  <li>
                    <strong>Hardware Accelerated</strong> - Uses CSS transforms and transitions for
                    smooth performance
                  </li>
                  <li>
                    <strong>TypeScript First</strong> - Fully typed with prop interfaces and
                    generics
                  </li>
                  <li>
                    <strong>Accessible</strong> - Preserves focus management and keyboard navigation
                  </li>
                </ul>
              </CardContent>
            </Card>
          </ScrollSnapItem>
        </TabsContent>

        {/* Effect Layers Tab */}
        <TabsContent value="effects" className="space-y-4 mt-4">
          <ScrollSnapItem align="start">
            <Card>
              <CardHeader>
                <CardTitle>Theme Effect Layers</CardTitle>
                <CardDescription>
                  Modular CSS effects controlled via data attributes • Toggle in Settings dropdown
                  (avatar icon)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-accent/10 border border-primary/20 rounded">
                  <Typography variant="h4" className="text-sm font-semibold mb-2">
                    Current Effect Status:
                  </Typography>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={effects.glow ? "default" : "outline"}>
                      Glow: {effects.glow ? "✅ ON" : "❌ OFF"}
                    </Badge>
                    <Badge variant={effects.scanlines ? "default" : "outline"}>
                      Scanlines: {effects.scanlines ? "✅ ON" : "❌ OFF"}
                    </Badge>
                    <Badge variant={effects.borderAnimations ? "default" : "outline"}>
                      Border Animations: {effects.borderAnimations ? "✅ ON" : "❌ OFF"}
                    </Badge>
                    <Badge variant={effects.gradientShift ? "default" : "outline"}>
                      Gradient Shift: {effects.gradientShift ? "✅ ON" : "❌ OFF"}
                    </Badge>
                  </div>
                </div>
                {/* Glow Layer */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">1. Glow Layer</Label>
                  <Typography variant="small" className="text-muted-foreground">
                    Neon shadows on buttons, inputs, cards, and links • Requires dark mode for full
                    effect
                  </Typography>
                  <Card className="cursor-pointer">
                    <CardHeader>
                      <CardTitle>Hover Me!</CardTitle>
                      <CardDescription>
                        {effects.glow
                          ? "Glow effect is ON - you should see subtle neon shadows"
                          : "Glow effect is OFF - enable in Settings"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button>Primary Button</Button>
                      <Button variant="outline">Outline Button</Button>
                      <a href="#" className="text-primary underline">
                        Sample Link
                      </a>
                    </CardContent>
                  </Card>
                  <code className="text-xs text-muted-foreground">
                    html[data-effect-glow="true"].dark
                  </code>
                </div>

                {/* Scanlines Layer */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">2. Scanlines & Grid Layer</Label>
                  <Typography variant="small" className="text-muted-foreground">
                    Full-page grid pattern and horizontal scanlines overlay • CRT monitor aesthetic
                  </Typography>
                  <div className="p-4 bg-accent/10 border border-primary/20 rounded">
                    {effects.scanlines ? (
                      <Typography variant="p" className="text-sm">
                        ✅ Scanlines are ON - Look at the entire page background to see the grid
                        pattern and subtle scanlines
                      </Typography>
                    ) : (
                      <Typography variant="p" className="text-sm">
                        ❌ Scanlines are OFF - Enable in Settings to see grid pattern and scanlines
                        on the page background
                      </Typography>
                    )}
                  </div>
                  <code className="text-xs text-muted-foreground">
                    html[data-effect-scanlines="true"] body::before/::after
                  </code>
                </div>

                {/* Border Animations Layer */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">3. Border Animations Layer</Label>
                  <Typography variant="small" className="text-muted-foreground">
                    Shimmer, scan, and pulse effects on borders • Includes header glow gradient
                  </Typography>
                  <div className="space-y-3">
                    <div className="border-shimmer h-20 rounded-lg border-2 border-primary/50 flex items-center justify-center">
                      <code className="text-xs">.border-shimmer</code>
                    </div>
                    <div className="border-glow-pulse h-20 rounded-lg flex items-center justify-center">
                      <code className="text-xs">.border-glow-pulse</code>
                    </div>
                    {effects.borderAnimations ? (
                      <Typography variant="small" className="text-muted-foreground">
                        ✅ Border animations ON - Look at the header for gradient glow cycling
                      </Typography>
                    ) : (
                      <Typography variant="small" className="text-muted-foreground">
                        ❌ Border animations OFF - Enable to see effects
                      </Typography>
                    )}
                  </div>
                  <code className="text-xs text-muted-foreground">
                    html[data-effect-border-animations="true"]
                  </code>
                </div>

                {/* Gradient Shift Layer */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">4. Gradient Shift Layer</Label>
                  <Typography variant="small" className="text-muted-foreground">
                    Animated gradient on headings and backgrounds • 8-second color cycle
                  </Typography>
                  <div className="space-y-3">
                    <Typography variant="h1">Sample Heading</Typography>
                    <Typography variant="h3">Smaller Heading</Typography>
                    {effects.gradientShift ? (
                      <Typography variant="small" className="text-muted-foreground">
                        ✅ Gradient animations ON - Watch the heading colors shift slowly
                      </Typography>
                    ) : (
                      <Typography variant="small" className="text-muted-foreground">
                        ❌ Gradient animations OFF - Headings are static
                      </Typography>
                    )}
                  </div>
                  <code className="text-xs text-muted-foreground">
                    html[data-effect-gradient-shift="true"] h1-h6
                  </code>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-2 border-t pt-4">
                <Typography variant="h4" className="text-sm font-semibold">
                  Effect Layer Architecture:
                </Typography>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>
                    <strong>Modular</strong> - Each effect is a separate CSS file loaded at build
                    time
                  </li>
                  <li>
                    <strong>Data Attributes</strong> - Controlled via{" "}
                    <code>html[data-effect-*="true"]</code> selectors
                  </li>
                  <li>
                    <strong>React State</strong> - Toggle state managed by ThemeProvider +
                    localStorage
                  </li>
                  <li>
                    <strong>Pure CSS</strong> - No JavaScript for rendering, only for state
                    management
                  </li>
                  <li>
                    <strong>Theme-Agnostic</strong> - Works with ALL themes (Catalyst, Dracula,
                    Nord, etc.)
                  </li>
                  <li>
                    <strong>CSS Variables</strong> - Uses theme colors via{" "}
                    <code>var(--primary)</code>, adapts to each theme automatically
                  </li>
                </ul>
                <Typography variant="small" className="text-xs text-muted-foreground mt-2">
                  💡 Tip: Switch between themes in Settings to see how effects adapt to different
                  color palettes!
                </Typography>
              </CardFooter>
            </Card>
          </ScrollSnapItem>
        </TabsContent>
      </Tabs>
    </div>
  );
}
