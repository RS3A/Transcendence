import { Outlet, useSearchParams } from 'react-router-dom'
import AppShell from '../../components/layout/AppShell/AppShell'
import Header from '../../components/layout/Header/Header'
import Footer from '../../components/layout/Footer/Footer'

import RegisterSidebarMentorado from '../../components/layout/Sidebar/RegisterSidebar-mentorado'
import RegisterSidebarMentor from '../../components/layout/Sidebar/RegisterSidebar-mentor'

function RegisterLayout() {
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type')

  const sidebar =
    type === 'mentor'
      ? <RegisterSidebarMentor />
      : <RegisterSidebarMentorado />

  return (
    <AppShell
      sidebar={sidebar}
      header={<Header isAuthenticated={false} />}
      footer={<Footer />}
    >
      <Outlet />
    </AppShell>
  )
}

export default RegisterLayout