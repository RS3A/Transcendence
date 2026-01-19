import { Outlet } from 'react-router-dom'
import './AppShell.css'

function AppShell({ sidebar, header, footer }) {
  const hasAuth = !sidebar

  return (
    <div className={`app-shell ${hasAuth ? 'auth' : ''}`}>
      {sidebar && (
        <aside className="sidebar">
          {sidebar}
        </aside>
      )}

      <header className="header">
        {header}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        {footer}
      </footer>
    </div>
  )
}

export default AppShell
