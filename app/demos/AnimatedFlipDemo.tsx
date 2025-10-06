import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { AnimatedFlip } from "@/catalyst-ui/components/AnimationHOC";
import { useState } from "react";
import { Button } from "@/catalyst-ui/ui/button";

export function AnimatedFlipDemo() {
  const [isFlipped, setIsFlipped] = useState(false);

  const frontCard = (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Front Side</CardTitle>
        <CardDescription>Click the button to flip</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This is the front face of the card. The AnimatedFlip HOC handles
          the 3D rotation animation.
        </p>
      </CardContent>
    </Card>
  );

  const backCard = (
    <Card className="w-full bg-primary/10">
      <CardHeader>
        <CardTitle>Back Side</CardTitle>
        <CardDescription>Flipped content</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This is the back face. Perfect for showing code, details, or
          alternative views.
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button onClick={() => setIsFlipped(!isFlipped)} size="sm">
          {isFlipped ? "Flip Back" : "Flip Card"}
        </Button>
        <code className="text-xs text-muted-foreground self-center">
          duration: 600ms | direction: horizontal
        </code>
      </div>
      <AnimatedFlip
        front={frontCard}
        back={backCard}
        isFlipped={isFlipped}
        onFlipChange={setIsFlipped}
        trigger="click"
        direction="horizontal"
        duration={600}
      />
    </div>
  );
}
