import './ManageSessionWithMentee.css'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { MentoringProvider } from '../../components/common/BookingCalendar/MentoringContext'
import { SessionList } from '../../components/common/SessionList/SessionList'
import MenteeInfo from '../../components/common/MenteeInfo/MenteeInfo'
import { apiFetch } from '../../services/api'
import { toast } from '../../hooks/use-toast'
import { useChat } from '../../components/chat/ChatContext/ChatContext'
import menteeService, { type MenteeDetailData } from '../../services/menteeService'

interface Skill {
  id: string;
  name: string;
}

interface MenteeLocationState {
  menteeId?: number;
  menteeName?: string;
  menteePosition?: string;
  menteeSkills?: Skill[];
  menteeXp?: number;
  menteeAvatar?: string;
  menteeIsActive?: boolean;
  menteeBio?: string;
}

type ConnectionStatus = 'none' | 'pending' | 'active' | 'loading';

function ManageSessionContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { menteeId: urlMenteeId } = useParams<{ menteeId: string }>();
  const [selectedMentee, setSelectedMentee] = useState<MenteeDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('none');
  const [connectionId, setConnectionId] = useState<number | null>(null);
  const [mentorProfileId, setMentorProfileId] = useState<number | null>(null);
  const [sessionRefreshKey, setSessionRefreshKey] = useState(0);
  const { setActiveChatId } = useChat();
  
  // Get current user ID from localStorage (authenticated mentor)
  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const myUserId = currentUserId ? parseInt(currentUserId, 10) : null;
  const menteeState = location.state as MenteeLocationState | null;

  useEffect(() => {
    const loadMenteeData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Priority 1: Load from location state (passed from previous page)
        if (menteeState?.menteeId) {
          const mentee: MenteeDetailData = {
            id: menteeState.menteeId,
            profileId: menteeState.menteeId,
            userId: menteeState.menteeId,
            name: menteeState.menteeName || 'Mentee',
            position: menteeState.menteePosition || 'Position',
            skills: menteeState.menteeSkills || [],
            anosExperiencia: menteeState.menteeXp || 0,
            isActive: menteeState.menteeIsActive !== false,
            isAvailable: true,
            avatarUrl: menteeState.menteeAvatar,
            bio: menteeState.menteeBio || undefined,
          };
          setSelectedMentee(mentee);
          setLoading(false);
          return;
        }

        // Priority 2: Load from URL parameter
        if (urlMenteeId) {
          const menteeId = parseInt(urlMenteeId, 10);
          if (!isNaN(menteeId)) {
            const mentee = await menteeService.getMenteeDetails(menteeId);
            if (mentee) {
              setSelectedMentee(mentee);
              setLoading(false);
              return;
            } else {
              setError('Mentorado não encontrado. Por favor, volte à página anterior.');
              setLoading(false);
              return;
            }
          }
        }

        // No valid data source
        setError('Nenhum perfil selecionado.');
        setLoading(false);
      } catch (err) {
        console.error('[ManageSessionWithMentee] Error loading mentee data:', err);
        setError('Erro ao carregar o perfil.');
        setLoading(false);
      }
    };

    loadMenteeData();
  }, [urlMenteeId, menteeState]);

// Load current user's profile IDs (MENTOR and MENTORADO)
useEffect(() => {
  if (!myUserId) return;
  const loadMyProfiles = async () => {
    try {
      const res = await apiFetch(`/users/${myUserId}`);
      if (res.ok) {
        const data = await res.json();
        const profiles: any[] = data.profiles || [];

        // Find MENTOR profile
        const mentorProfile = profiles.find(p => p.role?.toUpperCase() === 'MENTOR');
        if (mentorProfile) {
          console.log('[ManageSessionWithMentee] Found Mentor Profile ID:', mentorProfile.id);
          setMentorProfileId(mentorProfile.id);
        }
      }
    } catch (err) {
      console.error('[ManageSessionWithMentee] Error loading user profiles:', err);
    }
  };
  loadMyProfiles();
}, [myUserId]);

// Load connection status between current user's profile and the target profile
useEffect(() => {
  if (!mentorProfileId || !selectedMentee) return;

  const loadConnection = async () => {
    const timer = setTimeout(() => setConnectionStatus('none'), 5000);
    setConnectionStatus('loading');
    try {
      const res = await apiFetch(`/mentorship-connections/mentor/${mentorProfileId}`);
      clearTimeout(timer);
      if (!res.ok) { setConnectionStatus('none'); return; }
      const connections = await res.json();
      
      const conn = connections.find(
        (c: { menteeProfileId: number; status: string; id: number }) =>
          Number(c.menteeProfileId) === Number(selectedMentee.profileId)
      );
      if (!conn) {
        setConnectionStatus('none');
      } else if (conn.status === 'APPROVED') {
        setConnectionStatus('active');
        setConnectionId(conn.id);
      } else if (conn.status === 'PENDING') {
        setConnectionStatus('pending');
        setConnectionId(conn.id);
      } else {
        setConnectionStatus('none');
      }
    } catch {
      clearTimeout(timer);
      setConnectionStatus('none');
    }
  };

  loadConnection();
}, [mentorProfileId, selectedMentee]);

// If in mentor view, we need to find the connection ID for the action buttons
useEffect(() => {
  if (!selectedMentee || !myUserId) return;

  const loadMentorConnection = async () => {
    try {
      const res = await apiFetch(`/mentorship-connections/mentor/${myUserId}`);
      if (res.ok) {
        const connections = await res.json();
        const conn = connections.find(
          (c: { menteeProfileId: number; status: string; id: number }) =>
            Number(c.menteeProfileId) === Number(selectedMentee.profileId)
        );
        if (conn && conn.status === 'APPROVED') {
          setConnectionId(conn.id);
          setConnectionStatus('active');
        }
      }
    } catch (err) {
      console.error('[ManageSessionWithMentee] Error loading mentor side connection:', err);
    }
  };
  loadMentorConnection();
}, [selectedMentee, myUserId]);

const handleConnect = async () => {
  if (!mentorProfileId || !selectedMentee || !selectedMentee.profileId) {
    toast({ title: 'Atenção', description: 'Carregando informações do perfil...' });
    return;
  }
  
  setConnectionStatus('loading');
  try {
    const res = await apiFetch('/mentorship-connections', {
      method: 'POST',
      body: JSON.stringify({ 
        mentorProfileId: selectedMentee.profileId, 
        menteeProfileId: mentorProfileId,
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

if (error || !selectedMentee) {
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

// Define Profile IDs for scheduling components
// If I am the mentor viewing a mentee: mentorId is my Mentor Profile, menteeId is the target profile
// If I am the mentee viewing a mentor: mentorId is target profile, menteeId is my Mentee Profile
const schedulerMentorId = selectedMentee.profileId?.toString();
const schedulerMenteeId = mentorProfileId?.toString();


  // const menteeIdNum = urlMenteeId ? parseInt(urlMenteeId, 10) : undefined;
  // const currentUserIdStr = currentUserId?.toString() || '0';

  return (
    <div className={styles.manageSessionWithMentee}>
      <MenteeInfo
        menteeId={selectedMentee.id || selectedMentee.profileId || selectedMentee.userId}
        name={selectedMentee.name}
        position={selectedMentee.position}
        experience={selectedMentee.anosExperiencia}
        avatarUrl={selectedMentee.avatarUrl}
        bio={selectedMentee.bio}
        isActive={selectedMentee.isActive}
        skills={selectedMentee.skills}
        connectionStatus={connectionStatus}
        onConnect={handleConnect}
        onLeave={handleLeave}
        onChat={selectedMentee.userId ? () => setActiveChatId(selectedMentee.userId!) : undefined}
      />

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

export function ManageSessionWithMentee() {
  return (
    <MentoringProvider>
      <ManageSessionContent />
    </MentoringProvider>
  )
}

export default ManageSessionWithMentee