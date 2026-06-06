import { Link, Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { Profile } from './pages/Profile'
import { SetupScreen } from './pages/SetupScreen'

function hasSupabaseEnv(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  return typeof url === 'string' && url.length > 0 && typeof key === 'string' && key.length > 0
}

export function App() {
  if (!hasSupabaseEnv()) {
    return <SetupScreen />
  }

  return (
    <div className="demo-shell">
      <header className="demo-header">
        <Link to="/" className="demo-brand">@guille/auth-kit demo</Link>
        <nav className="demo-nav">
          <Link to="/">Home</Link>
          <Link to="/profile">Profile</Link>
        </nav>
      </header>
      <main className="demo-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  )
}
