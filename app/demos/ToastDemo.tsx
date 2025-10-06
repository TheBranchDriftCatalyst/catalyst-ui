import { Button } from "@/catalyst-ui/ui/button";
import { useToast } from "@/catalyst-ui/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";

export function ToastDemo() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      {/* Basic Toasts */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Toasts</CardTitle>
          <CardDescription>Different toast variants</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "Default Toast",
                description: "This is a default toast notification.",
                duration: 5000,
              });
            }}
          >
            Default
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "Success!",
                description: "Your changes have been saved.",
                variant: "secondary",
                duration: 5000,
              });
            }}
          >
            Success
          </Button>

          <Button
            variant="destructive"
            onClick={() => {
              toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
                duration: 5000,
              });
            }}
          >
            Error
          </Button>
        </CardContent>
      </Card>

      {/* Animation Types */}
      <Card>
        <CardHeader>
          <CardTitle>Animation Types</CardTitle>
          <CardDescription>Different animation variants</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "Slide Animation",
                description: "Slides in from the top",
                animation: "slide",
                duration: 4000,
              });
            }}
          >
            Slide
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "Fade Animation",
                description: "Fades in smoothly",
                animation: "fade",
                duration: 4000,
              });
            }}
          >
            Fade
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "Bounce Animation",
                description: "Bounces in with energy",
                animation: "bounce",
                duration: 4000,
              });
            }}
          >
            Bounce
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "Scale Animation",
                description: "Scales up from center",
                animation: "scale",
                duration: 4000,
              });
            }}
          >
            Scale
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "Slide Up Animation",
                description: "Slides in from the bottom",
                animation: "slide-up",
                duration: 4000,
              });
            }}
          >
            Slide Up
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "Slide Down Animation",
                description: "Slides in from the top",
                animation: "slide-down",
                duration: 4000,
              });
            }}
          >
            Slide Down
          </Button>
        </CardContent>
      </Card>

      {/* Stacked Toasts */}
      <Card>
        <CardHeader>
          <CardTitle>Stacked Toasts</CardTitle>
          <CardDescription>Multiple toasts with different animations</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              const animations = ["slide", "fade", "bounce", "scale", "slide-up"] as const;
              const variants = ["default", "secondary", "destructive"] as const;

              animations.forEach((animation, index) => {
                setTimeout(() => {
                  toast({
                    title: `Toast ${index + 1}`,
                    description: `${animation} animation`,
                    animation,
                    variant: variants[index % variants.length],
                    duration: 6000,
                  });
                }, index * 200);
              });
            }}
          >
            Stack 5 Toasts
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                  toast({
                    title: `Notification ${i + 1}`,
                    description: `This is toast number ${i + 1}`,
                    animation: i === 0 ? "bounce" : i === 1 ? "scale" : "fade",
                    duration: 5000,
                  });
                }, i * 300);
              }
            }}
          >
            Stack 3 Toasts
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "First",
                description: "Fade in",
                animation: "fade",
                duration: 4000,
              });
              setTimeout(() => {
                toast({
                  title: "Second",
                  description: "Scale in",
                  animation: "scale",
                  variant: "secondary",
                  duration: 4000,
                });
              }, 400);
            }}
          >
            Stack 2 Toasts
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
