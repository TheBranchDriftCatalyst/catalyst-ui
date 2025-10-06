import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { AnimatedBounce } from "@/catalyst-ui/components/AnimationHOC";
import { Button } from "@/catalyst-ui/ui/button";

export function AnimatedBounceDemo() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center flex-wrap">
        <code className="text-xs text-muted-foreground">
          Hover buttons below | intensity: 1.1 | duration: 500ms
        </code>
      </div>
      <div className="flex gap-4 flex-wrap">
        <AnimatedBounce trigger="hover" intensity={1.1} duration={500}>
          <Button>Hover Me</Button>
        </AnimatedBounce>
        <AnimatedBounce trigger="hover" intensity={1.15} duration={600}>
          <Button variant="outline">Bigger Bounce</Button>
        </AnimatedBounce>
        <AnimatedBounce trigger="hover" intensity={1.05} duration={400}>
          <Button variant="secondary">Subtle Bounce</Button>
        </AnimatedBounce>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Bouncing Animations</CardTitle>
          <CardDescription>Spring-like scale effect</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            AnimatedBounce provides playful spring-like animations.
            Perfect for buttons, icons, and interactive elements.
          </p>
          <AnimatedBounce trigger="hover" intensity={1.08} duration={500}>
            <div className="p-6 bg-primary/10 rounded-lg border border-primary/20 text-center cursor-pointer">
              <p className="text-sm font-medium">Hover this card too!</p>
              <p className="text-xs text-muted-foreground mt-2">
                Uses cubic-bezier(0.68, -0.55, 0.265, 1.55) for spring effect
              </p>
            </div>
          </AnimatedBounce>
        </CardContent>
      </Card>
    </div>
  );
}
