import { Button } from "@/catalyst-ui/ui/button";
import { useToast } from "@/catalyst-ui/ui/use-toast";

export function ToastDemo() {
  const { toast } = useToast();

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Button
        variant="outline"
        onClick={() => {
          toast({
            title: "Scheduled: Catch up",
            description: "Friday, February 10, 2023 at 5:57 PM",
          });
        }}
      >
        Show Toast
      </Button>

      <Button
        variant="default"
        onClick={() => {
          toast({
            title: "Success!",
            description: "Your changes have been saved.",
          });
        }}
      >
        Success Toast
      </Button>

      <Button
        variant="destructive"
        onClick={() => {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
          });
        }}
      >
        Error Toast
      </Button>
    </div>
  );
}
