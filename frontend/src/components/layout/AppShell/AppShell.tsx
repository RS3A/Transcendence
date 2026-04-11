import { Outlet } from 'react-router-dom'
import styles from './AppShell.module.css'

function AppShell({ sidebar, header, footer, children }) {
  const hasAuth = !sidebar
  const hasSidebar = !!sidebar

  return (
    <div className={`app-shell ${hasAuth ? 'auth' : ''} ${hasSidebar ? 'with-sidebar' : ''}`}>
      {sidebar && (
        <aside className={styles.sidebar}>
          {sidebar}
        </aside>
      )}

      <header>
        {header}
      </header>

      <main>
        {children || <Outlet />}
      </main>

      <footer className={styles.footer}>
        {footer}
      </footer>
    </div>
  )
}

export default AppShell
