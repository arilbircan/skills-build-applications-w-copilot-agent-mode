import { Link, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <div className="min-vh-100 bg-light">
      <header className="navbar navbar-expand bg-white border-bottom">
        <div className="container">
          <Link className="navbar-brand fw-semibold" to="/">OctoFit Tracker</Link>
          <nav className="navbar-nav flex-row gap-3" aria-label="Main navigation">
            <Link className="nav-link" to="/">Dashboard</Link>
            <Link className="nav-link" to="/activities">Activities</Link>
            <Link className="nav-link" to="/teams">Teams</Link>
          </nav>
        </div>
      </header>
      <main className="container py-5">
        <Routes>
          <Route path="/" element={<h1 className="h2">Your fitness dashboard</h1>} />
          <Route path="/activities" element={<h1 className="h2">Activities</h1>} />
          <Route path="/teams" element={<h1 className="h2">Teams</h1>} />
          <Route path="*" element={<h1 className="h2">Page not found</h1>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
