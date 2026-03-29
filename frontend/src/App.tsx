import { Routes, Route, Navigate } from 'react-router-dom'

import AppShell from './components/layout/AppShell/AppShell'
import Header from './components/layout/Header/Header'
import Footer from './components/layout/Footer/Footer'
import AuthPage from './pages/auth/AuthPage'
import TermsPage from './pages/legal/TermsPage'
import PrivacyPage from './pages/legal/PrivacyPage'
import Home from './pages/Home'
import RegisterPage from './pages/register/RegisterPage'
import RegisterLayout from './pages/register/RegisterLayout'
import ProfilePage from './pages/profile/ProfilePage'
import HomeLogged from './pages/logged/HomeLogged'
import MentoriasPage from './pages/mentoria/MentoriasPage'

// Importações do Chat (Corrigindo o erro de digitação 'Import')
import { ChatProvider } from './chat/ChatContext/ChatContext'
import { ChatWindow } from './chat/ChatWindow/ChatWindow'
import { Sidebar as ChatSidebar } from './chat/Sidebar/Sidebar'

function App() {
  // Dica: Você pode validar se o usuário está logado aqui para decidir 
  // se exibe ou não o ChatWindow globalmente
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <ChatProvider>
  <Routes>
    {/* --- GRUPO PÚBLICO --- */}
    <Route
      element={
        <AppShell
          sidebar={null} // Sem sidebar no login/home
          header={<Header isAuthenticated={false} />}
          footer={<Footer />}
        />
      }
    >
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<AuthPage />} />
    </Route>

    {/* --- GRUPO LOGADO (Onde o Chat vive) --- */}
    <Route
      element={
        <AppShell
          sidebar={<ChatSidebar />} // Sidebar de chat injetada AQUI
          header={<Header isAuthenticated={true} />}
          footer={<Footer />}
        />
      }
    >
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/home-logged" element={<HomeLogged />} />
      <Route path="/mentorias" element={<MentoriasPage />} />
    </Route>

    {/* --- INSTITUCIONAL (Sem Sidebar) --- */}
    <Route
      element={
        <AppShell
          sidebar={null}
          header={<Header isAuthenticated={isAuthenticated} />}
          footer={<Footer />}
        />
      }
    >
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
    </Route>

    <Route path="*" element={<Navigate to="/" />} />
  </Routes>

  {/* O ChatWindow flutua, não afeta o layout do Header */}
  <ChatWindow />
</ChatProvider>
  )
}

export default App