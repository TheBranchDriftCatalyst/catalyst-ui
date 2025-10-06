import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { Label } from "@/catalyst-ui/ui/label";
import { Button } from "@/catalyst-ui/ui/button";
import { Typography } from "@/catalyst-ui/ui/typography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/catalyst-ui/ui/tabs";
import { AnimatedFlipDemo } from "../demos/AnimatedFlipDemo";
import { AnimatedFadeDemo } from "../demos/AnimatedFadeDemo";
import { AnimatedSlideDemo } from "../demos/AnimatedSlideDemo";
import { AnimatedBounceDemo } from "../demos/AnimatedBounceDemo";
import { ScrollSnapItem } from "@/catalyst-ui/components/AnimationHOC";

export function AnimationsTab() {
  return (
    <div className="space-y-6 mt-0">
      {/* Overview Card */}
      <ScrollSnapItem align="start" offset={80}>
        <Card>
          <CardHeader>
            <CardTitle>Animation System</CardTitle>
            <CardDescription>
              Two approaches to animations: React HOCs for interactive components • CSS keyframes for theme effects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Typography variant="h4" className="text-sm font-semibold">React Animation HOCs</Typography>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>AnimatedFlip - 3D card flipping</li>
                  <li>AnimatedFade - Opacity transitions</li>
                  <li>AnimatedSlide - Directional sliding</li>
                  <li>AnimatedBounce - Spring-like scaling</li>
                </ul>
                <p className="text-xs text-muted-foreground italic pt-2">
                  ✅ Best for: Custom components, state-driven animations, CodeFlipCard-style interactions
                </p>
              </div>
              <div className="space-y-2">
                <Typography variant="h4" className="text-sm font-semibold">CSS Theme Animations</Typography>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Glow Pulse - Subtle shadow pulse</li>
                  <li>Border Shimmer - Gradient shimmer</li>
                  <li>Pulse Scale - Fade + scale effect</li>
                  <li>Text Glow - Text shadow pulse</li>
                </ul>
                <p className="text-xs text-muted-foreground italic pt-2">
                  ✅ Best for: Theme-specific effects, hover states, cyberpunk aesthetic
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollSnapItem>

      {/* Tabbed Content */}
      <Tabs defaultValue="hocs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hocs">React HOCs</TabsTrigger>
          <TabsTrigger value="css">CSS Animations</TabsTrigger>
        </TabsList>

        {/* React HOCs Tab */}
        <TabsContent value="hocs" className="space-y-6 mt-4">
          <ScrollSnapItem align="start" offset={80}>
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
                import {'{ AnimatedFlip }'} from '@/catalyst-ui/components/AnimationHOC';
              </code>
            </CardFooter>
          </Card>
          </ScrollSnapItem>

          <ScrollSnapItem align="start" offset={80}>
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
                import {'{ AnimatedFade }'} from '@/catalyst-ui/components/AnimationHOC';
              </code>
            </CardFooter>
          </Card>
          </ScrollSnapItem>

          <ScrollSnapItem align="start" offset={80}>
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
                import {'{ AnimatedSlide }'} from '@/catalyst-ui/components/AnimationHOC';
              </code>
            </CardFooter>
          </Card>
          </ScrollSnapItem>

          <ScrollSnapItem align="start" offset={80}>
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
                import {'{ AnimatedBounce }'} from '@/catalyst-ui/components/AnimationHOC';
              </code>
            </CardFooter>
          </Card>
          </ScrollSnapItem>

          {/* Design Principles */}
          <ScrollSnapItem align="start" offset={80}>
            <Card>
            <CardHeader>
              <CardTitle>Design Principles</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li><strong>Controlled & Uncontrolled Modes</strong> - All HOCs support both patterns for flexibility</li>
                <li><strong>Content Agnostic</strong> - Works with any React component, not tied to specific content</li>
                <li><strong>Hardware Accelerated</strong> - Uses CSS transforms and transitions for smooth performance</li>
                <li><strong>TypeScript First</strong> - Fully typed with prop interfaces and generics</li>
                <li><strong>Accessible</strong> - Preserves focus management and keyboard navigation</li>
              </ul>
            </CardContent>
          </Card>
          </ScrollSnapItem>
        </TabsContent>

        {/* CSS Animations Tab */}
        <TabsContent value="css" className="space-y-4 mt-4">
          <ScrollSnapItem align="start" offset={80}>
            <Card>
            <CardHeader>
              <CardTitle>CSS Keyframe Animations</CardTitle>
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

              {/* Glow Pulse */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Glow Pulse</Label>
                <div
                  className="h-32 rounded-lg bg-card flex items-center justify-center text-sm"
                  style={{
                    animation: 'glow-pulse 8s ease-in-out infinite'
                  }}
                >
                  Ultra-subtle pulsing box-shadow (8s loop)
                </div>
                <code className="text-xs text-muted-foreground">animation: glow-pulse 8s ease-in-out infinite</code>
              </div>

              {/* Pulse Scale */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Pulse Scale</Label>
                <div
                  className="h-32 rounded-lg bg-primary/10 border border-primary flex items-center justify-center text-sm relative overflow-hidden"
                  style={{
                    animation: 'pulse-scale 8s ease-in-out infinite'
                  }}
                >
                  Fade + scale effect (8s loop)
                </div>
                <code className="text-xs text-muted-foreground">animation: pulse-scale 8s ease-in-out infinite</code>
              </div>

              {/* Text Glow */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Text Glow (for links)</Label>
                <div className="h-32 flex items-center justify-center">
                  <a
                    href="#"
                    className="text-2xl relative inline-block"
                    style={{
                      animation: 'text-glow 4s ease-in-out infinite'
                    }}
                  >
                    Pulsing text-shadow glow
                  </a>
                </div>
                <code className="text-xs text-muted-foreground">animation: text-glow 4s ease-in-out infinite</code>
              </div>

              {/* Hover Card Demo */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Card Hover Effect</Label>
                <Card className="hover:shadow-[var(--shadow-neon-lg)] transition-all duration-300 cursor-pointer">
                  <CardHeader>
                    <CardTitle>Interactive Card</CardTitle>
                    <CardDescription>Hover to see the glow-pulse animation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    In the Catalyst dark theme, cards automatically get the glow-pulse animation on hover.
                    This creates a very subtle, almost imperceptible box-shadow glow that adds depth.
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
          </ScrollSnapItem>
        </TabsContent>
      </Tabs>
    </div>
  );
}
