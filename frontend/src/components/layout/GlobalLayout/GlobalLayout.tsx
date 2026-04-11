import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../Sidebar/Sidebar'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import { ChatWindow } from '../../chat/ChatWindow/ChatWindow'
import AppShell from '../AppShell/AppShell'
import styles from '../AppShell/AppShell.module.css';import Chatbar from '../../chat/Chatbar/Chatbar'

function GlobalLayout() {
  return (
    <AppShell
      sidebar={null}
      header={<Header isAuthenticated={true} />}
      footer={<Footer />}
    >
      <Chatbar />
      <Outlet />
      <ChatWindow />
    </AppShell>
  )
}

export default GlobalLayout
