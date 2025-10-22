/**
 * PortfolioSelector Component
 * Dropdown to switch between portfolios
 */

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/catalyst-ui/ui/select";
import { Badge } from "@/catalyst-ui/ui/badge";
import type { Portfolio } from "../types";

interface PortfolioSelectorProps {
  portfolios: Portfolio[];
  selectedPortfolioId: string | null;
  onSelect: (portfolioId: string) => void;
  disabled?: boolean;
}

export function PortfolioSelector({
  portfolios,
  selectedPortfolioId,
  onSelect,
  disabled = false,
}: PortfolioSelectorProps) {
  const fmt = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  return (
    <Select value={selectedPortfolioId || ""} onValueChange={onSelect} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select portfolio..." />
      </SelectTrigger>
      <SelectContent>
        {portfolios.map(portfolio => (
          <SelectItem key={portfolio.id} value={portfolio.id}>
            <div className="flex items-center justify-between gap-4 min-w-[200px]">
              <span className="font-medium">{portfolio.name}</span>
              <Badge variant="outline" className="text-xs">
                {fmt(portfolio.currentCash)}
              </Badge>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
