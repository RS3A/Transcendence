import { useState } from 'react'
import { Check, X, User } from 'lucide-react'
import Button from '../Button/Button'
import './Requests.css'

export interface PendingRequest {
  id: number
  name: string
  avatar?: string
}

interface RequestsProps {
  userRole: 'MENTOR' | 'MENTEE'
  mentorRequests?: PendingRequest[]
  menteeAcceptedRequests?: PendingRequest[]
  onAccept?: (id: number) => void
  onDecline?: (id: number) => void
}

// --- Main Requests Component ---

export const Requests = ({
  userRole,
  mentorRequests = [],
  menteeAcceptedRequests = [],
  onAccept,
  onDecline,
}: RequestsProps) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'notifications'>('pending')

  return (
    <div className={styles.leftPanel}>
      <div className={styles.tabBar}>
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

      <div className={styles.requestsList}>
        {activeTab === 'pending' && (
          <PendingRequests
            userRole={userRole}
            mentorRequests={mentorRequests}
            menteeAcceptedRequests={menteeAcceptedRequests}
            onAccept={onAccept}
            onDecline={onDecline}
          />
        )}
        {activeTab === 'notifications' && (
          <Notifications />
        )}
      </div>
    </div>
  )
}

// --- Pending Requests Component ---

interface PendingRequestsProps {
  userRole: 'MENTOR' | 'MENTEE'
  mentorRequests: PendingRequest[]
  menteeAcceptedRequests: PendingRequest[]
  onAccept?: (id: number) => void
  onDecline?: (id: number) => void
}

export const PendingRequests = ({
  userRole,
  mentorRequests,
  menteeAcceptedRequests,
  onAccept,
  onDecline,
}: PendingRequestsProps) => {
  const requests = userRole === 'MENTOR' ? mentorRequests : menteeAcceptedRequests
  const showActions = userRole === 'MENTOR'

  if (requests.length === 0) {
    return <div className={styles.emptyState}>Sem novas solicitações.</div>
  }

  return (
    <>
      {requests.map((req) => (
        <RequestCard
          key={req.id}
          request={req}
          showActions={showActions}
          onAccept={() => onAccept?.(req.id)}
          onDecline={() => onDecline?.(req.id)}
        />
      ))}
    </>
  )
}

// --- Request Card Component ---

interface RequestCardProps {
  request: PendingRequest
  showActions: boolean
  onAccept: () => void
  onDecline: () => void
}

export const RequestCard = ({
  request,
  showActions,
  onAccept,
  onDecline,
}: RequestCardProps) => {
  const getMessage = () => {
    if (showActions) {
      return (
        <>
          <strong>{request.name}</strong> solicitou realizar mentoria. Aceita?
        </>
      )
    }
    return (
      <>
        <strong>{request.name}</strong> aceitou sua solicitação de mentoria!
      </>
    )
  }

  return (
    <div className={styles.requestCard}>
      <div className={styles.requestAvatar}>
        {request.avatar ? (
          <img 
            src={request.avatar} 
            alt={request.name}
            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <User size={20} color="#9ca3af" />
        )}
      </div>
      <p className={styles.requestText}>{getMessage()}</p>
      {showActions && (
        <div className={styles.requestActions}>
          <Button
            onClick={onAccept}
            className={styles.iconButton}
            aria-label="Accept"
          >
            <Check size={18} color="green" />
          </Button>
          <Button
            onClick={onDecline}
            className={styles.iconButton}
            aria-label="Decline"
          >
            <X size={18} color="red" />
          </Button>
        </div>
      )}
    </div>
  )
}

// --- Notifications Component ---

export const Notifications = () => {
  return <div className={styles.emptyState}>Sem novas notificações.</div>
}

export default Requests
