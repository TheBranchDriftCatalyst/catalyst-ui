[**Catalyst UI API Documentation v1.3.0**](../../../../README.md)

---

[Catalyst UI API Documentation](../../../../README.md) / [cards/CreateAccountCard/CreateAccountCard](../README.md) / CreateAccountCard

# Function: CreateAccountCard()

> **CreateAccountCard**(`props`): `Element`

Defined in: [workspace/catalyst-ui/lib/cards/CreateAccountCard/CreateAccountCard.tsx:110](https://github.com/TheBranchDriftCatalyst/catalyst-ui/blob/main/lib/cards/CreateAccountCard/CreateAccountCard.tsx#L110)

CreateAccountCard - Pre-styled authentication card with OIDC support

A ready-to-use login card component featuring:

- Username/password form with Zod validation
- OIDC provider buttons (GitHub, Google)
- Optional 3D tilt animation effect
- Responsive design with Catalyst theme styling

## Parameters

### props

`CreateAccountCardProps`

Component props

## Returns

`Element`

Rendered authentication card

## Example

```tsx
import { CreateAccountCard } from "catalyst-ui";

function LoginPage() {
  return (
    <CreateAccountCard
      oidcProviders={[
        { name: "github", onClick: () => loginWithGitHub() },
        { name: "google", onClick: () => loginWithGoogle() },
      ]}
      onLogin={values => console.log("Login:", values)}
      onCreateAccount={() => navigate("/signup")}
      enableTilt={true}
    />
  );
}
```
