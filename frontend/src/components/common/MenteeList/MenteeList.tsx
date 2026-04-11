import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../Avatar/Avatar';
import Button from '../Button/Button';
import styles from './MenteeList.module.css';
import { apiFetch } from '../../../services/api';
import { saveMentorCapacity } from '../../../services/mentorAvailabilityService';
import menteeService from '../../../services/menteeService';
import { toast } from '../../../hooks/use-toast';
import IconButton from '../IconButton/IconButton';
import { Minus, Plus, MoveRight } from 'lucide-react';

interface Mentee {
  id: number;
  name: string;
  avatarUrl?: string;
}

interface ConnectionResponseDTO {
  id: number;
  mentorId: number;
  mentorName: string;
  mentorProfileId: number;
  menteeId: number;
  menteeName: string;
  menteeProfileId: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  acceptedAt: string;
  createdAt: string;
}

interface MenteeListProps {
  mentorId: number;
  emptyStateMessage?: string;
}

interface CapacityCardProps {
  mentorId: number;
}

interface CapacityData {
  currentMentees: number;
  maxMentees: number;
}

// CapacityCard Component
export function CapacityCard({ mentorId }: CapacityCardProps) {
  const [capacity, setCapacity] = useState<CapacityData>({ currentMentees: 0, maxMentees: 10 });
  const [editingMaxMentees, setEditingMaxMentees] = useState<number>(10);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCapacity = async () => {
      try {
        // Fetch mentor capacity data from backend
        const response = await apiFetch(`/mentorship-connections/mentor/${mentorId}/capacity`);
        
        if (!response.ok) {
          throw new Error('Falha ao carregar capacidade');
        }
        
        const data = await response.json();
        setCapacity({
          currentMentees: data.currentMentees || 0,
          maxMentees: data.maxMentees || 10
        });
        setEditingMaxMentees(data.maxMentees || 10);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar capacidade:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      }
    };

    if (mentorId) {
      loadCapacity();
    }
  }, [mentorId]);

  // Increase capacity
  const handleIncreaseCapacity = () => {
    setEditingMaxMentees(prev => prev + 1);
  };

  // Decrease capacity (minimum of 1)
  const handleDecreaseCapacity = () => {
    if (editingMaxMentees > 1) {
      setEditingMaxMentees(prev => prev - 1);
    }
  };

  // Save capacity changes
  const handleSaveCapacity = async () => {
    try {
      setLoading(true);
      await saveMentorCapacity(mentorId, editingMaxMentees);
      
      // Update the displayed capacity
      setCapacity(prev => ({
        ...prev,
        maxMentees: editingMaxMentees
      }));
      
      toast({ 
        title: 'Capacidade salva com sucesso',
        description: 'Sua capacidade máxima foi atualizada.'
      });
    } catch (err) {
      console.error('Erro ao salvar capacidade:', err);
      toast({ 
        title: 'Erro: a capacidade não pôde ser salva',
        description: 'Por favor, tente novamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  const percentageUsed = error ? 0 : (capacity.currentMentees / editingMaxMentees) * 100;

  return (
    <>
      {!error && (
        <div className={styles.capacityContainer}>
          <div className={styles.capacityInfo}>
            <div className={styles.cardHeader}>
              <h3>Capacidade da Carteira</h3>
            </div>
            <p className={styles.capacityText}>
              {capacity.currentMentees} de {editingMaxMentees} mentorados
            </p>
          </div>
          <div className={styles.capacityInfo}>
              <Button 
                className={styles.saveCapacityButton} 
                onClick={handleSaveCapacity} 
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            <div className={styles.capacityControls}>
              <IconButton
                variant="capacity"
                onClick={handleDecreaseCapacity}
                disabled={loading}
              >
                <Minus size={12} />
              </IconButton>
              <IconButton
                variant="capacity"
                onClick={handleIncreaseCapacity}
                disabled={loading}
              >
                <Plus size={12} />
              </IconButton>
            </div>
          </div>
        </div>
      )}
      <div className={styles.progressBar}>
        <div 
          className={styles.progress} 
          style={{ width: `${percentageUsed}%` }}
        ></div>
      </div>
    </>
  );
}

export function MenteeList({ mentorId, emptyStateMessage = 'Você não tem mentorados ainda' }: MenteeListProps) {
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMentees = async () => {
      try {
        setLoading(true);
        // Fetch active connections (mentorados) for the mentor
        const response = await apiFetch(`/mentorship-connections/mentor/${mentorId}`);
        
        if (!response.ok) {
          throw new Error('Falha ao carregar mentorados');
        }
        
        const connections: ConnectionResponseDTO[] = await response.json();
        console.log('[MenteeList] Raw connections from backend:', connections);
        
        // Filter only APPROVED connections
        const approvedConnections = connections.filter(conn => conn.status === 'APPROVED');
        console.log('[MenteeList] Approved connections:', approvedConnections);
        
        // Fetch avatars for each mentee in parallel using just the profileId
        const activeMentees: Mentee[] = await Promise.all(
          approvedConnections.map(async (conn) => {
            // Use menteeService to get full mentee details including correct name
            const menteeDetails = await menteeService.getMenteeDetails(conn.menteeProfileId);
            
            return {
              id: conn.menteeProfileId,
              name: menteeDetails?.name || conn.menteeName || 'Mentorado(a)',
              avatarUrl: menteeDetails?.avatarUrl
            };
          })
        );
        
        
        console.log('[MenteeList] Processed mentees with avatars:', activeMentees);
        setMentees(activeMentees);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar mentorados:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        setMentees([]);
      } finally {
        setLoading(false);
      }
    };

    if (mentorId) {
      loadMentees();
    }
  }, [mentorId]);

  if (loading) {
    return (
      <div className={styles.menteeListLoading}>
        Carregando mentorados...
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.menteeListError}>
        {error}
      </div>
    );
  }

  if (mentees.length === 0) {
    return (
      <div className={styles.menteeListEmpty}>
        {emptyStateMessage}
      </div>
    );
  }

  return (
    <div className={styles.menteesGrid}>
      {mentees.map((mentee) => (
        <div 
          key={mentee.id} 
          className={`${styles.menteeCard} ${styles.clickable}`} 
          onClick={() => navigate(`/manage-session/${mentee.id}`)}
        >
          <div className={styles.menteeCardContent}>
            <Avatar 
              avatarUrl={mentee.avatarUrl}
              size={64}
            />
            <p className={styles.menteeName}>{mentee.name}</p>
          </div>
          <MoveRight size={16} className={styles.menteeArrow} />
        </div>
      ))}
    </div>
  );
}
