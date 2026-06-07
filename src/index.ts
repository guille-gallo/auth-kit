// ── Public API ───────────────────────────────────────

export { getSupabaseClient, resetSupabaseClient } from './lib/supabase.js'
export { useAuth } from './hooks/useAuth.js'
export type { UseAuthReturn } from './hooks/useAuth.js'
export { AuthScreen, ProtectedRoute, AuthGate } from './components/AuthScreen.js'