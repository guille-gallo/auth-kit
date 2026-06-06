import { describe, it, expect, vi, beforeEach } from 'vitest'

const holders: { client: ReturnType<typeof createMockClient> } = {
  client: createMockClient(),
}

function createMockClient() {
  const listeners: Array<(event: string, session: unknown) => void> = []
  return {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn((cb: (event: string, session: unknown) => void) => {
        listeners.push(cb)
        return { data: { subscription: { unsubscribe: vi.fn() } } }
      }),
      signInWithOAuth: vi.fn().mockResolvedValue({ error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    __listeners: listeners,
  }
}

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => createMockClient()),
}))

import { createClient } from '@supabase/supabase-js'

beforeEach(() => {
  vi.resetModules()
  vi.mocked(createClient).mockClear()
  holders.client = createMockClient()
})

describe('getSupabaseClient', () => {
  it('returns the same instance on repeated calls (singleton)', async () => {
    const { getSupabaseClient } = await import('../src/lib/supabase')
    const a = getSupabaseClient('https://x.supabase.co', 'anon-key')
    const b = getSupabaseClient('https://x.supabase.co', 'anon-key')
    expect(a).toBe(b)
    expect(createClient).toHaveBeenCalledTimes(1)
  })

  it('throws a descriptive error when neither args nor env are provided', async () => {
    const { getSupabaseClient } = await import('../src/lib/supabase')
    expect(() => getSupabaseClient()).toThrow(/Missing Supabase credentials/)
  })

  it('accepts explicit url and anonKey and forwards them to createClient', async () => {
    const { getSupabaseClient } = await import('../src/lib/supabase')
    const client = getSupabaseClient('https://explicit.supabase.co', 'explicit-anon')
    expect(client).toBeDefined()
    expect(createClient).toHaveBeenCalledWith('https://explicit.supabase.co', 'explicit-anon')
  })
})

describe('resetSupabaseClient', () => {
  it('clears the cache so a new client instance is created on the next call', async () => {
    const mod = await import('../src/lib/supabase')
    const a = mod.getSupabaseClient('https://x.supabase.co', 'k')
    mod.resetSupabaseClient()
    const b = mod.getSupabaseClient('https://x.supabase.co', 'k')
    expect(a).not.toBe(b)
    expect(createClient).toHaveBeenCalledTimes(2)
  })
})
