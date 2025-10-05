import type { Meta, StoryObj } from "@storybook/react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { useState } from "react";

const DialogTrigger = DialogPrimitive.Trigger;

const meta = {
  title: "UI/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a basic dialog with a title and description. Click the X or outside to close.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm">Dialog content goes here.</p>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

export const WithForm: Story = {
  render: () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>Edit Profile</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="John Doe"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
                placeholder="john@example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};

export const Confirmation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const InformationalDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Terms</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription>
            Please read our terms of service carefully.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <section>
            <h4 className="font-semibold mb-2">1. Acceptance of Terms</h4>
            <p className="text-muted-foreground">
              By accessing and using this service, you accept and agree to be bound by the terms
              and provision of this agreement.
            </p>
          </section>
          <section>
            <h4 className="font-semibold mb-2">2. Use License</h4>
            <p className="text-muted-foreground">
              Permission is granted to temporarily download one copy of the materials for personal,
              non-commercial transitory viewing only.
            </p>
          </section>
          <section>
            <h4 className="font-semibold mb-2">3. Disclaimer</h4>
            <p className="text-muted-foreground">
              The materials on this website are provided on an 'as is' basis. We make no warranties,
              expressed or implied, and hereby disclaim all other warranties.
            </p>
          </section>
        </div>
        <DialogFooter>
          <Button>I Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithScrollableContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View Details</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Long Content Dialog</DialogTitle>
          <DialogDescription>
            This dialog demonstrates scrollable content for longer forms or text.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[60vh] space-y-4 py-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="p-4 border rounded-md">
              <h4 className="font-semibold mb-2">Item {i + 1}</h4>
              <p className="text-sm text-muted-foreground">
                This is a placeholder item to demonstrate scrollable content in a dialog.
                The content scrolls while the header and footer remain fixed.
              </p>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
