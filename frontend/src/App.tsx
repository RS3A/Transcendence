import AppShell from './components/layout/AppShell/AppShell'
import Sidebar from './components/layout/Sidebar/Sidebar'
import Header from './components/layout/Header/Header'
import Footer from './components/layout/Footer/Footer'
import Home from './pages/Home'
<<<<<<< HEAD

function App() {
  return (
    <AppShell
      sidebar={<Sidebar />}
      header={<Header />}
      footer={<Footer />}
    >
      <Home />
    </AppShell>
=======
import RegisterPage from './pages/register/RegisterPage'
import RegisterLayout from './pages/register/RegisterLayout'
import ProfilePage from './pages/profile/ProfilePage'
import HomeLogged from './pages/logged/HomeLogged'


function App() {
  return (
    <Routes>

      {/* HOME / LOGIN */}
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

      {/* REGISTER */}
      <Route element={<RegisterLayout />}>
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* 🔥 ÁREA LOGADA */}
      <Route
        element={
          <AppShell
            sidebar={null}
            header={<Header isAuthenticated={true} />}
            footer={<Footer />}
          />
        }
      >
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* INSTITUCIONAL */}
      {/* =====================
         HOME LOGGED
      ===================== */}
      <Route path="/home-logged" element={<HomeLogged />} />

      {/* =====================
         INSTITUCIONAL (FORA DO APPSHELL)
      ===================== */}
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
>>>>>>> 09d7b60121dd6e23fc9048afff60ee2ed85eb8b2
  )
}

export default App
