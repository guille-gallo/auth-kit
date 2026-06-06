import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

function readEnv(key: string): string | undefined {
  if (typeof import.meta !== 'undefined') {
    const env = (import.meta as { env?: Record<string, unknown> }).env
    if (env && typeof env === 'object' && key in env) {
      const value = env[key]
      if (typeof value === 'string' && value) return value
    }
  }
  if (typeof process !== 'undefined' && process.env && key in process.env) {
    const value = process.env[key]
    if (typeof value === 'string' && value) return value
  }
  return undefined
}

/**
 * Create or retrieve the Supabase client singleton.
 *
 * In Vite projects, pass nothing — it reads VITE_SUPABASE_URL
 * and VITE_SUPABASE_ANON_KEY from import.meta.env automatically.
 *
 * In non-Vite contexts (Node, CJS bundlers), pass the URL and anon key
 * directly, or set VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY on process.env.
 */
export function getSupabaseClient(
  url?: string,
  anonKey?: string,
): SupabaseClient {
  if (_client) return _client

  const supabaseUrl = url ?? readEnv('VITE_SUPABASE_URL')
  const supabaseAnonKey = anonKey ?? readEnv('VITE_SUPABASE_ANON_KEY')

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env, or pass url and anonKey to getSupabaseClient().',
    )
  }

  _client = createClient(supabaseUrl, supabaseAnonKey)
  return _client
}

/**
 * Reset the cached client (useful for testing or hot-reload edge cases).
 */
export function resetSupabaseClient(): void {
  _client = null
}
