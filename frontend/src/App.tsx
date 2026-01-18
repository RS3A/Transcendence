import AppShell from './components/layout/AppShell/AppShell'
import Sidebar from './components/layout/Sidebar/Sidebar'
import Header from './components/layout/Header/Header'
import Footer from './components/layout/Footer/Footer'
import Home from './pages/Home'

function App() {
  return (
    <AppShell
      sidebar={<Sidebar />}
      header={<Header />}
      footer={<Footer />}
    >
      <Home />
    </AppShell>
  )
}

export default App
