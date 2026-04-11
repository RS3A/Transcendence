import React, { useMemo, useEffect, useState } from "react";
import { Clock, Video, RefreshCw, ExternalLink, X } from "lucide-react";
import "./SessionList.css";
import { format, parseISO, isPast, isWithinInterval, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { apiFetch } from '../../../services/api';
import Button from '../Button/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../Dialog/Dialog';

interface Session {
  id: number;
  connectionId: number;
  scheduledDate: string;
  durationMinutes: number;
  meetUrl: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'NO_SHOW' | 'CANCELLED';
  isRecurrent: boolean;
  recurrenceIndex?: number;
  recurrenceGroupId?: string;
  menteeMissed?: boolean;
  mentorNotes?: string;
}

type SessionListProps = {
  mentorId: string;
  menteeId?: string;
  connectionId?: number | null;
  showHeader?: boolean;
  upcomingOnly?: boolean;
  daysLimit?: number;
  emptyStateMessage?: string;
};

const statusConfig: Record<string, { label: string; className: string }> = {
  SCHEDULED: { label: 'Agendada', className: 'badge-scheduled' },
  COMPLETED: { label: 'Realizada', className: 'badge-completed' },
  RESCHEDULED: { label: 'Reagendada', className: 'badge-rescheduled' },
  NO_SHOW: { label: 'No-show', className: 'badge-no-show' },
  CANCELLED: { label: 'Cancelada', className: 'badge-cancelled' },
};

const SessionItem: React.FC<{ session: Session; onCancelClick: (session: Session) => void }> = ({ session, onCancelClick }) => {
  const { status, isRecurrent, recurrenceIndex } = session;
  const isFuture = !isPast(parseISO(session.scheduledDate));
  const config = statusConfig[status] || { label: status, className: 'badge-scheduled' };

  const startTime = format(parseISO(session.scheduledDate), 'HH:mm');
  const endTime = format(
    new Date(new Date(session.scheduledDate).getTime() + session.durationMinutes * 60000),
    'HH:mm'
  );

  return (
    <div className={styles.sessionItem}>
      <div className={styles.sessionDate}>
        <span className={styles.sessionDateDay}>{format(parseISO(session.scheduledDate), 'dd')}</span>
        <span className={styles.sessionDateMonth}>{format(parseISO(session.scheduledDate), 'MMM', { locale: ptBR })}</span>
      </div>

      <div className={styles.sessionDetails}>
        <div className={styles.sessionTime}>{startTime} – {endTime}</div>
        <div className={styles.sessionStatus}>
          <span className={`session-status-badge ${config.className}`}>{config.label}</span>
          {isRecurrent && recurrenceIndex && (
            <div className={styles.sessionStatusIconContainer}>
              <RefreshCw className={styles.sessionStatusIcon} />
              <span>{recurrenceIndex}/10</span>
            </div>
          )}
        </div>
      </div>

      {isFuture && status === 'SCHEDULED' && session.meetUrl && (
        <div className={styles.sessionActions}>
          <a href={session.meetUrl} target="_blank" rel="noopener noreferrer" className={styles.sessionActionButton}>
            <Video className={styles.meetButtonIcon} />
            <span>Meet</span>
            <ExternalLink className={styles.rescheduleButtonIcon} />
          </a>
          <button 
            className={styles.sessionActionButton}
            onClick={() => onCancelClick(session)}
          >
            <RefreshCw className={styles.rescheduleButtonIcon} />
            <span>Cancelar</span>
          </button>
        </div>
      )}
    </div>
  );
};

export function SessionList({ 
  mentorId, 
  menteeId, 
  connectionId,
  showHeader = true,
  upcomingOnly = false,
  daysLimit = 14,
  emptyStateMessage = 'Não há mentorias marcadas'
}: SessionListProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cancelDialogSession, setCancelDialogSession] = useState<Session | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCancelConfirm = async () => {
    if (!cancelDialogSession) return;
    try {
      setIsDeleting(true);
      const response = await apiFetch(`/mentorship-sessions/${cancelDialogSession.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCancelDialogSession(null);
        window.location.reload();
      } else {
        console.error('Failed to cancel session:', response.status);
        alert('Erro ao cancelar a sessão. Tente novamente.');
      }
    } catch (error) {
      console.error('Error canceling session:', error);
      alert('Erro ao cancelar a sessão. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        
        let url = '';
        // Best way: check by connection
        if (connectionId && connectionId !== 0) {
          url = upcomingOnly 
            ? `/mentorship-sessions/connection/${connectionId}/upcoming`
            : `/mentorship-sessions/connection/${connectionId}`;
        } 
        // Fallbacks
        else if (mentorId && mentorId.toString().match(/^\d+$/)) {
          url = `/mentorship-sessions/mentor/${mentorId}`;
        } else if (menteeId && menteeId.toString().match(/^\d+$/)) {
          url = `/mentorship-sessions/mentee/${menteeId}`;
        }
        
        if (!url) {
          setSessions([]);
          setLoading(false);
          return;
        }

        console.log(`[SessionList] Fetching sessions from: ${url}`);
        const response = await apiFetch(url);
        
        if (response.ok) {
          const data = await response.json();
          setSessions(Array.isArray(data) ? data : []);
          setError(null);
        } else {
          console.warn(`[SessionList] Failed to fetch sessions: HTTP ${response.status}`);
          setSessions([]);
        }
      } catch (err) {
        console.error('[SessionList] Erro ao carregar sessões:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar sessões');
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    if (mentorId || menteeId || connectionId) {
      fetchSessions();
    }
  }, [mentorId, menteeId, connectionId, upcomingOnly]);

  const filteredSessions = useMemo(() => {
    let filtered = sessions;

    if (upcomingOnly) {
      const now = new Date();
      const futureDate = addDays(now, daysLimit);

      filtered = filtered.filter(s => {
        const sessionDate = parseISO(s.scheduledDate);
        return isWithinInterval(sessionDate, { start: now, end: futureDate }) && s.status === 'SCHEDULED';
      });
    }

    return filtered;
  }, [sessions, upcomingOnly, daysLimit]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#666', fontSize: '0.95rem' }}>
        Carregando sessões...
      </div>
    );
  }

  if (error && sessions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#c00', fontSize: '0.95rem' }}>
        {error}
      </div>
    );
  }

  if (filteredSessions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#666', fontSize: '0.95rem' }}>
        {emptyStateMessage}
      </div>
    );
  }

  const completedCount = filteredSessions.filter(s => s.status === 'COMPLETED').length;
  const upcomingSessions = filteredSessions.filter(s => !isPast(parseISO(s.scheduledDate)) && s.status !== 'COMPLETED' && s.status !== 'NO_SHOW');
  const pastSessions = filteredSessions.filter(s => isPast(parseISO(s.scheduledDate)) || s.status === 'COMPLETED' || s.status === 'NO_SHOW');

  return (
    <>
      {showHeader && (
        <div className={styles.sessionListHeader}>
          <div className={styles.sessionListTitleContainer}>
            <Clock className={styles.sessionListTitleIcon} />
            <h2 className={styles.sessionListTitle}>Histórico de Sessões</h2>
          </div>
          <span className={styles.sessionListBadge}>
            {completedCount} mentoria(s) realizada(s)
          </span>
        </div>
      )}

      {upcomingSessions.length > 0 && (
        <div>
          {showHeader && <h3 className={styles.sessionListSectionTitle}>PRÓXIMAS</h3>}
          {upcomingSessions.map((session) => (
            <SessionItem key={session.id} session={session} onCancelClick={setCancelDialogSession} />
          ))}
        </div>
      )}

      {showHeader && pastSessions.length > 0 && (
        <div>
          <h3 className={styles.sessionListSectionTitle}>ANTERIORES</h3>
          {pastSessions.map((session) => (
            <SessionItem key={session.id} session={session} onCancelClick={setCancelDialogSession} />
          ))}
        </div>
      )}

      <Dialog open={!!cancelDialogSession} onOpenChange={(open) => !isDeleting && setCancelDialogSession(open ? cancelDialogSession : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atenção! Esta ação irá cancelar sua sessão</DialogTitle>
            <DialogDescription>
              Tem certeza de que quer continuar?
            </DialogDescription>
          </DialogHeader>
          <div className={styles.attentionBox}>
            <p>Não se esqueça de entrar em contato com seu mentor/mentorado para remarcar essa sessão.</p>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setCancelDialogSession(null)}
              disabled={isDeleting}
              className={styles.cancelButton}
              style={{ backgroundColor: 'transparent', color: '#666', border: '1px solid #ccc' }}
            >
              Não
            </Button>
            <Button 
              onClick={handleCancelConfirm}
              disabled={isDeleting}
              className={styles.confirmButton}
              style={{ backgroundColor: '#e53e3e', color: 'white' }}
            >
              {isDeleting ? 'Cancelando...' : 'Sim, cancelar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
