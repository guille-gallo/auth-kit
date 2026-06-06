import { useAuth } from '@guille/auth-kit'

export function SetupScreen() {
  return (
    <main className="setup-shell">
      <section className="setup-card">
        <h1>Supabase credentials required</h1>
        <p>
          Create a <code>apps/demo/.env</code> file with the following
          variables, then restart the dev server.
        </p>
        <pre>
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key`}
        </pre>
        <p className="setup-hint">
          You can find these in the Supabase dashboard under
          <em> Project Settings → API</em>.
        </p>
      </section>
    </main>
  )
}

export function useDemoAuth() {
  return useAuth()
}
