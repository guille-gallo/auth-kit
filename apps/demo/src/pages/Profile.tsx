import { ProtectedRoute, useAuth } from '@guille/auth-kit'

function SignedInProfile() {
  const { session, user } = useAuth()

  return (
    <section className="demo-card">
      <h1>Profile</h1>
      <dl className="demo-dl">
        <dt>Email</dt>
        <dd>{user?.email ?? '—'}</dd>
        <dt>User ID</dt>
        <dd><code>{user?.id ?? '—'}</code></dd>
        <dt>Provider</dt>
        <dd>{String(user?.app_metadata?.provider ?? '—')}</dd>
        <dt>Access token</dt>
        <dd className="demo-small demo-muted">
          {session?.access_token ? `${session.access_token.slice(0, 24)}…` : '—'}
        </dd>
      </dl>
      <pre className="demo-pre">
{JSON.stringify(user?.user_metadata ?? {}, null, 2)}
      </pre>
    </section>
  )
}

export function Profile() {
  return (
    <ProtectedRoute>
      <SignedInProfile />
    </ProtectedRoute>
  )
}
