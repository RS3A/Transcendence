type AppShellProps = {
  sidebar: React.ReactNode
  header: React.ReactNode
  children: React.ReactNode
}

function AppShell({ sidebar, header, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <div style={{ gridArea: 'sidebar' }}>
        {sidebar}
      </div>

      <div style={{ gridArea: 'header' }}>
        {header}
      </div>

      <main style={{ gridArea: 'main' }}>
        {children}
      </main>
    </div>
  )
}

export default AppShell