import './BookSessionWithMentor.css'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import MentorInfo from '../../components/common/MentorInfo/MentorInfo'
import { MentoringProvider } from '../../components/common/BookingCalendar/MentoringContext'
import { SlotSelector } from '../../components/common/SlotSelector/SlotSelector'
import { SessionList } from '../../components/common/SessionList/SessionList'
import { apiFetch } from '../../services/api'
import { toast } from '../../hooks/use-toast'
import { useChat } from '../../components/chat/ChatContext/ChatContext'
import mentorService, { type MentorDetailData } from '../../services/mentorService'

interface Skill {
  id: string;
  name: string;
}

interface MentorLocationState {
  mentorId?: number;
  mentorName?: string;
  mentorPosition?: string;
  mentorSkills?: Skill[];
  mentorXp?: number;
  mentorAvatar?: string;
  mentorIsActive?: boolean;
  mentorBio?: string;
  mentorRating?: number;
  menteeCount?: number;
}

type ConnectionStatus = 'none' | 'pending' | 'active' | 'loading';

function BookSessionContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mentorId: urlMentorId, menteeId: urlMenteeId } = useParams<{ mentorId?: string, menteeId?: string }>();
  const [selectedMentor, setSelectedMentor] = useState<MentorDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('none');
  const [connectionId, setConnectionId] = useState<number | null>(null);
  const [menteeProfileId, setMenteeProfileId] = useState<number | null>(null);
  const [sessionRefreshKey, setSessionRefreshKey] = useState(0);
  const { setActiveChatId } = useChat();
  
  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const myUserId = currentUserId ? parseInt(currentUserId, 10) : null;

  const mentorState = location.state as MentorLocationState | null;

  useEffect(() => {
    const profileIdFromState = mentorState?.mentorId;
    const parsedProfileId = urlMentorId ? parseInt(urlMentorId, 10) : NaN;
    const profileIdFromUrl = Number.isNaN(parsedProfileId) ? null : parsedProfileId;
    const targetProfileId = profileIdFromState ?? profileIdFromUrl;

    const loadProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!targetProfileId) {
          setError('Nenhum perfil selecionado.');
          setSelectedMentor(null);
          return;
        }

        // Always prefer backend data to keep rating and mentee count persistent.
        const mentorFromApi = await mentorService.getMentorDetails(targetProfileId);
        if (mentorFromApi) {
          setSelectedMentor({
            ...mentorFromApi,
            avatarUrl: mentorFromApi.avatarUrl || mentorState?.mentorAvatar
          });
          return;
        }

        // Fallback for initial navigation if backend data is temporarily unavailable.
        if (mentorState?.mentorId) {
          const mentorFallback: MentorDetailData = {
            id: mentorState.mentorId,
            profileId: mentorState.mentorId,
            name: mentorState.mentorName || 'Mentor',
            position: mentorState.mentorPosition || 'Position',
            skills: mentorState.mentorSkills || [],
            anosExperiencia: mentorState.mentorXp || 0,
            isActive: mentorState.mentorIsActive !== false,
            isAvailable: true,
            avatarUrl: mentorState.mentorAvatar,
            bio: mentorState.mentorBio || undefined,
            rating: mentorState.mentorRating !== undefined ? mentorState.mentorRating : 5,
            menteeCount: mentorState.menteeCount || 0
          };
          setSelectedMentor(mentorFallback);
          return;
        }

        setError('Mentor não encontrado. Por favor, volte à página de mentorias.');
        setSelectedMentor(null);
      } catch (err) {
        console.error('[BookSessionWithMentor] Error loading profile:', err);

        if (mentorState?.mentorId) {
          const mentorFallback: MentorDetailData = {
            id: mentorState.mentorId,
            profileId: mentorState.mentorId,
            name: mentorState.mentorName || 'Mentor',
            position: mentorState.mentorPosition || 'Position',
            skills: mentorState.mentorSkills || [],
            anosExperiencia: mentorState.mentorXp || 0,
            isActive: mentorState.mentorIsActive !== false,
            isAvailable: true,
            avatarUrl: mentorState.mentorAvatar,
            bio: mentorState.mentorBio || undefined,
            rating: mentorState.mentorRating !== undefined ? mentorState.mentorRating : 5,
            menteeCount: mentorState.menteeCount || 0
          };
          setSelectedMentor(mentorFallback);
          return;
        }

        setError('Erro ao carregar o perfil.');
        setSelectedMentor(null);
      } finally {
        setLoading(false);
      }
    };

    if (targetProfileId || urlMenteeId || mentorState?.mentorId) {
      loadProfile();
    } else {
      setError('Nenhum perfil selecionado.');
      setLoading(false);
      setSelectedMentor(null);
    }
  }, [urlMentorId, urlMenteeId, mentorState]);

  // Load current user's profile IDs (MENTOR and MENTORADO)
  useEffect(() => {
    if (!myUserId) return;
    const loadMyProfiles = async () => {
      try {
        const res = await apiFetch(`/users/${myUserId}`);
        if (res.ok) {
          const data = await res.json();
          const profiles: any[] = data.profiles || [];
          
          // Find MENTORADO profile
          const mProfile = profiles.find(p => p.role?.toUpperCase() === 'MENTORADO');
          if (mProfile) {
            setMenteeProfileId(mProfile.id);
          }
          
        }
      } catch (err) {
        console.error('[BookSessionWithMentor] Error loading user profiles:', err);
      }
    };
    loadMyProfiles();
  }, [myUserId]);

  // Load connection status between current user's profile and the target profile
  useEffect(() => {
    if (!menteeProfileId || !selectedMentor) return;

    const loadConnection = async () => {
      const timer = setTimeout(() => setConnectionStatus('none'), 5000);
      setConnectionStatus('loading');
      try {
        const res = await apiFetch(`/mentorship-connections/mentee/${menteeProfileId}`);
        clearTimeout(timer);
        if (!res.ok) { setConnectionStatus('none'); return; }
        const connections = await res.json();
        
        // Filter connections for this mentor, then pick the most relevant one
        // (APPROVED > PENDING), ignoring CANCELLED/ENDED/REJECTED
        const mentorConns = connections.filter(
          (c: { mentorProfileId: number; status: string; id: number }) =>
            Number(c.mentorProfileId) === Number(selectedMentor.profileId)
        );
        const conn =
          mentorConns.find((c: { status: string }) => c.status === 'APPROVED') ||
          mentorConns.find((c: { status: string }) => c.status === 'PENDING') ||
          null;
        if (!conn) {
          setConnectionStatus('none');
        } else if (conn.status === 'APPROVED') {
          setConnectionStatus('active');
          setConnectionId(conn.id);
        } else if (conn.status === 'PENDING') {
          setConnectionStatus('pending');
          setConnectionId(conn.id);
        }
      } catch {
        clearTimeout(timer);
        setConnectionStatus('none');
      }
    };

    loadConnection();
  }, [menteeProfileId, selectedMentor]);

  // If in mentor view, we need to find the connection ID for the action buttons
  useEffect(() => {
    if (!selectedMentor || !myUserId) return;

    const loadMentorConnection = async () => {
      try {
        const res = await apiFetch(`/mentorship-connections/mentor/${myUserId}`);
        if (res.ok) {
          const connections = await res.json();
          const conn = connections.find(
            (c: { menteeProfileId: number; status: string; id: number }) =>
              Number(c.menteeProfileId) === Number(selectedMentor.profileId)
          );
          if (conn && conn.status === 'APPROVED') {
            setConnectionId(conn.id);
            setConnectionStatus('active');
          }
        }
      } catch (err) {
        console.error('[BookSessionWithMentor] Error loading mentor side connection:', err);
      }
    };
    loadMentorConnection();
  }, [selectedMentor, myUserId]);

  const handleConnect = async () => {
    if (!menteeProfileId || !selectedMentor || !selectedMentor.profileId) {
      toast({ title: 'Atenção', description: 'Carregando informações do perfil...' });
      return;
    }
    
    setConnectionStatus('loading');
    try {
      const res = await apiFetch('/mentorship-connections', {
        method: 'POST',
        body: JSON.stringify({ 
          mentorProfileId: selectedMentor.profileId, 
          menteeProfileId: menteeProfileId,
          createdBy: myUserId
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || JSON.stringify(err));
      }
      const conn = await res.json();
      setConnectionId(conn.id);
      setConnectionStatus('pending');
      toast({ title: 'Solicitação enviada!', description: 'Aguarde a aprovação do mentor.' });
    } catch (err) {
      setConnectionStatus('none');
      toast({ title: 'Erro ao solicitar conexão', description: String(err) });
    }
  };

  const handleLeave = async () => {
    if (!connectionId || !myUserId) return;
    setConnectionStatus('loading');
    try {
      const res = await apiFetch(`/mentorship-connections/${connectionId}?userId=${myUserId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      setConnectionStatus('none');
      setConnectionId(null);
      toast({ title: 'Mentoria encerrada', description: 'Você saiu da mentoria com sucesso.' });
    } catch (err) {
      setConnectionStatus('active');
      toast({ title: 'Erro ao sair da mentoria', description: String(err) });
    }
  };

  if (loading) {
    return (
      <div className={styles.bookSessionLoading}>
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error || !selectedMentor) {
    return (
      <div className={styles.bookSessionError}>
        <div className={styles.errorContainer}>
          <div className={styles.errorBox}>
            <h2 className={styles.errorTitle}>Perfil não encontrado</h2>
            <p className={styles.errorMessage}>{error || 'Não conseguimos carregar os dados.'}</p>
            <button
              onClick={() => navigate('/mentorias')}
              className={styles.errorButton}
            >
              ← Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log('[BookSessionContent] Rendering main content with selectedMentor:', selectedMentor);

  // Define Profile IDs for scheduling components
  // If I am the mentor viewing a mentee: mentorId is my Mentor Profile, menteeId is the target profile
  // If I am the mentee viewing a mentor: mentorId is target profile, menteeId is my Mentee Profile
  const schedulerMentorId = (selectedMentor.profileId || selectedMentor.id)?.toString();
  const schedulerMenteeId = (menteeProfileId || myUserId)?.toString();
  
  console.log('[BookSessionContent] schedulerMentorId:', schedulerMentorId, 'schedulerMenteeId:', schedulerMenteeId, 'currentUserId:', currentUserId);

  // Convert connection status to correct type if needed
  const getConnectionStatusValue = (): 'none' | 'pending' | 'active' | 'loading' => {
    if (typeof connectionStatus === 'boolean') {
      return connectionStatus ? 'active' : 'none';
    }
    return connectionStatus;
  };

  return (
    <div className={styles.bookSessionWithMentor}>
        <MentorInfo
          mentorId={selectedMentor.profileId || selectedMentor.id || selectedMentor.userId}
          menteeProfileId={menteeProfileId ?? undefined}
          name={selectedMentor.name}
          position={selectedMentor.position}
          skills={selectedMentor.skills}
          experience={selectedMentor.anosExperiencia}
          isActive={selectedMentor.isActive}
          avatarUrl={selectedMentor.avatarUrl}
          bio={selectedMentor.bio}
          rating={selectedMentor.rating}
          menteeCount={selectedMentor.menteeCount}
          connectionStatus={getConnectionStatusValue()}
          onConnect={handleConnect}
          onLeave={handleLeave}
          onChat={selectedMentor.userId ? () => setActiveChatId(selectedMentor.userId!) : undefined}
        />

      {/* Calendar always visible; booking controls only when connected */}
      <div className={styles.calendarContainer}>
        <SlotSelector
          connected={connectionStatus === 'active'} 
          mentorId={schedulerMentorId || '0'}
          menteeId={schedulerMenteeId || '0'}
          connectionId={connectionId}
          onBooked={() => setSessionRefreshKey(k => k + 1)}
        />
      </div>

      <div className={styles.calendarContainer}>
        <SessionList 
          key={sessionRefreshKey}
          mentorId={schedulerMentorId || '0'}
          menteeId={schedulerMenteeId}
          connectionId={connectionId}
          showHeader={true}
          upcomingOnly={true}
        />
      </div>
    </div>
  );
}

export function BookSessionWithMentor() {
  return (
    <MentoringProvider>
      <BookSessionContent />
    </MentoringProvider>
  )
}

export default BookSessionWithMentor