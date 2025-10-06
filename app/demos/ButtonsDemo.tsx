import { Button } from "@/catalyst-ui/ui/button";

export function ButtonsDemo() {
  return (
    <div className="space-y-4">
      {/* Variants */}
      <div className="flex flex-wrap gap-2">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>

      {/* Sizes */}
      <div className="flex flex-wrap gap-2 items-center">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">🔥</Button>
      </div>
    </div>
  );
}
