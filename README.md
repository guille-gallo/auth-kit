# @guille-gallo/auth-kit

Shared Supabase auth layer for React apps — sign-in screen, route guards, and a typed `useAuth` hook.

## Install

```bash
pnpm add @guille-gallo/auth-kit @supabase/supabase-js
```

Add the package's CSS once at the app root (e.g. `src/main.tsx`):

```ts
import '@guille-gallo/auth-kit/dist/index.css'
```

Set the following env vars (Vite projects):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Quick start

```tsx
import { AuthGate, useAuth } from '@guille-gallo/auth-kit'

export default function App() {
  return (
    <AuthGate>
      <SignedIn />
    </AuthGate>
  )
}

function SignedIn() {
  const { displayName, signOut, user } = useAuth()
  return (
    <div>
      <p>Hi {displayName}</p>
      <button onClick={signOut}>Sign out</button>
    </div>
  )
}
```

## Public API

| Export | Kind | Description |
|---|---|---|
| `useAuth()` | hook | Returns `{ session, user, displayName, isLoading, authError, signInWithGoogle, signOut }`. |
| `AuthGate` | component | Renders the `AuthScreen` until the user is signed in, then renders `children`. |
| `ProtectedRoute` | component | Per-route guard with the same gating logic. |
| `AuthScreen` | component | The default Google sign-in screen. |
| `getSupabaseClient(url?, anonKey?)` | function | Lazy singleton. Reads `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` from `import.meta.env` (Vite) or `process.env` (CJS/Node) when no args are passed. |
| `resetSupabaseClient()` | function | Clears the cached client. |

> **Note on access control:** this package does not enforce who can sign in. With the default Supabase + Google OAuth setup, any Google user that completes the OAuth flow gets a session. To restrict access, configure it at the Supabase level: disable public sign-ups, write Row Level Security policies on your tables, and/or use Supabase Auth Hooks. See the Supabase auth docs for the recommended approach.

## Repository layout

```
auth-kit/                   # this package — published to npm as @guille-gallo/auth-kit
  src/                      # source (built to dist/ via tsup)
  tests/                    # vitest + @testing-library/react
  dist/                     # build output (gitignored)
  tsup.config.ts
  vitest.config.ts
  eslint.config.js
apps/
  demo/                     # Vite + React 19 demo app — runs against your Supabase
```

This is a pnpm workspace. From the root:

```bash
pnpm install                # installs everything; runs auth-kit's `prepare` (tsup)
pnpm test                   # runs auth-kit's vitest suite
pnpm build                  # builds auth-kit to dist/
pnpm --filter demo dev      # runs the demo on http://localhost:5173
pnpm --filter demo build    # builds the demo to apps/demo/dist/
```

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Watch-build the package with tsup. |
| `pnpm build` | One-shot build of the package. |
| `pnpm test` | Run the vitest suite. |
| `pnpm test:watch` | Vitest in watch mode. |
| `pnpm typecheck` | `tsc --noEmit`. |
| `pnpm lint` | ESLint over `src/`, `tests/`, and config files. |
| `pnpm --filter demo dev` | Start the demo app. |

## License

MIT
