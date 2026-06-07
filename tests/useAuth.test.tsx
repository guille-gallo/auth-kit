import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import type { Session } from '@supabase/supabase-js'

type AuthChangeCb = (event: string, session: Session | null) => void

const holders: { client: ReturnType<typeof createMockClient> } = {
  client: createMockClient(),
}

function createMockClient() {
  const listeners: AuthChangeCb[] = []
  return {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn((cb: AuthChangeCb) => {
        listeners.push(cb)
        return { data: { subscription: { unsubscribe: vi.fn() } } }
      }),
      signInWithOAuth: vi.fn().mockResolvedValue({ error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    __listeners: listeners,
  }
}

vi.mock('../src/lib/supabase', () => ({
  getSupabaseClient: vi.fn(() => holders.client),
  resetSupabaseClient: vi.fn(),
}))

import { useAuth } from '../src/hooks/useAuth'

function makeSession(email: string, metadata: Record<string, unknown> = {}): Session {
  return {
    access_token: 'access',
    refresh_token: 'refresh',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: 'bearer',
    user: {
      id: 'user-id-123',
      aud: 'authenticated',
      role: 'authenticated',
      email,
      email_confirmed_at: '',
      phone: '',
      confirmed_at: '',
      last_sign_in_at: '',
      app_metadata: { provider: 'google' },
      user_metadata: metadata,
      identities: [],
      created_at: '',
      updated_at: '',
    },
  } as unknown as Session
}

beforeEach(() => {
  window.history.replaceState({}, '', '/')
  holders.client = createMockClient()
})

describe('useAuth — displayName', () => {
  it('returns full_name from user_metadata when present', async () => {
    holders.client.auth.getSession = vi.fn().mockResolvedValue({
      data: { session: makeSession('alice@example.com', { full_name: 'Alice Smith' }) },
      error: null,
    })

    const { result } = renderHook(() => useAuth())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.displayName).toBe('Alice Smith')
  })

  it('falls back to email local-part when no display name is set', async () => {
    holders.client.auth.getSession = vi.fn().mockResolvedValue({
      data: { session: makeSession('bob@example.com', {}) },
      error: null,
    })

    const { result } = renderHook(() => useAuth())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.displayName).toBe('bob')
  })
})

describe('useAuth — URL error extraction', () => {
  it('captures error_description from the URL and strips it', async () => {
    window.history.replaceState({}, '', '/?error_description=oauth_failed')

    const { result } = renderHook(() => useAuth())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.authError).toBe('oauth_failed')
    expect(window.location.search).not.toContain('error_description')
  })

  it('does not set an error when the URL has no auth error params', async () => {
    window.history.replaceState({}, '', '/')

    const { result } = renderHook(() => useAuth())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.authError).toBeNull()
  })
})

describe('useAuth — signInWithGoogle', () => {
  it('calls supabase.auth.signInWithOAuth with google and the current origin', async () => {
    const { result } = renderHook(() => useAuth())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      await result.current.signInWithGoogle()
    })

    expect(holders.client.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  })
})
