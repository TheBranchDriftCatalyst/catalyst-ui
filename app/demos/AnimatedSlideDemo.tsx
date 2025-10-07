import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { AnimatedSlide } from "@/catalyst-ui/components/effects";
import { useState } from "react";
import { Button } from "@/catalyst-ui/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/catalyst-ui/ui/select";
import type { SlideDirection } from "@/catalyst-ui/components/effects";

export function AnimatedSlideDemo() {
  const [isVisible, setIsVisible] = useState(true);
  const [direction, setDirection] = useState<SlideDirection>("bottom");

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center flex-wrap">
        <Button onClick={() => setIsVisible(!isVisible)} size="sm">
          {isVisible ? "Hide" : "Show"}
        </Button>
        <Select value={direction} onValueChange={(v) => setDirection(v as SlideDirection)}>
          <SelectTrigger className="w-[120px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="top">Top</SelectItem>
            <SelectItem value="right">Right</SelectItem>
            <SelectItem value="bottom">Bottom</SelectItem>
            <SelectItem value="left">Left</SelectItem>
          </SelectContent>
        </Select>
        <code className="text-xs text-muted-foreground">
          duration: 400ms | distance: 50px
        </code>
      </div>
      <AnimatedSlide
        isVisible={isVisible}
        onVisibilityChange={setIsVisible}
        direction={direction}
        duration={400}
        distance={50}
      >
        <Card>
          <CardHeader>
            <CardTitle>Sliding Content</CardTitle>
            <CardDescription>Slides from {direction}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              AnimatedSlide provides directional slide animations.
              Great for drawers, sheets, and notifications.
            </p>
          </CardContent>
        </Card>
      </AnimatedSlide>
    </div>
  );
}
