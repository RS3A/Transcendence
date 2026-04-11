import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate, Outlet} from 'react-router-dom'

import AppShell from './components/layout/AppShell/AppShell'
import GlobalLayout from './components/layout/GlobalLayout/GlobalLayout'
import Header from './components/layout/Header/Header'
import Footer from './components/layout/Footer/Footer'
import Home from './pages/Home/Home'
import { Toaster } from './components/common/Toast/Toaster'
import { ChatProvider } from './components/chat/ChatContext/ChatContext'
import Forgot from './pages/auth/Forgot'
import ResetPassword from './pages/auth/ResetPassword'

// Lazy Loading for non-critical pages
const AuthPage = lazy(() => import('./pages/auth/AuthPage'))
const TermsPage = lazy(() => import('./pages/legal/TermsPage'))
const PrivacyPage = lazy(() => import('./pages/legal/PrivacyPage'))
const RegisterPage = lazy(() => import('./pages/register/RegisterPage'))
const RegisterLayout = lazy(() => import('./pages/register/RegisterLayout'))
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'))
const HomeLogged = lazy(() => import('./pages/logged/HomeLogged'))
const BookSessionWithMentor = lazy(() => import('./pages/book-session/BookSessionWithMentor'))
const BookSessionWithMentee = lazy(() => import('./pages/manage-session/ManageSessionWithMentee'))
const MentoriasPage = lazy(() => import('./pages/mentoria/MentoriasPage'))
const MentorDashboard = lazy(() => import('./pages/mentor-dashboard/MentorDashboard'))

function App() {
  return (
    <ChatProvider>
      <Suspense fallback={<div className="loading-state">Carregando...</div>}>
        <Toaster />
        <Routes>

          {/* PUBLIC ROUTES - No sidebar, no chat */}
          <Route
            element={
              <AppShell
                sidebar={null}
                header={<Header isAuthenticated={false} />}
                footer={<Footer />}
              >
                <Outlet />
              </AppShell>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/forgot" element={<Forgot />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          {/* REGISTER ROUTE */}
          <Route element={<RegisterLayout />}>
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* INSTITUCIONAL ROUTES - No sidebar, no chat */}
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          {/* AUTHENTICATED ROUTES - With sidebar & chat via GlobalLayout */}
          <Route element={<GlobalLayout />}>
            <Route path="/home-logged" element={<HomeLogged />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/mentorias" element={<MentoriasPage />} />
            <Route path="/book-session" element={<BookSessionWithMentor />} />
            <Route path="/book-session/:mentorId" element={<BookSessionWithMentor />} />
            <Route path="/manage-session/:menteeId" element={<BookSessionWithMentee />} />
            <Route path="/mentor-dashboard" element={<MentorDashboard />} />
            <Route path="/manage-mentee/:menteeId" element={<BookSessionWithMentor />} />
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </Suspense>
    </ChatProvider>
  )
}

export default App
