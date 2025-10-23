# Dynamic Desktop PC Screen - Implementation Proposal

## Overview

Make the 3D desktop PC model's screen dynamically swappable to display static images, videos, or code snippets controlled via React state.

## Requirements

- **Control Method**: React state-driven (programmatic control from parent components)
- **Content Types**:
  - Static images (PNG, JPG, etc.)
  - Video playback with controls
  - Syntax-highlighted code snippets

## Implementation Steps

### 1. **Create Screen Texture Manager Hook** (`lib/components/ThreeJS/hooks/useScreenTexture.ts`)

- Custom hook to manage screen content and generate Three.js textures
- Support three content types:
  - **Static images**: Load image URLs as textures
  - **Video playback**: Create video textures with playback controls
  - **Code snippets**: Render code to canvas, then convert to texture
- Return texture and loading state

### 2. **Update DesktopPCModel Component** (`lib/components/ThreeJS/DesktopPCModel.tsx`)

- Add new prop: `screenContent: ScreenContent` (optional)
- Use `useEffect` to traverse GLTF scene and find screen mesh
- Apply dynamic texture to screen material
- Preserve existing lighting and model setup
- Type definition:
  ```ts
  type ScreenContent =
    | { type: "image"; url: string }
    | { type: "video"; url: string; autoplay?: boolean }
    | { type: "code"; code: string; language?: string };
  ```

### 3. **Add Screen Mesh Detection Logic**

- Traverse loaded GLTF scene to find screen mesh (likely named "screen", "monitor", or "display")
- Apply custom material with emissive properties for glow effect
- Handle cases where screen mesh might not exist gracefully

### 4. **Create Code-to-Texture Renderer** (`lib/components/ThreeJS/utils/codeToTexture.ts`)

- Use canvas to render syntax-highlighted code
- Support common languages (TypeScript, JavaScript, Python, etc.)
- Create texture from canvas with proper sizing
- Use monaco-editor or shiki for syntax highlighting

### 5. **Update WelcomeTab to Use Dynamic Screen** (`app/tabs/WelcomeTab.tsx`)

- Add React state for screen content
- Example: Cycle through different content types as a demo
- Pass `screenContent` prop to `<DesktopPCModel>`

### 6. **Export New Components**

- Export `useScreenTexture` hook from ThreeJS index
- Update TypeScript types
- Add documentation/examples

## Technical Approach

### Screen Mesh Detection

- Use `scene.traverse()` to find mesh by name pattern
- Common GLTF screen names: "screen", "monitor", "display", "Screen_0"
- Fallback: Use mesh with specific material properties

### Texture Application

- Create `MeshBasicMaterial` with emissive texture for screen glow
- Set `toneMapped: false` to prevent washed-out appearance
- Apply texture to `material.map` and `material.emissiveMap`

### Video Handling

- Create `<video>` element programmatically
- Use `VideoTexture` from Three.js
- Update texture on each frame via `useFrame`

### Code Rendering

- Create offscreen canvas (1024x768 or similar)
- Render highlighted code with proper formatting
- Convert canvas to `CanvasTexture`
- Update when code changes

## Files to Modify/Create

1. **Create**: `lib/components/ThreeJS/hooks/useScreenTexture.ts`
2. **Create**: `lib/components/ThreeJS/utils/codeToTexture.ts`
3. **Modify**: `lib/components/ThreeJS/DesktopPCModel.tsx`
4. **Modify**: `lib/components/ThreeJS/index.ts` (exports)
5. **Modify**: `app/tabs/WelcomeTab.tsx` (demo usage)
6. **Create**: TypeScript types in `lib/components/ThreeJS/types.ts`

## Example Usage

### Static Image

```tsx
<DesktopPCModel
  screenContent={{
    type: "image",
    url: "/screenshots/dashboard.png",
  }}
/>
```

### Video Playback

```tsx
<DesktopPCModel
  screenContent={{
    type: "video",
    url: "/videos/demo.mp4",
    autoplay: true,
  }}
/>
```

### Code Snippet

```tsx
<DesktopPCModel
  screenContent={{
    type: "code",
    code: 'const greeting = "Hello World";',
    language: "typescript",
  }}
/>
```

### Dynamic State-Driven Example

```tsx
const WelcomeTab = () => {
  const [screenContent, setScreenContent] = useState<ScreenContent>({
    type: "image",
    url: "/screenshots/welcome.png",
  });

  // Cycle through different content
  useEffect(() => {
    const interval = setInterval(() => {
      setScreenContent(prev => {
        if (prev.type === "image") {
          return { type: "video", url: "/videos/demo.mp4", autoplay: true };
        } else if (prev.type === "video") {
          return { type: "code", code: exampleCode, language: "typescript" };
        } else {
          return { type: "image", url: "/screenshots/welcome.png" };
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ThreeCanvas camera={{ position: [20, 3, 5], fov: 25 }}>
      <DesktopPCModel screenContent={screenContent} />
    </ThreeCanvas>
  );
};
```

## Benefits

1. **Reusable**: Screen content can be controlled from any parent component
2. **Type-safe**: Full TypeScript support for all content types
3. **Performant**: Textures only update when content changes
4. **Extensible**: Easy to add new content types in the future
5. **Showcases**: Perfect for portfolio/demo purposes

## Future Enhancements

- WebGL shader-based effects (scan lines, CRT distortion)
- Interactive screen (click-through to actual content)
- Multiple screens (dual monitor setup)
- Screen reflection/glow effects
- Loading states and transitions
