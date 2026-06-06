import { Link } from 'react-router-dom'
import { AuthGate, useAuth } from '@guille/auth-kit'

function SignedInHome() {
  const { session, displayName, signOut, user } = useAuth()

  return (
    <section className="demo-card">
      <h1>Welcome{displayName ? `, ${displayName}` : ''}</h1>
      <p className="demo-muted">
        You are signed in as <strong>{user?.email}</strong>.
      </p>
      <div className="demo-actions">
        <Link to="/profile" className="demo-btn demo-btn-primary">View profile</Link>
        <button type="button" className="demo-btn" onClick={signOut}>
          Sign out
        </button>
      </div>
      <p className="demo-muted demo-small">
        Session expires at{' '}
        {session?.expires_at
          ? new Date(session.expires_at * 1000).toLocaleString()
          : '—'}
      </p>
    </section>
  )
}

export function Home() {
  return (
    <AuthGate>
      <SignedInHome />
    </AuthGate>
  )
}
