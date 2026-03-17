import { useState } from 'react'
import { Outlet, useSearchParams } from 'react-router-dom'
import AppShell from '../../components/layout/AppShell/AppShell'
import Header from '../../components/layout/Header/Header'
import Footer from '../../components/layout/Footer/Footer'
import UserHeader from '../../components/layout/UserHeader/UserHeader'
import Avatar from '../../components/common/Avatar/Avatar'
import Button from '../../components/common/Button/Button'
import './HomeLogged.css'

interface PendingRequest {
  id: number
  name: string
  avatar?: string
}

interface ScheduleItem {
  id: number
  time: string
  mentee: string
}

interface Achievement {
  id: number
  title?: string
  icon?: string
}

const mockRequests: PendingRequest[] = [
  { id: 1, name: 'Vítoria' },
  { id: 2, name: 'Vítoria' },
  { id: 3, name: 'Carlos' },
]

const mockSchedule: ScheduleItem[] = [
  { id: 1, time: '08:00h', mentee: 'Mentoria Carla' },
  { id: 2, time: '10:00h', mentee: 'Mentoria Carla' },
  { id: 3, time: '15:00h', mentee: 'Mentoria Carla' },
  { id: 4, time: '19:00h', mentee: 'Mentoria Carla' },
  { id: 5, time: '20:30h', mentee: 'Mentoria Carla' },
]

const mockAchievements: Achievement[] = [
  { id: 1 }, { id: 2 }, { id: 3 },
  { id: 4 }, { id: 5 }, { id: 6 },
]

function HomeLogged() {
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<'pending' | 'notifications'>('pending')

  return (
    <AppShell
      header={<Header isAuthenticated={true} />}
      footer={<Footer />}
    >
      <div className="home-logged">
        
        <UserHeader />

        {/* Main Content */}
        <section className="main-content">

          {/* Left Panel */}
          <div className="left-panel">
            <div className="tab-bar">
              <button
                className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveTab('pending')}
              >
                Solicitações Pendentes
              </button>
              <button
                className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                Notificações
              </button>
            </div>

            <div className="requests-list">
              {activeTab === 'pending' && mockRequests.map((req) => (
                <div key={req.id} className="request-card">
                  <div className="request-avatar">
                    <Avatar />
                  </div>                  
                  <p className="request-text">
                    <strong>{req.name}</strong> solicitou realizar mentoria com você, aceita?
                  </p>
                  <div className="request-actions">
                    <button className="action-btn accept" aria-label="Aceitar">✔</button>
                    <button className="action-btn reject" aria-label="Recusar">✖</button>
                  </div>
                </div>
              ))}
              {activeTab === 'notifications' && (
                <div className="empty-state">Sem novas notificações.</div>
              )}
            </div>
          </div>

          {/* Right Panel - Schedule */}
          <div className="right-panel">
            <h3 className="panel-title">Agenda do Dia</h3>
            <div className="schedule-list">
              {mockSchedule.map((item) => (
                <div key={item.id} className="schedule-item">
                  <span className="schedule-time">
                    <strong>{item.time}</strong> - {item.mentee}
                  </span>
                    <Button 
                    style={{ 
                      backgroundColor: '#E8E6F8', 
                      color: '#5B4FCF',
                      fontWeight: '500'
                    }}
                  >
                    Remarcar
                  </Button>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* Achievements */}
        <section className="achievements-section">
          <h3 className="achievements-title">Conquistas</h3>
          <div className="achievements-grid">
            {mockAchievements.map((a) => (
              <div key={a.id} className="achievement-card" />
            ))}
          </div>
        </section>

      </div>
      {/* <Outlet /> */}
    </AppShell>
  )
}

export default HomeLogged