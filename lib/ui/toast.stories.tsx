import type { Meta, StoryObj } from "@storybook/react";
import { Toaster } from "./toaster";
import { useToast } from "./use-toast";
import { Button } from "./button";
import { ToastAction } from "./toast";

// Wrapper component to use the hook
function ToastDemo() {
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Toast Notifications</h3>
        <p className="text-sm text-muted-foreground">
          Click the buttons below to trigger different toast variants
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
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
              variant: "destructive",
              title: "Error Occurred",
              description: "There was a problem with your request.",
              duration: 5000,
            });
          }}
        >
          Destructive
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            toast({
              title: "Success!",
              description: "Your changes have been saved.",
              variant: "secondary",
              duration: 3000,
            });
          }}
        >
          Success
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            toast({
              title: "With Action",
              description: "You can add action buttons to toasts.",
              action: <ToastAction altText="Undo">Undo</ToastAction>,
              duration: 5000,
            });
          }}
        >
          With Action
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            toast({
              title: "Title Only",
              duration: 3000,
            });
          }}
        >
          Title Only
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            toast({
              description: "Description only notification",
              duration: 3000,
            });
          }}
        >
          Description Only
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            toast({
              title: "Long Duration",
              description: "This toast will stay visible for 10 seconds. Watch the progress bar!",
              duration: 10000,
            });
          }}
        >
          Long Duration (10s)
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            toast({
              title: "Short Duration",
              description: "This toast disappears quickly.",
              duration: 2000,
            });
          }}
        >
          Short Duration (2s)
        </Button>
      </div>

      <Toaster />
    </div>
  );
}

const meta = {
  title: "UI/Toast",
  component: ToastDemo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ToastDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: () => <ToastDemo />,
};

export const MultipleToasts: Story = {
  render: () => {
    const { toast } = useToast();

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Multiple Toasts</h3>
        <p className="text-sm text-muted-foreground">Trigger multiple toasts to see them stack</p>
        <Button
          onClick={() => {
            toast({
              title: "First toast",
              description: "This is the first notification",
              duration: 5000,
            });
            setTimeout(() => {
              toast({
                title: "Second toast",
                description: "This is the second notification",
                variant: "secondary",
                duration: 5000,
              });
            }, 500);
            setTimeout(() => {
              toast({
                title: "Third toast",
                description: "This is the third notification",
                duration: 5000,
              });
            }, 1000);
          }}
        >
          Trigger 3 Toasts
        </Button>
        <Toaster />
      </div>
    );
  },
};

export const WithComplexAction: Story = {
  render: () => {
    const { toast } = useToast();

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Toast with Actions</h3>
        <p className="text-sm text-muted-foreground">
          Toasts can include action buttons for user interaction
        </p>
        <Button
          onClick={() => {
            toast({
              title: "Email Sent",
              description: "Your message has been delivered successfully.",
              action: (
                <ToastAction
                  altText="View email"
                  onClick={() => {
                    toast({
                      title: "Viewing email",
                      description: "Opening email in new window...",
                      variant: "secondary",
                      duration: 2000,
                    });
                  }}
                >
                  View
                </ToastAction>
              ),
              duration: 8000,
            });
          }}
        >
          Send Email Notification
        </Button>
        <Toaster />
      </div>
    );
  },
};

export const ErrorNotification: Story = {
  render: () => {
    const { toast } = useToast();

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Error Toast Pattern</h3>
        <p className="text-sm text-muted-foreground">
          Common pattern for error handling with retry action
        </p>
        <Button
          variant="destructive"
          onClick={() => {
            toast({
              variant: "destructive",
              title: "Connection Failed",
              description: "Unable to reach the server. Please try again.",
              action: (
                <ToastAction
                  altText="Retry connection"
                  onClick={() => {
                    toast({
                      title: "Retrying...",
                      description: "Attempting to reconnect",
                      variant: "secondary",
                      duration: 3000,
                    });
                  }}
                >
                  Retry
                </ToastAction>
              ),
              duration: 10000,
            });
          }}
        >
          Simulate Error
        </Button>
        <Toaster />
      </div>
    );
  },
};
