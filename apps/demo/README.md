# @guille/auth-kit demo

A minimal Vite + React 19 app that consumes the local `@guille/auth-kit` package via the pnpm workspace.

## Run locally

From the workspace root:

```bash
pnpm install
pnpm --filter demo dev
```

Then open <http://localhost:5173>.

## Configure Supabase

Copy `.env.example` to `.env` in this directory and fill in your project URL and anon key:

```bash
cp apps/demo/.env.example apps/demo/.env
```

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Restart `pnpm dev` after editing.

## What it exercises

| Route | Component | Demonstrates |
|---|---|---|
| `/` | `AuthGate` | Whole-app gating. While unauthenticated, renders the default `AuthScreen` (Google sign-in). After sign-in, shows a welcome card with `displayName`, `signOut`, and the session expiry. |
| `/profile` | `ProtectedRoute` | Route-level guarding. Shows the user's email, ID, provider, and `user_metadata` JSON. |

## Build

```bash
pnpm --filter demo build
```

Output goes to `apps/demo/dist/`.

## Deploy

The `vercel.json` configures Vercel to build from the workspace root and serve from `apps/demo/dist`. Set `Root Directory` to the repo root and the framework to "Other" in the Vercel dashboard, or rely on the `buildCommand` and `outputDirectory` in `vercel.json`.
