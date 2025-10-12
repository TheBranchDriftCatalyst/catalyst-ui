[**Catalyst UI API Documentation v1.4.0**](../../../README.md)

---

[Catalyst UI API Documentation](../../../README.md) / [ui/card](../README.md) / Card

# Variable: Card

> `const` **Card**: `ForwardRefExoticComponent`\<[`CardProps`](../interfaces/CardProps.md) & `RefAttributes`\<`HTMLDivElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/card.tsx:65](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/card.tsx#L65)

Card - Container component for grouping related content

A flexible container with consistent styling for borders, shadows, and spacing.
Use with CardHeader, CardTitle, CardDescription, CardContent, and CardFooter
for structured layouts.

**Interactive mode:**
When `interactive={true}` (default), card has hover effects suitable for
clickable cards. Set to `false` for static content containers.

## Example

```tsx
// Basic card
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Supporting text</CardDescription>
  </CardHeader>
  <CardContent>
    Main content goes here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Non-interactive card (no hover effects)
<Card interactive={false}>
  <CardContent>Static content</CardContent>
</Card>
```
