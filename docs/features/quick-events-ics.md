# Quick Tasks (Todo List) Component

A React component for managing tasks/todos with reminders, built on ICS VTODO standard for full calendar interoperability.

## Implementation Status

- [ ] TypeScript DTOs defined (VTODO-based)
- [ ] Core UI components (todo list)
- [ ] Storybook stories
- [ ] Demo page with mock data
- [ ] ICS export/import utilities (VTODO support)
- [ ] Backend integration

## Problem Statement

Need a lightweight, efficient todo list UI with reminder support that:
- Uses **ICS VTODO** standard (RFC 5545) for tasks/todos
- Works with any ICS-compliant backend (ActiveCalendar, ical.js, etc.)
- Provides quick task creation with minimal friction
- Displays tasks with priorities, due dates, and reminders
- Shares component architecture with future calendar view (VEVENT)

## Design Philosophy: ICS VTODO as Contract

Rather than tightly coupling to a specific backend, we use **ICS VTODO (tasks)** as the universal interface contract:

```
┌────────────────────────────────────────────┐
│  React UI Component                        │
│  ├─ QuickTasksList (VTODO → Todo UI)      │
│  └─ CalendarView (VEVENT → Calendar UI)   │
│     (same component, different visuals)    │
└─────────────────┬──────────────────────────┘
                  │
                  ↓ ICS-compliant JSON
┌────────────────────────────────────────────┐
│  ICS Layer (RFC 5545 Contract)             │
│  VTODO | VEVENT | VALARM | RRULE           │
└─────────────────┬──────────────────────────┘
                  │
        ┌─────────┴─────────┬────────┐
        ↓                   ↓        ↓
  ActiveCalendar      ical.js   Google Tasks
  (Python)            (JS)      (API)
```

**Architecture Strategy:**
- 🎯 **Phase 1 (Now)**: VTODO-based todo list UI
- 📅 **Phase 2 (Later)**: VEVENT-based calendar view
- 🔄 **Shared Core**: Same component, different visual modes

**Benefits:**
- ✅ Backend-agnostic architecture
- ✅ Standard ICS import/export
- ✅ Todo list AND calendar with one component
- ✅ Interoperability with Google Tasks, Apple Reminders, etc.

## ICS Component Mapping

### VTODO (Task/Todo) - PRIMARY FOCUS

Our `Task` DTO maps directly to ICS VTODO:

| DTO Field | ICS Component | Format |
|-----------|---------------|--------|
| `id` | `UID` | UUID string |
| `title` | `SUMMARY` | 1-1024 chars |
| `description` | `DESCRIPTION` | max 8192 chars |
| `due_date` | `DUE` | ISO 8601 datetime |
| `priority` | `PRIORITY` | 0-9 (0=undefined, 1=high, 9=low) |
| `status` | `STATUS` | `NEEDS-ACTION`, `IN-PROCESS`, `COMPLETED`, `CANCELLED` |
| `completed_at` | `COMPLETED` | ISO 8601 datetime |
| `percent_complete` | `PERCENT-COMPLETE` | 0-100 |
| `reminders[]` | `VALARM` | One per reminder |
| `recurrence` | `RRULE` | RFC 5545 recurrence |
| `created` | `CREATED` | ISO 8601 datetime |
| `updated` | `LAST-MODIFIED` | ISO 8601 datetime |

### VEVENT (Calendar Event) - FUTURE PHASE

(Calendar view will use same component architecture, different DTO):

| DTO Field | ICS Component | Format |
|-----------|---------------|--------|
| `id` | `UID` | UUID string |
| `title` | `SUMMARY` | 1-1024 chars |
| `start_time` | `DTSTART` | ISO 8601 datetime |
| `end_time` | `DTEND` | ISO 8601 datetime |
| `location` | `LOCATION` | max 1024 chars |
| `attendees[]` | `ATTENDEE` | One per attendee |
| `reminders[]` | `VALARM` | One per reminder |

### VALARM (Reminder)

Our `Reminder` DTO maps to ICS VALARM:

| DTO Field | ICS Component | Values |
|-----------|---------------|--------|
| `method` | `ACTION` | `DISPLAY` (popup) or `EMAIL` |
| `minutes` | `TRIGGER` | `-PT{minutes}M` (e.g., `-PT15M`) |

**Example ICS Output:**
```ics
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER:-PT15M
END:VALARM
```

### ATTENDEE

Our `Attendee` DTO maps to ICS ATTENDEE:

| DTO Field | ICS Parameter | Values |
|-----------|---------------|--------|
| `email` | `MAILTO:` | Email address |
| `display_name` | `CN=` | Display name |
| `response_status` | `PARTSTAT=` | `NEEDS-ACTION`, `ACCEPTED`, `DECLINED`, `TENTATIVE` |
| `organizer` | `ROLE=` | `CHAIR` (true) or `REQ-PARTICIPANT` (false) |
| `optional` | `ROLE=` | `OPT-PARTICIPANT` (true) |

## TypeScript DTOs

### Core Models (VTODO-based)

```typescript
// lib/components/QuickTasksList/types.ts

/**
 * Reminder DTO - Maps to ICS VALARM component
 * @see RFC 5545 Section 3.6.6
 */
export interface Reminder {
  method: "email" | "popup"; // ACTION: EMAIL or DISPLAY
  minutes: number;            // TRIGGER: -PT{minutes}M (≥0)
}

/**
 * Recurrence DTO - Maps to ICS RRULE property
 * @see RFC 5545 Section 3.8.5.3
 */
export interface Recurrence {
  freq: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY"; // FREQ=
  interval: number;           // INTERVAL=
  count?: number;             // COUNT=
  until?: Date;               // UNTIL=
  by_day?: string[];          // BYDAY= (e.g., ["MO", "WE", "FR"])
  by_month_day?: number[];    // BYMONTHDAY=
}

/**
 * Task DTO - Maps to ICS VTODO component
 * @see RFC 5545 Section 3.6.2
 */
export interface Task {
  // Core VTODO properties
  id?: string;                // UID
  title: string;              // SUMMARY (1-1024 chars, required)
  description?: string;       // DESCRIPTION (max 8192 chars)
  due_date?: Date;            // DUE (optional due date/time)
  priority: number;           // PRIORITY (0=undefined, 1=highest, 9=lowest)
  status:                     // STATUS
    | "NEEDS-ACTION"
    | "IN-PROCESS"
    | "COMPLETED"
    | "CANCELLED";
  completed_at?: Date;        // COMPLETED (datetime when completed)
  percent_complete: number;   // PERCENT-COMPLETE (0-100)

  // Related components
  reminders: Reminder[];      // VALARM (multiple reminders)
  recurrence?: Recurrence;    // RRULE (recurring tasks)

  // Metadata
  calendar_id?: string;       // X-CALENDAR-ID (custom property)
  created?: Date;             // CREATED
  updated?: Date;             // LAST-MODIFIED

  // Extension point for backend-specific data
  ics_data?: Record<string, any>; // Store raw ICS properties
}

/**
 * Calendar Event DTO - Maps to ICS VEVENT component (FUTURE PHASE)
 * @see RFC 5545 Section 3.6.1
 */
export interface CalendarEvent {
  id?: string;                // UID
  title: string;              // SUMMARY
  description?: string;       // DESCRIPTION
  location?: string;          // LOCATION
  start_time: Date;           // DTSTART
  end_time: Date;             // DTEND
  all_day: boolean;           // DTSTART;VALUE=DATE
  reminders: Reminder[];      // VALARM
  recurrence?: Recurrence;    // RRULE
  created?: Date;             // CREATED
  updated?: Date;             // LAST-MODIFIED
}
```

### UI-Specific DTOs

```typescript
/**
 * Quick Task Input - Simplified form for rapid task creation
 */
export interface QuickTaskInput {
  title: string;
  due_date?: Date;            // Optional due date
  priority?: number;          // Quick priority: 1 (high), 5 (medium), 9 (low)
  reminder_minutes?: number;  // Quick reminder preset
  reminder_method?: "email" | "popup";
}

/**
 * Task Group - UI organization by status/priority
 */
export interface TaskGroup {
  label: "High Priority" | "Today" | "Upcoming" | "Someday" | "Completed";
  tasks: Task[];
}

/**
 * Component Props
 */
export interface QuickTasksListProps {
  tasks: Task[];
  onAddTask: (task: QuickTaskInput) => Promise<void>;
  onEditTask: (id: string, updates: Partial<Task>) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  onToggleComplete: (id: string) => Promise<void>;
  onAddReminder: (taskId: string, reminder: Reminder) => Promise<void>;
  onRemoveReminder: (taskId: string, reminderIndex: number) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}
```

### Zod Schemas for Validation

```typescript
import { z } from "zod";

export const ReminderSchema = z.object({
  method: z.enum(["email", "popup"]),
  minutes: z.number().min(0),
});

export const TaskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1).max(1024),
  description: z.string().max(8192).optional(),
  due_date: z.date().optional(),
  priority: z.number().min(0).max(9).default(0), // 0=undefined, 1=high, 9=low
  status: z.enum(["NEEDS-ACTION", "IN-PROCESS", "COMPLETED", "CANCELLED"]).default("NEEDS-ACTION"),
  completed_at: z.date().optional(),
  percent_complete: z.number().min(0).max(100).default(0),
  reminders: z.array(ReminderSchema).default([]),
  recurrence: z.object({
    freq: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
    interval: z.number().min(1).default(1),
    count: z.number().min(1).optional(),
    until: z.date().optional(),
    by_day: z.array(z.string()).optional(),
    by_month_day: z.array(z.number()).optional(),
  }).optional(),
  calendar_id: z.string().optional(),
  created: z.date().optional(),
  updated: z.date().optional(),
  ics_data: z.record(z.any()).optional(),
});

export const QuickTaskInputSchema = z.object({
  title: z.string().min(1).max(1024),
  due_date: z.date().optional(),
  priority: z.number().min(0).max(9).optional(),
  reminder_minutes: z.number().min(0).optional(),
  reminder_method: z.enum(["email", "popup"]).optional(),
});
```

## Component Architecture

### File Structure

```
lib/components/QuickTasksList/
├── types.ts                    # VTODO DTOs, Zod schemas, ICS mappings
├── QuickTasksList.tsx          # Main card container (todo list)
├── TaskListItem.tsx            # Single task display with checkbox
├── QuickAddTask.tsx            # Quick add form
├── ReminderBadge.tsx           # Reminder display component
├── PriorityBadge.tsx           # Priority indicator (high/medium/low)
├── utils/                      # Utilities
│   ├── ics-converter.ts        # DTO ↔ ICS VTODO conversion
│   ├── task-grouping.ts        # Group tasks by priority/due date
│   └── reminder-formatter.ts   # Format reminder display
└── QuickTasksList.stories.tsx  # Storybook documentation

app/demos/
└── QuickTasksDemo.tsx          # Demo with mock VTODO data
```

### Component Hierarchy

```
QuickTasksList
├── Header
│   ├── Title: "Tasks"
│   ├── FilterButtons (All / Active / Completed)
│   └── AddButton (expand QuickAddTask)
│
├── QuickAddTask (collapsible form)
│   ├── Input (title)
│   ├── DatePicker (due_date - optional)
│   ├── Select (priority: high, medium, low, none)
│   ├── Select (reminder: none, 5m, 15m, 30m, 1h, 1d)
│   └── Button (submit)
│
└── TaskList
    ├── TaskGroup ("High Priority")
    │   └── TaskListItem[]
    ├── TaskGroup ("Today")
    │   └── TaskListItem[]
    ├── TaskGroup ("Upcoming")
    │   └── TaskListItem[]
    ├── TaskGroup ("Someday")
    │   └── TaskListItem[]
    ├── Separator
    └── TaskGroup ("Completed")
        └── TaskListItem[] (strikethrough, faded)

TaskListItem
├── Checkbox (toggle complete)
├── TaskInfo
│   ├── Title (strikethrough if completed)
│   ├── DueDate (with Calendar icon)
│   ├── PriorityBadge (high=red, medium=yellow, low=blue)
│   └── ReminderBadge[] (method + timing)
└── QuickActions
    ├── EditButton
    └── DeleteButton
```

## UI Design

### Task List Item Layout

**Active Task:**
```
┌─────────────────────────────────────────────────────────────┐
│ [ ] Finish project documentation                [Edit] [×]  │
│     📅 Due Oct 10 | 🔴 High Priority                        │
│     🔔 1h popup                                              │
└─────────────────────────────────────────────────────────────┘
```

**Completed Task:**
```
┌─────────────────────────────────────────────────────────────┐
│ [✓] Review pull requests                        [Edit] [×]  │
│     📅 Completed Oct 6                                       │
└─────────────────────────────────────────────────────────────┘
```

### Quick Add Form (Collapsed/Expanded)

```
Collapsed:
┌─────────────────────────────────────────────────────────────┐
│ + Quick Add Task                                            │
└─────────────────────────────────────────────────────────────┘

Expanded:
┌─────────────────────────────────────────────────────────────┐
│ Quick Add Task                                          [×]  │
├─────────────────────────────────────────────────────────────┤
│ Title                                                        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Call client about proposal...                          │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ Due Date (Optional)     Priority                             │
│ [Oct 10, 2025 ▼]        [High ▼]                           │
│                                                              │
│ Reminder                                                     │
│ [1 hour before ▼]       [Popup ▼]                          │
│                                                              │
│                                    [Cancel] [Add Task]       │
└─────────────────────────────────────────────────────────────┘
```

### Priority Badges

- 🔴 **High Priority** (priority: 1) - Red badge
- 🟡 **Medium Priority** (priority: 5) - Yellow badge
- 🔵 **Low Priority** (priority: 9) - Blue badge
- ⚪ **No Priority** (priority: 0) - No badge shown

### Icons (lucide-react)

- `Bell` - Popup reminders (🔔)
- `Mail` - Email reminders (📧)
- `Calendar` - Due date (📅)
- `Circle` - Unchecked checkbox (⭕)
- `CheckCircle2` - Checked checkbox (✅)
- `AlertCircle` - High priority
- `Plus` - Add action
- `Pencil` - Edit action
- `Trash2` - Delete action
- `ChevronDown` - Expand/collapse
- `X` - Close/dismiss
- `Filter` - Filter tasks

## Implementation Plan

### Phase 1: Core DTOs and Utilities

**Files:**
- `lib/components/QuickEventsCard/types.ts`
- `lib/components/QuickEventsCard/utils/ics-converter.ts`
- `lib/components/QuickEventsCard/utils/date-grouping.ts`
- `lib/components/QuickEventsCard/utils/reminder-formatter.ts`

**Tasks:**
1. Define TypeScript interfaces matching ICS spec
2. Create Zod validation schemas
3. Build DTO ↔ ICS conversion utilities
4. Implement date grouping logic (Today, Tomorrow, etc.)
5. Create reminder display formatters

### Phase 2: UI Components

**Files:**
- `lib/components/QuickEventsCard/QuickEventsCard.tsx`
- `lib/components/QuickEventsCard/EventListItem.tsx`
- `lib/components/QuickEventsCard/QuickAddEvent.tsx`
- `lib/components/QuickEventsCard/ReminderBadge.tsx`

**Tasks:**
1. Build QuickEventsCard container with Card component
2. Create EventListItem with time, title, location, reminders
3. Build QuickAddEvent form with react-hook-form + zod
4. Create ReminderBadge component for visual display
5. Implement quick actions (edit, delete)
6. Add empty state component

### Phase 3: Mock Data and Demo

**Files:**
- `app/demos/QuickEventsDemo.tsx`
- `lib/components/QuickEventsCard/mock-data.ts`

**Tasks:**
1. Create realistic mock data in ICS-compliant format
2. Build interactive demo with CRUD operations
3. Demonstrate various states (loading, error, empty)
4. Show events with multiple reminders
5. Include all-day events

### Phase 4: Storybook Stories

**Files:**
- `lib/components/QuickEventsCard/QuickEventsCard.stories.tsx`

**Stories:**
- Default: Upcoming events with reminders
- Empty: No events state
- Loading: Loading skeleton
- Error: Error state
- Multiple Reminders: Event with 3+ reminders
- All-Day Events: Full-day events display
- Recurring: Events with recurrence rules

### Phase 5: ICS Integration (VTODO)

**Files:**
- `lib/components/QuickTasksList/utils/ics-parser.ts`
- `lib/components/QuickTasksList/utils/ics-generator.ts`

**Tasks:**
1. Add ICS VTODO parsing (consider `ical.js` library)
2. Add ICS VTODO generation from Task DTOs
3. Support import/export functionality (.ics files)
4. Add tests for ICS round-trip conversion
5. Handle VALARM on VTODO components

### Phase 6: Calendar View Component (VEVENT)

**Scope:** Separate visual mode using same component architecture

**Files:**
- `lib/components/CalendarView/types.ts` (VEVENT DTOs)
- `lib/components/CalendarView/CalendarView.tsx` (calendar UI)
- `lib/components/CalendarView/EventCard.tsx` (event display)
- `lib/components/CalendarView/utils/ics-converter.ts` (VEVENT ↔ ICS)
- `lib/components/CalendarView/CalendarView.stories.tsx`

**Tasks:**
1. Define VEVENT-based DTOs (CalendarEvent with start_time, end_time, location, attendees)
2. Build calendar grid/list view component
3. Implement ICS VEVENT parsing and generation
4. Add event creation with time slots
5. Support attendee management
6. Handle recurring events (RRULE)
7. Create Storybook stories for calendar view

**UI Differences from Todo List:**
- Grid/week/month calendar views vs. simple list
- Time slots and duration display vs. checkbox completion
- Location and attendee fields vs. priority
- All-day event support
- Conflict detection visualization

**Shared Architecture:**
- Same Reminder DTO and components
- Same Recurrence DTO and logic
- Shared ICS utilities (VALARM, RRULE)
- Same form patterns (react-hook-form + zod)

### Phase 7: Google Calendar API Integration

**Scope:** Fetch and sync data from Google Calendar and Google Tasks APIs

**Files:**
- `lib/services/google-calendar/auth.ts` (OAuth 2.0 authentication)
- `lib/services/google-calendar/calendar-api.ts` (VEVENT fetching)
- `lib/services/google-calendar/tasks-api.ts` (VTODO fetching via Google Tasks)
- `lib/services/google-calendar/sync-engine.ts` (Real-time sync)
- `lib/services/google-calendar/transformers.ts` (Google API ↔ ICS DTO)
- `lib/services/google-calendar/cache.ts` (Client-side caching)

**APIs to Integrate:**

1. **Google Calendar API v3** (for VEVENT - calendar events)
   - Endpoint: `https://www.googleapis.com/calendar/v3/calendars/primary/events`
   - Fetches calendar events with attendees, reminders, recurrence
   - Supports real-time updates via webhooks/polling

2. **Google Tasks API v1** (for VTODO - tasks)
   - Endpoint: `https://tasks.googleapis.com/tasks/v1/lists/{taskListId}/tasks`
   - Fetches tasks with due dates, status, notes
   - Note: Google Tasks has limited support compared to full VTODO spec

**Authentication Flow:**
```typescript
// OAuth 2.0 with Google Identity Services
// Uses @react-oauth/google library

import { useGoogleLogin } from '@react-oauth/google';

const login = useGoogleLogin({
  scope: [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/tasks.readonly',
  ].join(' '),
  onSuccess: (tokenResponse) => {
    // Store access token
    localStorage.setItem('google_access_token', tokenResponse.access_token);
  },
});
```

**Data Fetching Strategy:**

1. **Initial Load:**
   - Fetch last 90 days of events/tasks
   - Transform to ICS DTOs
   - Store in local state/cache

2. **Real-time Sync:**
   - Option A: Polling (every 5 minutes)
   - Option B: WebSocket via backend proxy
   - Option C: Google Calendar Push Notifications (requires backend)

3. **Caching:**
   - IndexedDB for offline support
   - Service Worker for background sync
   - Optimistic updates for perceived performance

**Google Calendar Event → CalendarEvent DTO:**
```typescript
// lib/services/google-calendar/transformers.ts

interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: { dateTime?: string; date?: string; timeZone?: string };
  end: { dateTime?: string; date?: string; timeZone?: string };
  attendees?: Array<{
    email: string;
    displayName?: string;
    optional?: boolean;
    organizer?: boolean;
    responseStatus: 'needsAction' | 'accepted' | 'declined' | 'tentative';
  }>;
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: 'email' | 'popup';
      minutes: number;
    }>;
  };
  recurrence?: string[]; // RRULE format
  created: string;
  updated: string;
}

function googleEventToCalendarEvent(
  googleEvent: GoogleCalendarEvent
): CalendarEvent {
  const isAllDay = !!googleEvent.start.date;

  return {
    id: googleEvent.id,
    title: googleEvent.summary,
    description: googleEvent.description,
    location: googleEvent.location,
    start_time: new Date(googleEvent.start.dateTime || googleEvent.start.date!),
    end_time: new Date(googleEvent.end.dateTime || googleEvent.end.date!),
    all_day: isAllDay,
    attendees: (googleEvent.attendees || []).map(att => ({
      email: att.email,
      display_name: att.displayName,
      optional: att.optional || false,
      organizer: att.organizer || false,
      response_status: att.responseStatus,
    })),
    reminders: googleEvent.reminders?.overrides || [],
    recurrence: parseGoogleRRule(googleEvent.recurrence),
    created: new Date(googleEvent.created),
    updated: new Date(googleEvent.updated),
    calendar_id: 'primary',
  };
}
```

**Google Task → Task DTO:**
```typescript
interface GoogleTask {
  id: string;
  title: string;
  notes?: string;
  status: 'needsAction' | 'completed';
  due?: string; // RFC 3339 timestamp
  completed?: string;
  updated: string;
}

function googleTaskToTask(googleTask: GoogleTask): Task {
  return {
    id: googleTask.id,
    title: googleTask.title,
    description: googleTask.notes,
    due_date: googleTask.due ? new Date(googleTask.due) : undefined,
    priority: 0, // Google Tasks doesn't support priority
    status: googleTask.status === 'completed' ? 'COMPLETED' : 'NEEDS-ACTION',
    completed_at: googleTask.completed ? new Date(googleTask.completed) : undefined,
    percent_complete: googleTask.status === 'completed' ? 100 : 0,
    reminders: [], // Google Tasks doesn't support reminders natively
    recurrence: undefined, // Google Tasks doesn't support recurrence
    created: undefined, // Not provided by API
    updated: new Date(googleTask.updated),
    calendar_id: 'primary',
  };
}
```

**Implementation Tasks:**

1. **Setup OAuth 2.0:**
   - Create Google Cloud Console project
   - Enable Calendar API and Tasks API
   - Configure OAuth consent screen
   - Get client ID and client secret
   - Add authorized redirect URIs

2. **Create API Client:**
   - Implement fetch wrappers with auth headers
   - Handle token refresh
   - Error handling (rate limits, network errors)
   - Retry logic with exponential backoff

3. **Build Transformers:**
   - Google Calendar Event → CalendarEvent DTO
   - Google Task → Task DTO
   - Handle timezone conversions
   - Parse RRULE strings
   - Map Google-specific fields to ICS equivalents

4. **Implement Caching:**
   - IndexedDB schema for events/tasks
   - Cache invalidation strategy
   - Background sync when online
   - Conflict resolution (server wins vs last-write wins)

5. **Sync Engine:**
   - Detect changes (added, modified, deleted)
   - Batch updates for efficiency
   - Optimistic UI updates
   - Rollback on errors

6. **Real-time Updates (Optional):**
   - Google Calendar Push Notifications (requires backend)
   - Polling with incremental sync (updatedMin parameter)
   - WebSocket proxy via backend service

**API Rate Limits:**
- Google Calendar API: 1,000,000 queries/day
- Google Tasks API: 50,000 queries/day
- Implement request queuing and throttling

**Security Considerations:**
- Store tokens securely (httpOnly cookies for refresh tokens)
- Never expose client secret in frontend code
- Use PKCE (Proof Key for Code Exchange) flow
- Implement CSRF protection
- Token rotation on refresh

**Dependencies:**
```json
{
  "@react-oauth/google": "^0.12.1",
  "idb": "^8.0.0",  // IndexedDB wrapper
  "date-fns-tz": "^3.1.3"  // Timezone handling
}
```

**Example Usage:**
```typescript
// In component
import { useGoogleCalendar } from '@/lib/services/google-calendar/hooks';

function TaskListWithGoogleSync() {
  const {
    tasks,
    events,
    loading,
    error,
    sync,
    isAuthenticated,
    login,
    logout,
  } = useGoogleCalendar({
    autoSync: true,
    syncInterval: 300000, // 5 minutes
  });

  if (!isAuthenticated) {
    return <button onClick={login}>Connect Google Calendar</button>;
  }

  return (
    <>
      <QuickTasksList
        tasks={tasks}
        onAddTask={async (task) => {
          // Optimistic update
          await sync.createTask(task);
        }}
        loading={loading}
        error={error}
      />

      <CalendarView
        events={events}
        onAddEvent={async (event) => {
          await sync.createEvent(event);
        }}
      />

      <button onClick={logout}>Disconnect</button>
    </>
  );
}
```

**Alternative: Backend Proxy Pattern**

For production apps, consider proxying through your own backend:

```
Frontend → Backend API → Google Calendar API
         ↑
    Token stored securely
    Rate limiting
    Caching
```

**Benefits:**
- More secure token storage
- Server-side caching
- Rate limit management
- Webhook support
- Multi-user support
- Audit logging

## ICS Utilities

### DTO → ICS Conversion

```typescript
// lib/components/QuickEventsCard/utils/ics-generator.ts

export function eventToICS(event: CalendarEvent): string {
  const lines = [
    "BEGIN:VEVENT",
    `UID:${event.id || generateUID()}`,
    `SUMMARY:${escapeICS(event.title)}`,
  ];

  if (event.description) {
    lines.push(`DESCRIPTION:${escapeICS(event.description)}`);
  }

  if (event.location) {
    lines.push(`LOCATION:${escapeICS(event.location)}`);
  }

  // Date/time
  if (event.all_day) {
    lines.push(`DTSTART;VALUE=DATE:${formatICSDate(event.start_time)}`);
    lines.push(`DTEND;VALUE=DATE:${formatICSDate(event.end_time)}`);
  } else {
    lines.push(`DTSTART:${formatICSDateTime(event.start_time)}`);
    lines.push(`DTEND:${formatICSDateTime(event.end_time)}`);
  }

  // Attendees
  event.attendees.forEach(attendee => {
    lines.push(formatAttendee(attendee));
  });

  // Reminders (VALARM)
  event.reminders.forEach(reminder => {
    lines.push("BEGIN:VALARM");
    lines.push(`ACTION:${reminder.method === "email" ? "EMAIL" : "DISPLAY"}`);
    lines.push(`TRIGGER:-PT${reminder.minutes}M`);
    lines.push("END:VALARM");
  });

  // Recurrence
  if (event.recurrence) {
    lines.push(formatRecurrence(event.recurrence));
  }

  lines.push("END:VEVENT");

  return lines.join("\r\n");
}
```

### ICS → DTO Parsing

```typescript
// lib/components/QuickEventsCard/utils/ics-parser.ts

export function parseICSEvent(icsText: string): CalendarEvent {
  // Use ical.js or custom parser
  const parsed = ICAL.parse(icsText);
  const vevent = parsed[2][0]; // Get VEVENT component

  return {
    id: getProperty(vevent, "UID"),
    title: getProperty(vevent, "SUMMARY"),
    description: getProperty(vevent, "DESCRIPTION"),
    location: getProperty(vevent, "LOCATION"),
    start_time: parseICSDateTime(getProperty(vevent, "DTSTART")),
    end_time: parseICSDateTime(getProperty(vevent, "DTEND")),
    all_day: isAllDay(getProperty(vevent, "DTSTART")),
    attendees: parseAttendees(vevent),
    reminders: parseAlarms(vevent),
    recurrence: parseRecurrence(getProperty(vevent, "RRULE")),
    created: parseICSDateTime(getProperty(vevent, "CREATED")),
    updated: parseICSDateTime(getProperty(vevent, "LAST-MODIFIED")),
  };
}
```

## Testing Strategy

### Unit Tests
- [ ] DTO validation with Zod schemas
- [ ] ICS conversion utilities (DTO → ICS → DTO round-trip)
- [ ] Date grouping logic
- [ ] Reminder formatting
- [ ] Component rendering with various props

### Integration Tests
- [ ] Complete CRUD flow (add → edit → delete)
- [ ] Form submission and validation
- [ ] Multi-reminder management
- [ ] Empty state transitions
- [ ] Error handling

### ICS Compatibility Tests
- [ ] Parse real ICS files from Google Calendar
- [ ] Parse ICS from Apple Calendar
- [ ] Round-trip conversion preserves data
- [ ] Handle edge cases (all-day, recurring, etc.)

### Visual Regression Tests (Storybook)
- [ ] All component states captured
- [ ] Interaction testing
- [ ] Accessibility audit (a11y addon)

## Dependencies

### Existing (No New Install Required)
- `react-hook-form` - Form state management ✅
- `zod` - Schema validation ✅
- `@hookform/resolvers` - Form validation ✅
- `lucide-react` - Icons ✅
- `tailwindcss` - Styling ✅
- `date-fns` - Date formatting (if needed)

### Optional (ICS Parsing)
- `ical.js` - Robust ICS parser (Mozilla project)
- Or custom ICS parser (simpler, fewer deps)

## Future Enhancements

### Phase 2 Features
- [ ] **Search & Filter**: Full-text search, filter by location/reminder
- [ ] **Recurring Events UI**: Visual editor for recurrence rules
- [ ] **Conflict Detection**: Warning for overlapping events
- [ ] **Calendar View**: Mini calendar picker integration
- [ ] **Drag & Drop**: Reschedule by dragging events

### Phase 3 Features
- [ ] **Bulk Operations**: Multi-select and batch actions
- [ ] **Event Templates**: Save common event patterns
- [ ] **Smart Suggestions**: ML-based time/reminder suggestions
- [ ] **Timezone Support**: Multi-timezone event display
- [ ] **Attachments**: File attachments on events (ICS ATTACH property)

### Backend Integration Options
- [ ] **ActiveCalendar (Python)**: Via REST API
- [ ] **Google Calendar API**: Direct integration
- [ ] **CalDAV**: Standard calendar protocol
- [ ] **Local Storage**: Browser-based persistence
- [ ] **IndexedDB**: Offline-first architecture

## ICS Specification References

- **RFC 5545**: iCalendar specification
  - [Section 3.6.1](https://datatracker.ietf.org/doc/html/rfc5545#section-3.6.1) - VEVENT
  - [Section 3.6.6](https://datatracker.ietf.org/doc/html/rfc5545#section-3.6.6) - VALARM
  - [Section 3.8.4.1](https://datatracker.ietf.org/doc/html/rfc5545#section-3.8.4.1) - ATTENDEE
  - [Section 3.8.5.3](https://datatracker.ietf.org/doc/html/rfc5545#section-3.8.5.3) - RRULE

- **Libraries**:
  - [ical.js](https://github.com/kewisch/ical.js) - Mozilla ICS parser
  - [ActiveCalendar](../../catalyst-py/catalyst/ActiveCalendar/) - Python ICS backend

## Success Metrics

- **Performance**: Time to add event < 10 seconds
- **Validation**: User error rate < 5%
- **Bundle Size**: Component < 50KB gzipped
- **Accessibility**: Lighthouse score 100 (no violations)
- **ICS Compliance**: 100% round-trip conversion accuracy

## Status Checklist

- [ ] Feature proposal approved
- [ ] TypeScript DTOs defined
- [ ] ICS conversion utilities implemented
- [ ] Core UI components built
- [ ] Storybook stories created
- [ ] Demo page with mock data
- [ ] Unit tests written
- [ ] ICS compatibility validated
- [ ] Documentation complete
- [ ] Ready for backend integration

---

## Appendix: Complete ICS Reference

### A.1 - VTODO (Task) - Complete Example

**ICS Format (RFC 5545):**
```ics
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Catalyst UI//Task Manager 1.0//EN
CALSCALE:GREGORIAN

BEGIN:VTODO
UID:task-550e8400-e29b-41d4-a716-446655440000
DTSTAMP:20251006T120000Z
CREATED:20251006T100000Z
LAST-MODIFIED:20251006T120000Z
SUMMARY:Finish project documentation
DESCRIPTION:Complete the README and API documentation for the new feature
DUE:20251010T170000Z
PRIORITY:1
STATUS:IN-PROCESS
PERCENT-COMPLETE:50
SEQUENCE:2

BEGIN:VALARM
ACTION:DISPLAY
TRIGGER:-PT1H
DESCRIPTION:Task due in 1 hour
END:VALARM

BEGIN:VALARM
ACTION:EMAIL
TRIGGER:-P1D
SUMMARY:Task due tomorrow
DESCRIPTION:Finish project documentation is due tomorrow
ATTENDEE:mailto:user@example.com
END:VALARM

RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=FR

END:VTODO
END:VCALENDAR
```

**TypeScript DTO:**
```typescript
const task: Task = {
  id: "task-550e8400-e29b-41d4-a716-446655440000",
  title: "Finish project documentation",
  description: "Complete the README and API documentation for the new feature",
  due_date: new Date("2025-10-10T17:00:00Z"),
  priority: 1, // High priority
  status: "IN-PROCESS",
  completed_at: undefined,
  percent_complete: 50,
  reminders: [
    { method: "popup", minutes: 60 },  // 1 hour before
    { method: "email", minutes: 1440 }, // 1 day before
  ],
  recurrence: {
    freq: "WEEKLY",
    interval: 1,
    by_day: ["FR"],
  },
  created: new Date("2025-10-06T10:00:00Z"),
  updated: new Date("2025-10-06T12:00:00Z"),
  calendar_id: "primary",
};
```

**Property Mapping:**
| ICS Property | DTO Field | Example Value |
|--------------|-----------|---------------|
| `UID` | `id` | `"task-550e8400..."` |
| `SUMMARY` | `title` | `"Finish project documentation"` |
| `DESCRIPTION` | `description` | `"Complete the README..."` |
| `DUE` | `due_date` | `new Date("2025-10-10T17:00:00Z")` |
| `PRIORITY` | `priority` | `1` (high) |
| `STATUS` | `status` | `"IN-PROCESS"` |
| `COMPLETED` | `completed_at` | `new Date(...)` or `undefined` |
| `PERCENT-COMPLETE` | `percent_complete` | `50` |
| `VALARM` | `reminders[]` | `[{ method, minutes }]` |
| `RRULE` | `recurrence` | `{ freq, interval, ... }` |
| `CREATED` | `created` | `new Date(...)` |
| `LAST-MODIFIED` | `updated` | `new Date(...)` |

---

### A.2 - VEVENT (Calendar Event) - Complete Example

**ICS Format (RFC 5545):**
```ics
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Catalyst UI//Calendar 1.0//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH

BEGIN:VEVENT
UID:event-660e9500-f39c-52e5-b827-557766551111
DTSTAMP:20251006T120000Z
CREATED:20251001T100000Z
LAST-MODIFIED:20251005T143000Z
DTSTART:20251010T090000Z
DTEND:20251010T100000Z
SUMMARY:Team Standup Meeting
DESCRIPTION:Daily sync with the engineering team
LOCATION:Conference Room A - Building 2
STATUS:CONFIRMED
TRANSP:OPAQUE
SEQUENCE:3

ATTENDEE;CN=John Doe;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;RSVP=TRUE:mailto:john@example.com
ATTENDEE;CN=Jane Smith;ROLE=OPT-PARTICIPANT;PARTSTAT=TENTATIVE;RSVP=TRUE:mailto:jane@example.com
ATTENDEE;CN=Project Lead;ROLE=CHAIR;PARTSTAT=ACCEPTED:mailto:lead@example.com

BEGIN:VALARM
ACTION:DISPLAY
TRIGGER:-PT15M
DESCRIPTION:Meeting starts in 15 minutes
END:VALARM

BEGIN:VALARM
ACTION:EMAIL
TRIGGER:-PT1H
SUMMARY:Meeting Reminder
DESCRIPTION:Team Standup Meeting starts in 1 hour
ATTENDEE:mailto:john@example.com
END:VALARM

RRULE:FREQ=DAILY;INTERVAL=1;BYDAY=MO,TU,WE,TH,FR;UNTIL=20251231T235959Z

END:VEVENT
END:VCALENDAR
```

**TypeScript DTO:**
```typescript
const event: CalendarEvent = {
  id: "event-660e9500-f39c-52e5-b827-557766551111",
  title: "Team Standup Meeting",
  description: "Daily sync with the engineering team",
  location: "Conference Room A - Building 2",
  start_time: new Date("2025-10-10T09:00:00Z"),
  end_time: new Date("2025-10-10T10:00:00Z"),
  all_day: false,
  attendees: [
    {
      email: "john@example.com",
      display_name: "John Doe",
      optional: false,
      organizer: false,
      response_status: "accepted",
    },
    {
      email: "jane@example.com",
      display_name: "Jane Smith",
      optional: true,
      organizer: false,
      response_status: "tentative",
    },
    {
      email: "lead@example.com",
      display_name: "Project Lead",
      optional: false,
      organizer: true,
      response_status: "accepted",
    },
  ],
  reminders: [
    { method: "popup", minutes: 15 },
    { method: "email", minutes: 60 },
  ],
  recurrence: {
    freq: "DAILY",
    interval: 1,
    by_day: ["MO", "TU", "WE", "TH", "FR"],
    until: new Date("2025-12-31T23:59:59Z"),
  },
  created: new Date("2025-10-01T10:00:00Z"),
  updated: new Date("2025-10-05T14:30:00Z"),
  calendar_id: "primary",
};
```

**Property Mapping:**
| ICS Property | DTO Field | Example Value |
|--------------|-----------|---------------|
| `UID` | `id` | `"event-660e9500..."` |
| `SUMMARY` | `title` | `"Team Standup Meeting"` |
| `DESCRIPTION` | `description` | `"Daily sync with..."` |
| `LOCATION` | `location` | `"Conference Room A..."` |
| `DTSTART` | `start_time` | `new Date("2025-10-10T09:00:00Z")` |
| `DTEND` | `end_time` | `new Date("2025-10-10T10:00:00Z")` |
| `DTSTART;VALUE=DATE` | `all_day: true` | Date-only format |
| `ATTENDEE` | `attendees[]` | `[{ email, display_name, ... }]` |
| `VALARM` | `reminders[]` | `[{ method, minutes }]` |
| `RRULE` | `recurrence` | `{ freq, interval, ... }` |
| `CREATED` | `created` | `new Date(...)` |
| `LAST-MODIFIED` | `updated` | `new Date(...)` |

---

### A.3 - VALARM (Reminder) - All Variations

**DISPLAY Action (Popup):**
```ics
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER:-PT15M
DESCRIPTION:Reminder: Meeting starts soon
END:VALARM
```

**EMAIL Action:**
```ics
BEGIN:VALARM
ACTION:EMAIL
TRIGGER:-PT1H
SUMMARY:Meeting Reminder
DESCRIPTION:Your meeting starts in 1 hour
ATTENDEE:mailto:user@example.com
END:VALARM
```

**AUDIO Action (Not Supported Yet):**
```ics
BEGIN:VALARM
ACTION:AUDIO
TRIGGER:-PT5M
ATTACH;FMTTYPE=audio/mpeg:http://example.com/alarm.mp3
END:VALARM
```

**TypeScript DTO:**
```typescript
interface Reminder {
  method: "email" | "popup";  // Maps to ACTION
  minutes: number;             // Converts to TRIGGER
}

// Examples:
const reminders: Reminder[] = [
  { method: "popup", minutes: 0 },     // TRIGGER:PT0M (at time of event)
  { method: "popup", minutes: 5 },     // TRIGGER:-PT5M
  { method: "popup", minutes: 15 },    // TRIGGER:-PT15M
  { method: "popup", minutes: 30 },    // TRIGGER:-PT30M
  { method: "email", minutes: 60 },    // TRIGGER:-PT1H
  { method: "email", minutes: 1440 },  // TRIGGER:-P1D (1 day = 1440 min)
  { method: "email", minutes: 10080 }, // TRIGGER:-P7D (1 week = 10080 min)
];
```

**TRIGGER Format Conversion:**
| Minutes | ICS TRIGGER | Description |
|---------|-------------|-------------|
| `0` | `PT0M` | At event time |
| `5` | `-PT5M` | 5 minutes before |
| `15` | `-PT15M` | 15 minutes before |
| `30` | `-PT30M` | 30 minutes before |
| `60` | `-PT1H` | 1 hour before |
| `120` | `-PT2H` | 2 hours before |
| `1440` | `-P1D` | 1 day before |
| `10080` | `-P7D` | 1 week before |

---

### A.4 - RRULE (Recurrence Rule) - All Patterns

**Daily:**
```ics
RRULE:FREQ=DAILY;INTERVAL=1
```
```typescript
{ freq: "DAILY", interval: 1 }
```

**Weekly (specific days):**
```ics
RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,WE,FR
```
```typescript
{ freq: "WEEKLY", interval: 1, by_day: ["MO", "WE", "FR"] }
```

**Monthly (by date):**
```ics
RRULE:FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=1,15
```
```typescript
{ freq: "MONTHLY", interval: 1, by_month_day: [1, 15] }
```

**Yearly:**
```ics
RRULE:FREQ=YEARLY;INTERVAL=1
```
```typescript
{ freq: "YEARLY", interval: 1 }
```

**With count (limited occurrences):**
```ics
RRULE:FREQ=WEEKLY;INTERVAL=2;COUNT=10
```
```typescript
{ freq: "WEEKLY", interval: 2, count: 10 }
```

**With end date:**
```ics
RRULE:FREQ=DAILY;UNTIL=20251231T235959Z
```
```typescript
{ freq: "DAILY", until: new Date("2025-12-31T23:59:59Z") }
```

**TypeScript DTO:**
```typescript
interface Recurrence {
  freq: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  interval: number;           // Every N periods
  count?: number;             // Stop after N occurrences
  until?: Date;               // Stop at this date
  by_day?: string[];          // ["MO", "TU", "WE", "TH", "FR", "SA", "SU"]
  by_month_day?: number[];    // [1-31]
}
```

---

### A.5 - ATTENDEE (Event Participants)

**Required Participant (Accepted):**
```ics
ATTENDEE;CN=John Doe;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;RSVP=TRUE:mailto:john@example.com
```

**Optional Participant (Tentative):**
```ics
ATTENDEE;CN=Jane Smith;ROLE=OPT-PARTICIPANT;PARTSTAT=TENTATIVE;RSVP=TRUE:mailto:jane@example.com
```

**Organizer/Chair:**
```ics
ATTENDEE;CN=Meeting Organizer;ROLE=CHAIR;PARTSTAT=ACCEPTED:mailto:organizer@example.com
```

**Declined:**
```ics
ATTENDEE;CN=Bob Wilson;ROLE=REQ-PARTICIPANT;PARTSTAT=DECLINED;RSVP=TRUE:mailto:bob@example.com
```

**TypeScript DTO:**
```typescript
interface Attendee {
  email: string;                    // MAILTO:
  display_name?: string;            // CN=
  optional: boolean;                // ROLE=OPT-PARTICIPANT vs REQ-PARTICIPANT
  organizer: boolean;               // ROLE=CHAIR
  response_status:                  // PARTSTAT=
    | "needsAction"                 // NEEDS-ACTION
    | "accepted"                    // ACCEPTED
    | "declined"                    // DECLINED
    | "tentative";                  // TENTATIVE
}

// Examples:
const attendees: Attendee[] = [
  {
    email: "john@example.com",
    display_name: "John Doe",
    optional: false,
    organizer: false,
    response_status: "accepted",
  },
  {
    email: "jane@example.com",
    display_name: "Jane Smith",
    optional: true,
    organizer: false,
    response_status: "tentative",
  },
  {
    email: "organizer@example.com",
    display_name: "Meeting Organizer",
    optional: false,
    organizer: true,
    response_status: "accepted",
  },
];
```

**PARTSTAT Mapping:**
| ICS Value | DTO Value | Description |
|-----------|-----------|-------------|
| `NEEDS-ACTION` | `"needsAction"` | No response yet |
| `ACCEPTED` | `"accepted"` | Confirmed attendance |
| `DECLINED` | `"declined"` | Cannot attend |
| `TENTATIVE` | `"tentative"` | Might attend |

---

### A.6 - All-Day Events

**All-Day Event (DATE format):**
```ics
BEGIN:VEVENT
UID:allday-event-123
DTSTART;VALUE=DATE:20251225
DTEND;VALUE=DATE:20251226
SUMMARY:Christmas Day
DESCRIPTION:Public holiday
END:VEVENT
```

**TypeScript DTO:**
```typescript
const allDayEvent: CalendarEvent = {
  id: "allday-event-123",
  title: "Christmas Day",
  description: "Public holiday",
  start_time: new Date("2025-12-25T00:00:00"),
  end_time: new Date("2025-12-26T00:00:00"),
  all_day: true,  // KEY: Triggers DATE format in ICS
  location: undefined,
  attendees: [],
  reminders: [],
  recurrence: undefined,
};
```

**Key Difference:**
- `all_day: false` → `DTSTART:20251225T090000Z` (with time)
- `all_day: true` → `DTSTART;VALUE=DATE:20251225` (date only)

---

### A.7 - Complete DTO Type Definitions

```typescript
// ============================================================================
// SHARED TYPES (Used by both VTODO and VEVENT)
// ============================================================================

/**
 * Reminder/Alarm - Maps to ICS VALARM
 * @see RFC 5545 Section 3.6.6
 */
export interface Reminder {
  method: "email" | "popup";  // ACTION: EMAIL or DISPLAY
  minutes: number;             // TRIGGER: -PT{minutes}M
}

/**
 * Recurrence Rule - Maps to ICS RRULE
 * @see RFC 5545 Section 3.8.5.3
 */
export interface Recurrence {
  freq: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  interval: number;
  count?: number;
  until?: Date;
  by_day?: string[];        // ["MO", "TU", "WE", "TH", "FR", "SA", "SU"]
  by_month_day?: number[];  // [1-31]
}

// ============================================================================
// VTODO TYPES (Tasks/Todos)
// ============================================================================

/**
 * Task - Maps to ICS VTODO component
 * @see RFC 5545 Section 3.6.2
 */
export interface Task {
  // Identification
  id?: string;                    // UID

  // Core properties
  title: string;                  // SUMMARY (required, 1-1024 chars)
  description?: string;           // DESCRIPTION (max 8192 chars)
  due_date?: Date;                // DUE

  // Status tracking
  priority: number;               // PRIORITY (0-9: 0=undefined, 1=highest, 9=lowest)
  status:                         // STATUS
    | "NEEDS-ACTION"
    | "IN-PROCESS"
    | "COMPLETED"
    | "CANCELLED";
  completed_at?: Date;            // COMPLETED (datetime when status=COMPLETED)
  percent_complete: number;       // PERCENT-COMPLETE (0-100)

  // Related components
  reminders: Reminder[];          // VALARM (multiple)
  recurrence?: Recurrence;        // RRULE

  // Metadata
  calendar_id?: string;           // X-CALENDAR-ID (custom property)
  created?: Date;                 // CREATED
  updated?: Date;                 // LAST-MODIFIED
  ics_data?: Record<string, any>; // Raw ICS properties
}

// ============================================================================
// VEVENT TYPES (Calendar Events)
// ============================================================================

/**
 * Attendee - Maps to ICS ATTENDEE property
 * @see RFC 5545 Section 3.8.4.1
 */
export interface Attendee {
  email: string;                  // MAILTO:
  display_name?: string;          // CN=
  optional: boolean;              // ROLE=OPT-PARTICIPANT vs REQ-PARTICIPANT
  organizer: boolean;             // ROLE=CHAIR
  response_status:                // PARTSTAT=
    | "needsAction"
    | "accepted"
    | "declined"
    | "tentative";
}

/**
 * Calendar Event - Maps to ICS VEVENT component
 * @see RFC 5545 Section 3.6.1
 */
export interface CalendarEvent {
  // Identification
  id?: string;                    // UID

  // Core properties
  title: string;                  // SUMMARY (required, 1-1024 chars)
  description?: string;           // DESCRIPTION (max 8192 chars)
  location?: string;              // LOCATION (max 1024 chars)

  // Time properties
  start_time: Date;               // DTSTART or DTSTART;VALUE=DATE
  end_time: Date;                 // DTEND or DTEND;VALUE=DATE
  all_day: boolean;               // Determines DATE vs DATETIME format

  // Related components
  attendees: Attendee[];          // ATTENDEE (multiple)
  reminders: Reminder[];          // VALARM (multiple)
  recurrence?: Recurrence;        // RRULE

  // Metadata
  calendar_id?: string;           // X-CALENDAR-ID (custom property)
  created?: Date;                 // CREATED
  updated?: Date;                 // LAST-MODIFIED
  ics_data?: Record<string, any>; // Raw ICS properties
}

// ============================================================================
// UI INPUT TYPES (Simplified for forms)
// ============================================================================

/**
 * Quick Task Input - Simplified form DTO
 */
export interface QuickTaskInput {
  title: string;
  due_date?: Date;
  priority?: number;              // 1=high, 5=medium, 9=low
  reminder_minutes?: number;
  reminder_method?: "email" | "popup";
}

/**
 * Quick Event Input - Simplified form DTO
 */
export interface QuickEventInput {
  title: string;
  start_time: Date;
  duration_minutes: number;       // Converts to end_time
  location?: string;
  reminder_minutes?: number;
  reminder_method?: "email" | "popup";
}
```

---

### A.8 - ICS Priority Values

ICS PRIORITY property uses integers 0-9:

| Priority Value | Meaning | UI Label | Badge Color |
|----------------|---------|----------|-------------|
| `0` | Undefined/No priority | None | - |
| `1` | Highest priority | High | 🔴 Red |
| `2-4` | High priority | High | 🔴 Red |
| `5` | Medium priority | Medium | 🟡 Yellow |
| `6-8` | Low priority | Low | 🔵 Blue |
| `9` | Lowest priority | Low | 🔵 Blue |

**Simplified UI Mapping:**
```typescript
const PRIORITY_MAP = {
  HIGH: 1,
  MEDIUM: 5,
  LOW: 9,
  NONE: 0,
} as const;

function getPriorityLabel(priority: number): string {
  if (priority === 0) return "None";
  if (priority >= 1 && priority <= 4) return "High";
  if (priority === 5) return "Medium";
  if (priority >= 6 && priority <= 9) return "Low";
  return "Unknown";
}
```

---

### A.9 - Date/Time Format Conversion

**ISO 8601 (TypeScript Date) ↔ ICS Format:**

```typescript
// DATETIME (with time)
const date = new Date("2025-10-10T09:00:00Z");
const icsDateTime = "20251010T090000Z";  // UTC format

// DATE (all-day, no time)
const dateOnly = new Date("2025-12-25");
const icsDate = "20251225";  // VALUE=DATE

// Conversion functions
function toICSDateTime(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function toICSDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

function fromICSDateTime(icsDate: string): Date {
  // Parse: 20251010T090000Z → 2025-10-10T09:00:00Z
  const year = icsDate.slice(0, 4);
  const month = icsDate.slice(4, 6);
  const day = icsDate.slice(6, 8);
  const hour = icsDate.slice(9, 11);
  const minute = icsDate.slice(11, 13);
  const second = icsDate.slice(13, 15);
  return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);
}
```

---

### A.10 - Zod Validation Schemas (Complete)

```typescript
import { z } from "zod";

// Shared schemas
export const ReminderSchema = z.object({
  method: z.enum(["email", "popup"]),
  minutes: z.number().min(0).max(20160), // Max 2 weeks
});

export const RecurrenceSchema = z.object({
  freq: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
  interval: z.number().min(1).max(999),
  count: z.number().min(1).optional(),
  until: z.date().optional(),
  by_day: z.array(z.enum(["MO", "TU", "WE", "TH", "FR", "SA", "SU"])).optional(),
  by_month_day: z.array(z.number().min(1).max(31)).optional(),
}).refine(
  (data) => !(data.count && data.until),
  { message: "Cannot specify both count and until" }
);

// Task (VTODO) schema
export const TaskSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(1024),
  description: z.string().max(8192).optional(),
  due_date: z.date().optional(),
  priority: z.number().min(0).max(9).default(0),
  status: z.enum(["NEEDS-ACTION", "IN-PROCESS", "COMPLETED", "CANCELLED"]),
  completed_at: z.date().optional(),
  percent_complete: z.number().min(0).max(100).default(0),
  reminders: z.array(ReminderSchema).default([]),
  recurrence: RecurrenceSchema.optional(),
  calendar_id: z.string().optional(),
  created: z.date().optional(),
  updated: z.date().optional(),
  ics_data: z.record(z.any()).optional(),
}).refine(
  (data) => {
    if (data.status === "COMPLETED") {
      return data.completed_at !== undefined && data.percent_complete === 100;
    }
    return true;
  },
  { message: "Completed tasks must have completed_at and percent_complete=100" }
);

// Attendee schema
export const AttendeeSchema = z.object({
  email: z.string().email(),
  display_name: z.string().min(1).max(256).optional(),
  optional: z.boolean().default(false),
  organizer: z.boolean().default(false),
  response_status: z.enum(["needsAction", "accepted", "declined", "tentative"]),
});

// Calendar Event (VEVENT) schema
export const CalendarEventSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(1024),
  description: z.string().max(8192).optional(),
  location: z.string().max(1024).optional(),
  start_time: z.date(),
  end_time: z.date(),
  all_day: z.boolean().default(false),
  attendees: z.array(AttendeeSchema).default([]),
  reminders: z.array(ReminderSchema).default([]),
  recurrence: RecurrenceSchema.optional(),
  calendar_id: z.string().optional(),
  created: z.date().optional(),
  updated: z.date().optional(),
  ics_data: z.record(z.any()).optional(),
}).refine(
  (data) => data.end_time > data.start_time,
  { message: "end_time must be after start_time" }
);

// Quick input schemas
export const QuickTaskInputSchema = z.object({
  title: z.string().min(1).max(1024),
  due_date: z.date().optional(),
  priority: z.number().min(0).max(9).optional(),
  reminder_minutes: z.number().min(0).max(20160).optional(),
  reminder_method: z.enum(["email", "popup"]).optional(),
});

export const QuickEventInputSchema = z.object({
  title: z.string().min(1).max(1024),
  start_time: z.date(),
  duration_minutes: z.number().min(5).max(1440), // 5min to 24 hours
  location: z.string().max(1024).optional(),
  reminder_minutes: z.number().min(0).max(20160).optional(),
  reminder_method: z.enum(["email", "popup"]).optional(),
});
```
