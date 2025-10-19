/**
 * Observability Dashboard Tab
 * Comprehensive analytics and monitoring dashboard
 */

import { useState, useEffect } from "react";
import { useAnalytics } from "@/catalyst-ui/contexts/Analytics";
import { Card } from "@/catalyst-ui/ui/card";
import { Button } from "@/catalyst-ui/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/catalyst-ui/ui/tabs";
import { ScrollArea } from "@/catalyst-ui/ui/scroll-area";
import {
  Activity,
  AlertCircle,
  Clock,
  Download,
  Eye,
  TrendingUp,
  Zap,
  RefreshCw,
  Trash2,
} from "lucide-react";

export function ObservabilityTab() {
  const analytics = useAnalytics();
  const [events, setEvents] = useState(analytics.getEvents());
  const [errors, setErrors] = useState(analytics.getErrors());
  const [metrics, setMetrics] = useState(analytics.getMetrics());
  const [session, setSession] = useState(analytics.getSession());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh data every 2 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setEvents(analytics.getEvents());
      setErrors(analytics.getErrors());
      setMetrics(analytics.getMetrics());
      setSession(analytics.getSession());
    }, 2000);

    return () => clearInterval(interval);
  }, [analytics, autoRefresh]);

  const handleRefresh = () => {
    setEvents(analytics.getEvents());
    setErrors(analytics.getErrors());
    setMetrics(analytics.getMetrics());
    setSession(analytics.getSession());
  };

  const handleExport = () => {
    const data = analytics.exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all analytics data?")) {
      analytics.clearData();
      handleRefresh();
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(2)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  // Calculate stats
  const totalEvents = events.length;
  const totalErrors = errors.length;
  const goodMetrics = metrics.filter(m => m.rating === "good").length;
  const poorMetrics = metrics.filter(m => m.rating === "poor").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Observability Dashboard</h1>
          <p className="text-muted-foreground">Real-time analytics, monitoring, and reporting</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? "text-green-500" : ""}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`} />
            {autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="destructive" size="sm" onClick={handleClearData}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Events</p>
              <p className="text-3xl font-bold">{totalEvents}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Errors</p>
              <p className="text-3xl font-bold">{totalErrors}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Performance Metrics</p>
              <p className="text-3xl font-bold">{metrics.length}</p>
              <p className="text-xs text-muted-foreground">
                {goodMetrics} good / {poorMetrics} poor
              </p>
            </div>
            <Zap className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Session Duration</p>
              <p className="text-3xl font-bold">
                {session ? formatDuration(Date.now() - session.startTime) : "N/A"}
              </p>
              <p className="text-xs text-muted-foreground">{session?.pageViews || 0} page views</p>
            </div>
            <Clock className="h-8 w-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="journey">User Journey</TabsTrigger>
          <TabsTrigger value="session">Session</TabsTrigger>
        </TabsList>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Event Log ({events.length})
            </h2>
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {events.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No events tracked yet</p>
                ) : (
                  events
                    .slice()
                    .reverse()
                    .map((event, idx) => (
                      <div key={idx} className="p-4 bg-muted rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">{event.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatTimestamp(event.timestamp)}
                            </p>
                          </div>
                          {event.category && (
                            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                              {event.category}
                            </span>
                          )}
                        </div>
                        {event.params && Object.keys(event.params).length > 0 && (
                          <details className="mt-2">
                            <summary className="text-sm cursor-pointer text-muted-foreground hover:text-foreground">
                              Parameters
                            </summary>
                            <pre className="mt-2 text-xs bg-background p-2 rounded overflow-auto">
                              {JSON.stringify(event.params, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))
                )}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        {/* Errors Tab */}
        <TabsContent value="errors" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Error Log ({errors.length})
            </h2>
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {errors.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No errors tracked (that's good!)
                  </p>
                ) : (
                  errors
                    .slice()
                    .reverse()
                    .map((error, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-red-500">{error.message}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatTimestamp(error.timestamp)}
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-red-500 text-white text-xs rounded">
                            {error.type}
                          </span>
                        </div>
                        {error.stack && (
                          <details className="mt-2">
                            <summary className="text-sm cursor-pointer text-muted-foreground hover:text-foreground">
                              Stack Trace
                            </summary>
                            <pre className="mt-2 text-xs bg-background p-2 rounded overflow-auto max-h-40">
                              {error.stack}
                            </pre>
                          </details>
                        )}
                        {error.componentStack && (
                          <details className="mt-2">
                            <summary className="text-sm cursor-pointer text-muted-foreground hover:text-foreground">
                              Component Stack
                            </summary>
                            <pre className="mt-2 text-xs bg-background p-2 rounded overflow-auto max-h-40">
                              {error.componentStack}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))
                )}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Performance Metrics ({metrics.length})
            </h2>
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {metrics.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No performance metrics tracked yet
                  </p>
                ) : (
                  metrics
                    .slice()
                    .reverse()
                    .map((metric, idx) => (
                      <div key={idx} className="p-4 bg-muted rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold">{metric.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatTimestamp(metric.timestamp)}
                            </p>
                            <p className="text-2xl font-bold mt-2">
                              {formatDuration(metric.value)}
                            </p>
                          </div>
                          {metric.rating && (
                            <span
                              className={`px-2 py-1 text-xs rounded ${
                                metric.rating === "good"
                                  ? "bg-green-500 text-white"
                                  : metric.rating === "needs-improvement"
                                    ? "bg-yellow-500 text-white"
                                    : "bg-red-500 text-white"
                              }`}
                            >
                              {metric.rating}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        {/* User Journey Tab */}
        <TabsContent value="journey" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              User Journey ({session?.journey.length || 0} steps)
            </h2>
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {!session || session.journey.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No user journey tracked yet. Enable user journey tracking in analytics config.
                  </p>
                ) : (
                  session.journey
                    .slice()
                    .reverse()
                    .map((step, idx) => (
                      <div key={idx} className="p-4 bg-muted rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">{step.target}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatTimestamp(step.timestamp)}
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                            {step.type}
                          </span>
                        </div>
                        {step.data && Object.keys(step.data).length > 0 && (
                          <details className="mt-2">
                            <summary className="text-sm cursor-pointer text-muted-foreground hover:text-foreground">
                              Details
                            </summary>
                            <pre className="mt-2 text-xs bg-background p-2 rounded overflow-auto">
                              {JSON.stringify(step.data, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))
                )}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        {/* Session Tab */}
        <TabsContent value="session" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Session Information
            </h2>
            {session ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Session ID</p>
                    <p className="font-mono text-sm">{session.sessionId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Start Time</p>
                    <p className="text-sm">{formatTimestamp(session.startTime)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Activity</p>
                    <p className="text-sm">{formatTimestamp(session.lastActivity)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="text-sm">{formatDuration(Date.now() - session.startTime)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Page Views</p>
                    <p className="text-2xl font-bold">{session.pageViews}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Events</p>
                    <p className="text-2xl font-bold">{session.eventCount}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No active session</p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
