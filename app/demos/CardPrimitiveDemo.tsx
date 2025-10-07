import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/catalyst-ui/ui/card";
import { Button } from "@/catalyst-ui/ui/button";

export function CardPrimitiveDemo() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Simple Card</CardTitle>
          <CardDescription>Basic card with title and description</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This is a simple card with some content. Cards can contain any React components.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>With Footer</CardTitle>
          <CardDescription>Card with footer actions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Cards can have footers for actions or additional information.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Deploy</Button>
        </CardFooter>
      </Card>

      <Card className="border-primary">
        <CardHeader>
          <CardTitle className="text-primary">Styled Card</CardTitle>
          <CardDescription>Custom styling with Tailwind</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Cards can be styled using Tailwind classes for custom borders, backgrounds, and more.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="secondary" className="w-full">
            Action
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
