import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";

export function CodeFlipCardExampleDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Click to Flip</CardTitle>
        <CardDescription>View the complete source code including imports</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          CodeFlipCard wraps any component and shows its source code when flipped. Perfect for
          documentation and component showcases.
        </p>
      </CardContent>
    </Card>
  );
}
