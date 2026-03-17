import { Routes, Route, Navigate} from 'react-router-dom'

import AppShell from './components/layout/AppShell/AppShell'
import Header from './components/layout/Header/Header'
import Footer from './components/layout/Footer/Footer'
import AuthPage from './pages/auth/AuthPage'
import TermsPage from './pages/legal/TermsPage'
import PrivacyPage from './pages/legal/PrivacyPage'
import Home from './pages/Home'
import RegisterPage from './pages/register/RegisterPage'
import RegisterLayout from './pages/register/RegisterLayout'


function App() {
  return (
    <Routes>
      {/* =====================
         HOME / LOGIN (SEM SIDEBAR)
      ===================== */}
      <Route
        element={
          <AppShell
            sidebar={null}
            header={<Header isAuthenticated={false} />}
            footer={<Footer />}
          />
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthPage />} />
      </Route>


      {/* REGISTER (SIDEBAR DINÂMICA) */}
      <Route element={<RegisterLayout />}>
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* =====================
         INSTITUCIONAL (FORA DO APPSHELL)
      ===================== */}
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />

      {/* =====================
         FALLBACK
      ===================== */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
