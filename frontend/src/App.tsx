import { Routes, Route, Navigate } from 'react-router-dom'

import AppShell from './components/layout/AppShell/AppShell'
import Header from './components/layout/Header/Header'
import Footer from './components/layout/Footer/Footer'
import Sidebar from './components/layout/Sidebar/Sidebar'

import AuthPage from './pages/auth/AuthPage'
import TermsPage from './pages/legal/TermsPage'
import PrivacyPage from './pages/legal/PrivacyPage'
import Home from './pages/Home'

function App() {
  return (
    <Routes>
      {/* =====================
         AUTH ROUTES (Layout com Header + Footer)
      ===================== */}
      <Route
        element={
          <AppShell
            sidebar={null}
            header={<Header />}
            footer={<Footer />}
          />
        }
      >
        <Route path="/login" element={<AuthPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Route>

      {/* =====================
         APP ROUTES (Com Sidebar)
      ===================== */}
      <Route
        element={
          <AppShell
            sidebar={<Sidebar />}
            header={<Header />}
            footer={<Footer />}
          />
        }
      >
        <Route path="/home" element={<Home />} />
      </Route>

      {/* =====================
         FALLBACK
      ===================== */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App
