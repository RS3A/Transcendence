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
        {/* =====================
           HOME / LOGIN (PÚBLICO)
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

        {/* REGISTER */}
        <Route element={<RegisterLayout />}>
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* =====================
           ÁREA LOGADA (COM SIDEBAR DE CHAT)
        ===================== */}
        <Route
          element={
            <AppShell
              // Injetamos a Sidebar de Chat aqui para que apareça no layout
              sidebar={<ChatSidebar />} 
              header={<Header isAuthenticated={true} />}
              footer={<Footer />}
            />
          }
        >
          <Route path="/profile" element={<ProfilePage />} />
          {/* Movi Home Logged e Mentorias para dentro do AppShell com Sidebar */}
          <Route path="/home-logged" element={<HomeLogged />} />
          <Route path="/mentorias" element={<MentoriasPage />} />
        </Route>

        {/* =====================
           INSTITUCIONAL (SEM SIDEBAR)
        ===================== */}
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

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* A Janela de Chat fica fora das Routes, mas dentro do Provider. 
          Ela só aparecerá quando activeChatId não for null (lógica interna do componente).
      */}
      {isAuthenticated && <ChatWindow />}
      
    </ChatProvider>
  )
}

export default App