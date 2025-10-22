/**
 * PaperTradarr Tab
 * Professional paper trading application with real-time data and visualization
 */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { Button } from "@/catalyst-ui/ui/button";
import { Input } from "@/catalyst-ui/ui/input";
import { Label } from "@/catalyst-ui/ui/label";
import { Badge } from "@/catalyst-ui/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/catalyst-ui/ui/table";
import { ScrollSnapItem } from "@/catalyst-ui/effects";
import { useToast } from "@/catalyst-ui/ui/use-toast";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Wallet,
  RefreshCw,
  Plus,
  Trash2,
} from "lucide-react";

import {
  usePortfolios,
  usePositions,
  useTransactions,
  usePortfolioActions,
  useStockQuote,
  useTrading,
} from "./hooks";
import { createPortfolioSummary, enrichPositionWithMetrics } from "./services";
import {
  CreatePortfolioDialog,
  StockSymbolAutocomplete,
  PortfolioChart,
  BulletGraph,
  PortfolioSelector,
} from "./components";
import type { StockQuote } from "./types";

export const TAB_ORDER = 101;
export const TAB_SECTION = "projects.misc";

export function PaperTradarrTab() {
  const { toast } = useToast();

  // Portfolio state
  const {
    data: portfolios,
    loading: portfoliosLoading,
    refetch: refetchPortfolios,
  } = usePortfolios();
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const { data: positions = [], refetch: refetchPositions } = usePositions(selectedPortfolioId);
  const { data: transactions = [], refetch: refetchTransactions } =
    useTransactions(selectedPortfolioId);
  const { createPortfolio, creating, deletePortfolio, deleting } = usePortfolioActions();

  // Trading state
  const [searchSymbol, setSearchSymbol] = useState("");
  const [selectedQuote, setSelectedQuote] = useState<StockQuote | null>(null);
  const [shareQuantity, setShareQuantity] = useState(1);
  const { executeBuy, executeSell, executing } = useTrading();

  // Select first portfolio by default
  useEffect(() => {
    if (portfolios && portfolios.length > 0 && !selectedPortfolioId) {
      setSelectedPortfolioId(portfolios[0].id);
    }
  }, [portfolios, selectedPortfolioId]);

  // Clear trading state when switching portfolios
  useEffect(() => {
    setSelectedQuote(null);
    setSearchSymbol("");
    setShareQuantity(1);
  }, [selectedPortfolioId]);

  // Calculate portfolio summary
  const portfolio = portfolios?.find(p => p.id === selectedPortfolioId);
  const summary = portfolio
    ? createPortfolioSummary(portfolio, positions || [], (transactions || []).length)
    : null;

  // Enrich positions with metrics
  const enrichedPositions = (positions || []).map(enrichPositionWithMetrics);

  // Handlers
  const handleCreatePortfolio = async (name: string, initialCash: number) => {
    try {
      const newPortfolio = await createPortfolio(name, initialCash);
      if (newPortfolio) {
        await refetchPortfolios();
        setSelectedPortfolioId(newPortfolio.id);
        toast({
          title: "Portfolio Created!",
          description: `${name} created with ${fmt(initialCash)} starting capital.`,
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create portfolio",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleSelectStock = async (symbol: string, quote: StockQuote | null) => {
    if (quote) {
      setSelectedQuote(quote);
    } else {
      // Fetch quote if not provided by autocomplete
      toast({
        title: "Fetching Quote",
        description: `Loading data for ${symbol}...`,
      });

      try {
        const { getQuote } = await import("./services/polygon");
        const fetchedQuote = await getQuote(symbol);

        setSelectedQuote(fetchedQuote);
        toast({
          title: "Quote Loaded",
          description: `${symbol} @ ${fmt(fetchedQuote.price)}`,
        });
      } catch (error) {
        console.error("Failed to fetch quote:", error);
        toast({
          title: "Error",
          description: "Failed to load stock data from Polygon.",
          variant: "destructive",
        });
      }
    }
  };

  const handleBuy = async () => {
    if (!portfolio || !selectedQuote || shareQuantity <= 0) return;

    const totalCost = selectedQuote.price * shareQuantity;
    if (totalCost > portfolio.currentCash) {
      toast({
        title: "Insufficient Funds",
        description: `You need ${fmt(totalCost)} but only have ${fmt(portfolio.currentCash)}.`,
        variant: "destructive",
      });
      return;
    }

    const result = await executeBuy({
      portfolioId: portfolio.id,
      symbol: selectedQuote.symbol,
      shares: shareQuantity,
      price: selectedQuote.price,
    });

    if (result.success) {
      toast({
        title: "Buy Order Executed!",
        description: `Bought ${shareQuantity} shares of ${selectedQuote.symbol} at ${fmt(selectedQuote.price)}`,
        variant: "default",
      });
      await Promise.all([refetchPortfolios(), refetchPositions(), refetchTransactions()]);
      setShareQuantity(1);
    } else {
      toast({
        title: "Buy Order Failed",
        description: result.error || "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleSell = async () => {
    if (!portfolio || !selectedQuote || shareQuantity <= 0) return;

    const position = (positions || []).find(p => p.symbol === selectedQuote.symbol);
    if (!position || position.shares < shareQuantity) {
      toast({
        title: "Insufficient Shares",
        description: `You need ${shareQuantity} shares but only have ${position?.shares || 0}.`,
        variant: "destructive",
      });
      return;
    }

    const result = await executeSell({
      portfolioId: portfolio.id,
      symbol: selectedQuote.symbol,
      shares: shareQuantity,
      price: selectedQuote.price,
    });

    if (result.success) {
      toast({
        title: "Sell Order Executed!",
        description: `Sold ${shareQuantity} shares of ${selectedQuote.symbol} at ${fmt(selectedQuote.price)}`,
        variant: "default",
      });
      await Promise.all([refetchPortfolios(), refetchPositions(), refetchTransactions()]);
      setShareQuantity(1);
      setSelectedQuote(null);
      setSearchSymbol("");
    } else {
      toast({
        title: "Sell Order Failed",
        description: result.error || "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async () => {
    await Promise.all([refetchPortfolios(), refetchPositions(), refetchTransactions()]);
    toast({
      title: "Refreshed",
      description: "Portfolio data updated.",
    });
  };

  const handleDeletePortfolio = async () => {
    if (!portfolio) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${portfolio.name}"? This will remove all positions and transaction history. This action cannot be undone.`
    );

    if (!confirmed) return;

    const result = await deletePortfolio(portfolio.id);

    if (result) {
      toast({
        title: "Portfolio Deleted",
        description: `${portfolio.name} has been removed.`,
      });
      await refetchPortfolios();
      setSelectedPortfolioId(null);
    } else {
      toast({
        title: "Deletion Failed",
        description: "Failed to delete portfolio.",
        variant: "destructive",
      });
    }
  };

  const handleQuickTrade = async (symbol: string, action: "buy" | "sell", shares: number) => {
    if (!portfolio) return;

    // Fetch current quote
    try {
      const { getQuote } = await import("./services/polygon");
      const quote = await getQuote(symbol);

      if (action === "buy") {
        const totalCost = quote.price * shares;
        if (totalCost > portfolio.currentCash) {
          toast({
            title: "Insufficient Funds",
            description: `You need ${fmt(totalCost)} but only have ${fmt(portfolio.currentCash)}.`,
            variant: "destructive",
          });
          return;
        }

        const result = await executeBuy({
          portfolioId: portfolio.id,
          symbol,
          shares,
          price: quote.price,
        });

        if (result.success) {
          toast({
            title: "Buy Order Executed!",
            description: `Bought ${shares} shares of ${symbol} at ${fmt(quote.price)}`,
          });
          await Promise.all([refetchPortfolios(), refetchPositions(), refetchTransactions()]);
        } else {
          toast({
            title: "Buy Order Failed",
            description: result.error || "Unknown error occurred",
            variant: "destructive",
          });
        }
      } else {
        const position = positions?.find(p => p.symbol === symbol);
        if (!position || position.shares < shares) {
          toast({
            title: "Insufficient Shares",
            description: `You need ${shares} shares but only have ${position?.shares || 0}.`,
            variant: "destructive",
          });
          return;
        }

        const result = await executeSell({
          portfolioId: portfolio.id,
          symbol,
          shares,
          price: quote.price,
        });

        if (result.success) {
          toast({
            title: "Sell Order Executed!",
            description: `Sold ${shares} shares of ${symbol} at ${fmt(quote.price)}`,
          });
          await Promise.all([refetchPortfolios(), refetchPositions(), refetchTransactions()]);
        } else {
          toast({
            title: "Sell Order Failed",
            description: result.error || "Unknown error occurred",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Quick trade failed:", error);
      toast({
        title: "Trade Failed",
        description: error instanceof Error ? error.message : "Failed to fetch quote from Polygon.",
        variant: "destructive",
      });
    }
  };

  // Format currency
  const fmt = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  if (portfoliosLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!portfolios || portfolios.length === 0) {
    return (
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to PaperTradarr</CardTitle>
            <CardDescription>Create your first portfolio to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <CreatePortfolioDialog
              onSubmit={handleCreatePortfolio}
              creating={creating}
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Portfolio
                </Button>
              }
            />
          </CardContent>
        </Card>
      </ScrollSnapItem>
    );
  }

  return (
    <div className="space-y-6 mt-0">
      {/* Portfolio Overview with Chart */}
      <ScrollSnapItem align="start">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Metrics Panel */}
          <Card>
            <CardHeader>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    <CardTitle>Portfolio</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <CreatePortfolioDialog onSubmit={handleCreatePortfolio} creating={creating} />
                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={deleting}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    {portfolio && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeletePortfolio}
                        disabled={deleting}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <PortfolioSelector
                  portfolios={portfolios || []}
                  selectedPortfolioId={selectedPortfolioId}
                  onSelect={setSelectedPortfolioId}
                />
              </div>
              <CardDescription>Paper trading performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {summary && (
                <>
                  {/* Key Metrics */}
                  <div className="space-y-4">
                    <div className="p-4 bg-accent/10 border border-primary/20 rounded">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <DollarSign className="h-4 w-4" />
                        Available Cash
                      </div>
                      <div className="text-3xl font-bold">{fmt(portfolio.currentCash)}</div>
                    </div>

                    <div className="p-4 bg-accent/10 border border-primary/20 rounded">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Activity className="h-4 w-4" />
                        Total Portfolio Value
                      </div>
                      <div className="text-3xl font-bold">{fmt(summary.totalValue)}</div>
                    </div>

                    <div className="p-4 bg-accent/10 border border-primary/20 rounded">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        {summary.totalGainLoss >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        Profit & Loss
                      </div>
                      <div
                        className={`text-3xl font-bold ${
                          summary.totalGainLoss >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {fmt(summary.totalGainLoss)}
                      </div>
                      <div
                        className={`text-lg ${
                          summary.totalGainLoss >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {summary.totalGainLoss >= 0 ? "+" : ""}
                        {summary.totalGainLossPercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  {/* Bullet Graphs for Performance Metrics */}
                  <div className="space-y-4">
                    <BulletGraph
                      label="Cash Utilization"
                      value={summary.totalValue - portfolio.currentCash}
                      target={portfolio.initialCash * 0.7}
                      max={portfolio.initialCash}
                      formatValue={fmt}
                      subtitle="Invested capital vs target"
                      variant="default"
                    />

                    <BulletGraph
                      label="Portfolio Growth"
                      value={summary.totalValue}
                      target={portfolio.initialCash * 1.1}
                      max={portfolio.initialCash * 1.5}
                      formatValue={fmt}
                      subtitle="Current value vs 10% growth target"
                      variant={
                        summary.totalValue >= portfolio.initialCash * 1.1
                          ? "success"
                          : summary.totalValue >= portfolio.initialCash
                            ? "warning"
                            : "danger"
                      }
                    />

                    <div className="text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Active Positions</span>
                        <span className="font-semibold">{summary.positionsCount}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Total Trades</span>
                        <span className="font-semibold">{summary.transactionsCount}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Performance Chart */}
          {portfolio && (
            <div className="lg:col-span-2">
              <PortfolioChart
                portfolio={portfolio}
                transactions={transactions || []}
                positions={positions || []}
              />
            </div>
          )}
        </div>
      </ScrollSnapItem>

      {/* Trading Interface */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>Trade</CardTitle>
            <CardDescription>Search for stocks and execute trades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Stock Search & Quote */}
              <div className="space-y-4">
                <StockSymbolAutocomplete
                  value={searchSymbol}
                  onChange={setSearchSymbol}
                  onSelect={handleSelectStock}
                  disabled={executing}
                />

                {selectedQuote && (
                  <Card className="bg-accent/5">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-2xl font-bold">{selectedQuote.symbol}</div>
                        <Badge variant={selectedQuote.change >= 0 ? "default" : "destructive"}>
                          {selectedQuote.change >= 0 ? "+" : ""}
                          {selectedQuote.changePercent.toFixed(2)}%
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Price</div>
                          <div className="text-2xl font-semibold">{fmt(selectedQuote.price)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Change</div>
                          <div
                            className={`text-2xl font-semibold ${
                              selectedQuote.change >= 0 ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {selectedQuote.change >= 0 ? "+" : ""}
                            {fmt(selectedQuote.change)}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">High</div>
                          <div className="font-medium">{fmt(selectedQuote.high)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Low</div>
                          <div className="font-medium">{fmt(selectedQuote.low)}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Order Entry */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Shares</Label>
                  <Input
                    type="number"
                    min="1"
                    value={shareQuantity}
                    onChange={e => setShareQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    disabled={!selectedQuote || executing}
                  />
                </div>

                {selectedQuote && (
                  <Card className="bg-accent/5">
                    <CardContent className="p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Order Total</span>
                        <span className="font-semibold">
                          {fmt(selectedQuote.price * shareQuantity)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Available Cash</span>
                        <span className="font-semibold">{fmt(portfolio?.currentCash || 0)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-muted-foreground">After Buy</span>
                        <span className="font-semibold">
                          {fmt((portfolio?.currentCash || 0) - selectedQuote.price * shareQuantity)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={handleBuy}
                    disabled={
                      !selectedQuote ||
                      !portfolio ||
                      executing ||
                      selectedQuote.price * shareQuantity > portfolio.currentCash
                    }
                  >
                    {executing ? "Executing..." : "Buy"}
                  </Button>
                  <Button
                    className="flex-1"
                    variant="destructive"
                    onClick={handleSell}
                    disabled={!selectedQuote || !portfolio || executing}
                  >
                    {executing ? "Executing..." : "Sell"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollSnapItem>

      {/* Positions Table */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>Positions</CardTitle>
            <CardDescription>Current holdings and performance</CardDescription>
          </CardHeader>
          <CardContent>
            {enrichedPositions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No positions. Start trading to build your portfolio!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead className="text-right">Shares</TableHead>
                    <TableHead className="text-right">Avg Price</TableHead>
                    <TableHead className="text-right">Current</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead className="text-right">P&L</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrichedPositions.map(pos => (
                    <TableRow key={pos.id}>
                      <TableCell className="font-semibold">{pos.symbol}</TableCell>
                      <TableCell className="text-right">{pos.shares}</TableCell>
                      <TableCell className="text-right">{fmt(pos.avgPrice)}</TableCell>
                      <TableCell className="text-right">{fmt(pos.currentPrice)}</TableCell>
                      <TableCell className="text-right">{fmt(pos.totalValue)}</TableCell>
                      <TableCell
                        className={`text-right font-semibold ${
                          pos.gainLoss >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {fmt(pos.gainLoss)} ({pos.gainLossPercent.toFixed(2)}%)
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuickTrade(pos.symbol, "buy", 1)}
                            disabled={executing || deleting}
                          >
                            Buy +1
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleQuickTrade(pos.symbol, "sell", pos.shares)}
                            disabled={executing || deleting}
                          >
                            Sell All
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </ScrollSnapItem>
    </div>
  );
}
