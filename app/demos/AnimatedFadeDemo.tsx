import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { AnimatedFade } from "@/catalyst-ui/components/effects";
import { useState } from "react";
import { Button } from "@/catalyst-ui/ui/button";

export function AnimatedFadeDemo() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button onClick={() => setIsVisible(!isVisible)} size="sm">
          {isVisible ? "Hide" : "Show"}
        </Button>
        <code className="text-xs text-muted-foreground self-center">
          duration: 300ms | opacity transition
        </code>
      </div>
      <AnimatedFade
        isVisible={isVisible}
        onVisibilityChange={setIsVisible}
        duration={300}
      >
        <Card>
          <CardHeader>
            <CardTitle>Fading Content</CardTitle>
            <CardDescription>Smooth opacity transition</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              AnimatedFade provides smooth fade in/out animations.
              Perfect for overlays, modals, and tooltips.
            </p>
          </CardContent>
        </Card>
      </AnimatedFade>
    </div>
  );
}
