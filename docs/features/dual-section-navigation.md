# Dual-Section Navigation with Collapsible Sidebars

## Problem Statement

The current horizontal tab navigation has several limitations that impact usability and scalability:

### Current Behavior

- ❌ **Space constraints**: 11 tabs consume significant horizontal space, especially on mobile
- ❌ **Poor scalability**: Adding more demos/sections requires shrinking tab labels
- ❌ **No logical grouping**: Component library demos mixed with project showcases
- ❌ **Mobile UX**: Tiny tabs with abbreviated labels on small screens
- ❌ **Discoverability**: No visual hierarchy between different types of content

### Current Tabs (11 total)

1. Overview
2. Cards
3. Components
4. Display
5. Force Graph
6. Forms
7. Resume
8. Tokens
9. Animations
10. Typography
11. Changelog

## Proposed Solution

Replace horizontal tabs with a **dual-section navigation** featuring:

1. **Two top-level header buttons**: "Catalyst UI" and "Projects"
2. **Semi-permanent responsive sidebar**: Visible on desktop, collapsible on mobile
3. **Logical content grouping**: Separate component library from project demos
4. **Room for growth**: Easy to add new sections or items without UI constraints

### Visual Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│ [Catalyst UI ▼] [Projects]  ...  [Settings] [Storybook]│  ← Header
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ Overview │  Main Content Area                           │
│ Cards    │  (Selected tab renders here)                 │
│ Comps    │                                              │
│ Display  │                                              │
│ Forms    │                                              │
│ Type     │                                              │
│ Anims    │                                              │
│ Tokens   │                                              │
│ Chg log  │                                              │
│          │                                              │
│   ↑      │                                              │
│ Sidebar  │                                              │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

### Responsive Behavior

**Desktop (≥768px):**

- Sidebar permanently visible (semi-permanent)
- 200-250px width
- Fixed position with smooth transitions
- Can be collapsed via toggle button

**Mobile (<768px):**

- Sidebar hidden by default
- Opens as overlay from left
- Backdrop blur/dim effect
- Auto-closes after selection
- Hamburger menu icon to toggle

## Content Organization

### Catalyst UI Section (Component Library)

Focus: React components, UI primitives, design system

- **Overview** - Introduction, getting started
- **Components** - Complex components (ForceGraph, etc.)
- **Cards** - Card-based components
- **Display** - Display utilities
- **Forms** - Form components and validation
- **Typography** - Text styling and formatting
- **Animations** - Effect HOCs and animations
- **Tokens** - Design token documentation
- **Changelog** - Version history

### Projects Section (Demo Applications)

Focus: Full-featured application demos built with Catalyst UI

- **Resume** - Character Sheet Resume demo
- **D4 Loader** - Currently shown as placeholder
- Future: More project showcases

**Note**: Force Graph could move here as a "project" or stay in Catalyst UI as a "component" depending on complexity.

## Implementation Plan

### Phase 1: Create Navigation Components

#### 1. SidebarNav Component

**File**: `app/components/SidebarNav.tsx`

Features:

- Accepts `items: Array<{ label, value, icon? }>`
- Active state highlighting
- Responsive width (200px desktop, full-width mobile)
- Smooth slide transitions
- Keyboard navigation support

```tsx
interface SidebarNavProps {
  items: Array<{
    label: string;
    value: string;
    icon?: React.ReactNode;
  }>;
  activeValue: string;
  onValueChange: (value: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SidebarNav({
  items,
  activeValue,
  onValueChange,
  open,
  onOpenChange,
}: SidebarNavProps) {
  // Desktop: fixed sidebar
  // Mobile: Sheet overlay
}
```

#### 2. SectionNavigation Component

**File**: `app/components/SectionNavigation.tsx`

Features:

- Two buttons: "Catalyst UI" and "Projects"
- Active state styling
- Click to switch sections
- Dropdown chevron indicator

```tsx
interface SectionNavigationProps {
  activeSection: "catalyst" | "projects";
  onSectionChange: (section: "catalyst" | "projects") => void;
}

export function SectionNavigation({ activeSection, onSectionChange }: SectionNavigationProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={activeSection === "catalyst" ? "default" : "ghost"}
        onClick={() => onSectionChange("catalyst")}
      >
        Catalyst UI ▼
      </Button>
      <Button
        variant={activeSection === "projects" ? "default" : "ghost"}
        onClick={() => onSectionChange("projects")}
      >
        Projects
      </Button>
    </div>
  );
}
```

### Phase 2: Update Tab Manifest

Add `section` field to group tabs:

**File**: `app/.tabs.manifest.json`

```json
[
  {
    "compKey": "OverviewTab",
    "name": "Overview",
    "value": "overview",
    "label": "Overview",
    "order": 0,
    "section": "catalyst"
  },
  {
    "compKey": "ResumeTab",
    "name": "Resume",
    "value": "resume",
    "label": "Character Sheet",
    "order": 0,
    "section": "projects"
  }
]
```

### Phase 3: Refactor App.tsx

Major changes:

1. Replace horizontal `TabsList` with `SectionNavigation`
2. Add `SidebarNav` component
3. Filter tabs by active section
4. Maintain URL routing (`?section=projects&tab=resume`)
5. Add sidebar state management (localStorage persistence)

**State structure:**

```tsx
const [activeSection, setActiveSection] = useState<"catalyst" | "projects">("catalyst");
const [activeTab, setActiveTab] = useState("overview");
const [sidebarOpen, setSidebarOpen] = useState(true); // desktop default

// Filter tabs by section
const sectionTabs = TABS.filter(t => t.section === activeSection);
```

### Phase 4: Update CatalystHeader

**File**: `lib/components/CatalystHeader/CatalystHeader.tsx`

Changes:

- Replace `tabs` prop with `sectionNav` prop
- Remove horizontal tab styling
- Add hamburger menu button for mobile

```tsx
<CatalystHeader
  title="CATALYST"
  navigationItems={navigationItems}
  userSettings={<UserSettingsDropdown />}
  sectionNav={
    <SectionNavigation activeSection={activeSection} onSectionChange={handleSectionChange} />
  }
  onMenuClick={() => setSidebarOpen(!sidebarOpen)} // mobile hamburger
/>
```

### Phase 5: Styling

**Tailwind classes:**

Desktop sidebar:

```tsx
<aside className="hidden md:block w-60 border-r border-border bg-card">
  {/* Sidebar content */}
</aside>
```

Mobile sidebar (Sheet):

```tsx
<Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
  <SheetContent side="left" className="w-[280px]">
    {/* Same sidebar content */}
  </SheetContent>
</Sheet>
```

Main content area:

```tsx
<main className="flex-1 md:ml-60 transition-all">{/* Tab content */}</main>
```

## Benefits

### ✅ Improved Scalability

- Can add unlimited sections without horizontal overflow
- Each section can have many items

### ✅ Better Organization

- Clear separation between component library and projects
- Logical grouping improves discoverability

### ✅ Enhanced Mobile UX

- Full-width sidebar overlay on mobile
- Readable labels (no truncation)
- Touch-friendly targets

### ✅ Consistent with Industry Standards

- Similar to Storybook, MDN, React docs
- Familiar navigation pattern

### ✅ Future-Proof

- Easy to add new sections (e.g., "Guides", "API")
- Extensible sidebar items (icons, badges, counts)

## Migration Path

### Step 1: Add section field to existing tabs

- Default all tabs to `catalyst` section
- Move Resume to `projects` section

### Step 2: Create new components (parallel development)

- Build SidebarNav
- Build SectionNavigation
- Don't touch existing App.tsx yet

### Step 3: Feature flag toggle

- Add `ENABLE_DUAL_NAV` feature flag
- Conditionally render old vs. new navigation
- Test in isolation

### Step 4: Full cutover

- Remove old tab navigation
- Remove feature flag
- Update documentation

### Step 5: Polish

- Add keyboard shortcuts (Cmd+K section search?)
- Add transition animations
- Test accessibility

## Testing Checklist

- [ ] Desktop sidebar visible by default
- [ ] Desktop sidebar can be collapsed
- [ ] Desktop sidebar state persists in localStorage
- [ ] Mobile sidebar hidden by default
- [ ] Mobile sidebar opens on hamburger click
- [ ] Mobile sidebar closes after item selection
- [ ] Mobile sidebar has backdrop blur
- [ ] Section switching works
- [ ] URL parameters update correctly
- [ ] URL parameters restore state on refresh
- [ ] Keyboard navigation works (Tab, Arrow keys)
- [ ] Screen reader announces section changes
- [ ] All existing tabs still accessible
- [ ] Responsive breakpoints work (768px, 1024px)
- [ ] Smooth transitions on all interactions
- [ ] No layout shift when sidebar toggles

## Dependencies

**Existing (already installed):**

- Radix UI Sheet - for mobile sidebar overlay
- Radix UI Button - for section buttons
- Tailwind CSS - for responsive styling

**New (if needed):**

- None - can implement with existing dependencies

## Alternative Considered

### Dropdown Menus Instead of Sidebar

**Pros:**

- Simpler implementation
- No layout shifts

**Cons:**

- Poor discoverability (items hidden by default)
- Awkward on mobile (nested menus)
- Not standard for documentation sites

**Decision**: Sidebar approach is superior for this use case.

## Future Enhancements

### 1. Search within sidebar

- Cmd+K to open search palette
- Filter items by name
- Recent items list

### 2. Collapsible sub-sections

- Group related tabs
- Expand/collapse groups
- Example: "Components" → [Cards, Display, Forms]

### 3. Icon support

- Add icons to sidebar items
- Visual distinction
- Lucide React icons integration

### 4. Breadcrumbs

- Show current path: Projects > Resume
- Click to navigate up

### 5. Sidebar resizing

- Draggable border
- Persist width preference

## Status

**Overall Progress: ~60% Complete** 🚧

- [x] Problem identified
- [x] Solution designed
- [x] RFC documented
- [x] SidebarNav component created ✅ `app/components/SidebarNav.tsx`
- [x] SectionNavigation component created ✅ `app/components/SectionNavigation.tsx`
- [x] Components integrated into App.tsx ✅ (lines 13-14, 131, 141)
- [ ] Tab manifest updated ⚠️ (needs `section` field added)
- [ ] CatalystHeader updated
- [ ] Styling complete
- [ ] Mobile tested
- [ ] Desktop tested
- [ ] Accessibility tested
- [ ] Production deployed

**Note**: Components exist and are functional but untracked in git. Run `git add app/components/{SidebarNav,SectionNavigation}.tsx` to track them.

## References

- [Radix UI Sheet Documentation](https://www.radix-ui.com/primitives/docs/components/sheet)
- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- Inspiration: Storybook navigation, MDN docs, Next.js docs
