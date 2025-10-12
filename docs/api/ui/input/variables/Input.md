[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/input](../README.md) / Input

# Variable: Input

> `const` **Input**: `ForwardRefExoticComponent`\<[`InputProps`](../interfaces/InputProps.md) & `RefAttributes`\<`HTMLInputElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/input.tsx:53](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/input.tsx#L53)

Input - Text input field with enhanced styling and interactions

A styled text input component with consistent theming, focus states, and smooth transitions.
Supports all native HTML input types (text, email, password, number, etc.) and includes
special styling for file inputs. Features hover effects and subtle scale animation on focus.

**Features:**

- Responsive height and padding for comfortable interaction
- Focus ring with offset for accessibility
- Hover state with primary color border hint
- Disabled state with reduced opacity and cursor change
- File input styling (borderless, transparent background)
- Smooth transitions on all interactive states
- Subtle scale animation on focus (1.01x)

## Example

```tsx
// Basic text input
<Input type="text" placeholder="Enter your name" />

// Email input with controlled state
<Input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="you@example.com"
/>

// Password input with disabled state
<Input
  type="password"
  placeholder="Enter password"
  disabled={isLoading}
/>

// File input (styled automatically)
<Input type="file" accept="image/*" />
```
