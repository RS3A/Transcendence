import './AppShell.css'

<<<<<<< HEAD
type AppShellProps = {
  sidebar: React.ReactNode
  header: React.ReactNode
  footer: React.ReactNode
  children: React.ReactNode
}
=======
function AppShell({ sidebar, header, footer, children }) {
  const hasAuth = !sidebar
  const hasSidebar = !!sidebar
>>>>>>> 09d7b60121dd6e23fc9048afff60ee2ed85eb8b2

function AppShell({ sidebar, header, footer, children }: AppShellProps) {
  return (
<<<<<<< HEAD
    <div className="app-shell">
      <aside className="sidebar">
        {sidebar}
      </aside>
=======
    <div className={`app-shell ${hasAuth ? 'auth' : ''} ${hasSidebar ? 'with-sidebar' : ''}`}>
      {sidebar && (
        <aside className="sidebar">
          {sidebar}
        </aside>
      )}
>>>>>>> 09d7b60121dd6e23fc9048afff60ee2ed85eb8b2

      <header className="header">
        {header}
      </header>

      <main>
<<<<<<< HEAD
        {children}
=======
        {children || <Outlet />}
>>>>>>> 09d7b60121dd6e23fc9048afff60ee2ed85eb8b2
      </main>

      <footer className="footer">
        {footer}
      </footer>
    </div>
  )
}

export default AppShell