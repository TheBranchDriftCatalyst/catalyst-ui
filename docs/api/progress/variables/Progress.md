[**Catalyst UI API Documentation v1.4.0**](../../README.md)

---

[Catalyst UI API Documentation](../../README.md) / [progress](../README.md) / Progress

# Variable: Progress

> `const` **Progress**: `ForwardRefExoticComponent`\<`Omit`\<`ProgressProps` & `RefAttributes`\<`HTMLDivElement`\>, `"ref"`\> & `VariantProps`\<(`props?`) => `string`\> & `RefAttributes`\<`HTMLDivElement`\>\>

Defined in: [workspace/catalyst-ui/lib/ui/progress.tsx:128](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/ui/progress.tsx#L128)

Progress - Visual progress indicator.

Displays a horizontal progress bar with animated fill indicator.
Supports different visual variants and smooth transitions.

## Component

## Param

Progress percentage (0-100)

## Param

Visual style: "default" | "secondary" | "destructive"

## Param

Additional CSS classes

## Examples

```tsx
// Simple progress bar
<Progress value={60} />
```

```tsx
// Animated loading progress
function LoadingBar() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + 10;
        return next > 100 ? 100 : next;
      });
    }, 300);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full">
      <Progress value={progress} />
      <p className="text-sm text-center mt-2">{progress}% complete</p>
    </div>
  );
}
```

```tsx
// Destructive variant for errors or warnings
<Progress value={75} variant="destructive" />
```

```tsx
// Multi-step form progress
function FormProgress({ currentStep, totalSteps }) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span>
          Step {currentStep} of {totalSteps}
        </span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} />
    </div>
  );
}
```

## Accessibility

- Uses native progress element with proper ARIA attributes
- Announces progress changes to screen readers
- Value automatically clamped to 0-100 range

## Remarks

The progress indicator uses a smooth 500ms transition when the value changes.
The fill color is set via the primary theme color.
