/**
 * Analytics data persistence layer
 * Stores analytics data in localStorage with rotation
 */

import type {
  AnalyticsEvent,
  ErrorEvent,
  PerformanceMetric,
  SessionInfo,
  UserJourneyStep,
} from "./types";

const STORAGE_PREFIX = "catalyst-analytics";
const MAX_EVENTS = 1000;
const MAX_ERRORS = 100;
const MAX_METRICS = 500;
const MAX_JOURNEY_STEPS = 500;

interface StorageData {
  events: AnalyticsEvent[];
  errors: ErrorEvent[];
  metrics: PerformanceMetric[];
  session: SessionInfo | null;
}

export class AnalyticsStorage {
  private getKey(key: string): string {
    return `${STORAGE_PREFIX}:${key}`;
  }

  private get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(this.getKey(key));
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private set(key: string, value: any): void {
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(value));
    } catch (error) {
      // localStorage might be full or disabled
      console.warn("Failed to store analytics data:", error);
    }
  }

  getEvents(): AnalyticsEvent[] {
    return this.get<AnalyticsEvent[]>("events", []);
  }

  addEvent(event: AnalyticsEvent): void {
    const events = this.getEvents();
    events.push(event);

    // Rotate if too many events
    if (events.length > MAX_EVENTS) {
      events.splice(0, events.length - MAX_EVENTS);
    }

    this.set("events", events);
  }

  getErrors(): ErrorEvent[] {
    return this.get<ErrorEvent[]>("errors", []);
  }

  addError(error: ErrorEvent): void {
    const errors = this.getErrors();
    errors.push(error);

    // Rotate if too many errors
    if (errors.length > MAX_ERRORS) {
      errors.splice(0, errors.length - MAX_ERRORS);
    }

    this.set("errors", errors);
  }

  getMetrics(): PerformanceMetric[] {
    return this.get<PerformanceMetric[]>("metrics", []);
  }

  addMetric(metric: PerformanceMetric): void {
    const metrics = this.getMetrics();
    metrics.push(metric);

    // Rotate if too many metrics
    if (metrics.length > MAX_METRICS) {
      metrics.splice(0, metrics.length - MAX_METRICS);
    }

    this.set("metrics", metrics);
  }

  getSession(): SessionInfo | null {
    return this.get<SessionInfo | null>("session", null);
  }

  setSession(session: SessionInfo): void {
    this.set("session", session);
  }

  updateSession(updates: Partial<SessionInfo>): void {
    const session = this.getSession();
    if (session) {
      this.setSession({ ...session, ...updates });
    }
  }

  addJourneyStep(step: UserJourneyStep): void {
    const session = this.getSession();
    if (!session) return;

    session.journey.push(step);

    // Rotate if too many steps
    if (session.journey.length > MAX_JOURNEY_STEPS) {
      session.journey.splice(0, session.journey.length - MAX_JOURNEY_STEPS);
    }

    this.setSession(session);
  }

  clear(): void {
    localStorage.removeItem(this.getKey("events"));
    localStorage.removeItem(this.getKey("errors"));
    localStorage.removeItem(this.getKey("metrics"));
    localStorage.removeItem(this.getKey("session"));
  }

  exportData(): StorageData {
    return {
      events: this.getEvents(),
      errors: this.getErrors(),
      metrics: this.getMetrics(),
      session: this.getSession(),
    };
  }
}

export const storage = new AnalyticsStorage();
