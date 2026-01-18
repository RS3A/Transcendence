import './AppShell.css'

type AppShellProps = {
  sidebar: React.ReactNode
  header: React.ReactNode
  footer: React.ReactNode
  children: React.ReactNode
}

function AppShell({ sidebar, header, footer, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        {sidebar}
      </aside>

      <header className="header">
        {header}
      </header>

      <main>
        {children}
      </main>

      <footer className="footer">
        {footer}
      </footer>
    </div>
  )
}

export default AppShell