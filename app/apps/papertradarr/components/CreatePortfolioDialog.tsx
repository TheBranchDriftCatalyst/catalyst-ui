/**
 * CreatePortfolioDialog Component
 * Professional dialog for creating new portfolios
 */

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/catalyst-ui/ui/dialog";
import { Button } from "@/catalyst-ui/ui/button";
import { Input } from "@/catalyst-ui/ui/input";
import { Label } from "@/catalyst-ui/ui/label";
import { Plus } from "lucide-react";

interface CreatePortfolioDialogProps {
  onSubmit: (name: string, initialCash: number) => Promise<void>;
  creating: boolean;
  trigger?: React.ReactNode;
}

export function CreatePortfolioDialog({ onSubmit, creating, trigger }: CreatePortfolioDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("My Portfolio");
  const [initialCash, setInitialCash] = useState("100000");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cash = parseFloat(initialCash);
    if (isNaN(cash) || cash <= 0) {
      setError("Initial cash must be a positive number");
      return;
    }

    if (!name.trim()) {
      setError("Portfolio name is required");
      return;
    }

    try {
      await onSubmit(name.trim(), cash);
      setOpen(false);
      setName("My Portfolio");
      setInitialCash("100000");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create portfolio");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Portfolio</DialogTitle>
          <DialogDescription>
            Set up a new paper trading portfolio with starting cash balance.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Portfolio Name</Label>
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g., Growth Portfolio"
                disabled={creating}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cash">Initial Cash (USD)</Label>
              <Input
                id="cash"
                type="number"
                step="0.01"
                min="0"
                value={initialCash}
                onChange={e => setInitialCash(e.target.value)}
                placeholder="100000"
                disabled={creating}
              />
            </div>
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                {error}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={creating}>
              {creating ? "Creating..." : "Create Portfolio"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
