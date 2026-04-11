import React, { useState, useEffect } from 'react';
import styles from './MentorDashboard.module.css';
import Button from '../../components/common/Button/Button';
import { AvailabilityGrid } from '../../components/common/TimeSlot/TimeSlot';
import { SessionList } from '../../components/common/SessionList/SessionList';
import { MenteeList, CapacityCard } from '../../components/common/MenteeList/MenteeList';
import { getMentorAvailability, saveMentorAvailability } from '../../services/mentorAvailabilityService';
import { apiFetch } from '../../services/api';
import { toast } from '../../hooks/use-toast';
import type { TimeBlock } from '../../components/common/BookingCalendar/types';


const MentorDashboard: React.FC = () => {
  const [blocks, setBlocks] = useState<TimeBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [mentorId, setMentorId] = useState<number | null>(null);
  const [slotDuration, setSlotDuration] = useState(60);

  // Helper: Convert TimeBlock to display string (HH:mm - HH:mm)
  const blockToTimeRange = (block: TimeBlock): string => {
    const startTime = `${String(block.startHour).padStart(2, '0')}:${String(block.startMinute).padStart(2, '0')}`;
    const endTime = `${String(block.endHour).padStart(2, '0')}:${String(block.endMinute).padStart(2, '0')}`;
    return `${startTime} - ${endTime}`;
  };

  // Load availability and mentor profile from service
  useEffect(() => {
    const loadMentorData = async () => {
      try {
        setLoading(true);

        // Get current user ID from localStorage
        const storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
          throw new Error('Usuário não encontrado. Por favor, faça login novamente.');
        }
        
        const myUserId = Number(storedUserId);
        
        // 1. Fetch user to find the MENTOR profile ID
        const userRes = await apiFetch(`/users/${myUserId}`);
        if (!userRes.ok) throw new Error('Não foi possível carregar seus dados de perfil.');
        
        const userData = await userRes.json();
        const profiles: any[] = userData.profiles || [];
        const mentorProfile = profiles.find(p => p.role?.toUpperCase() === 'MENTOR');
        
        if (!mentorProfile) {
          throw new Error('Perfil de mentor não encontrado para este usuário.');
        }

        const currentMentorProfileId = mentorProfile.id;
        setMentorId(currentMentorProfileId);

        // 2. Use service to load availability using the PROFILE ID
        const { blocks: loadedBlocks, slotDuration: loadedDuration } = await getMentorAvailability(currentMentorProfileId);
        setBlocks(loadedBlocks);
        setSlotDuration(loadedDuration);
      } catch (err) {
        console.error('Erro ao carregar dados do mentor:', err);
        toast({ 
          title: 'Erro de Autenticação',
          description: err instanceof Error ? err.message : 'Não foi possível carregar seus dados.' 
        });
      } finally {
        setLoading(false);
      }
    };

    loadMentorData();
  }, []);

  // Delete a block by ID
  const handleDelete = (id: string) => {
    setBlocks(prevBlocks => prevBlocks.filter(block => block.id !== id));
  };

  // Check if a new time slot conflicts with existing ones on the same day
  const hasTimeConflict = (dayIndex: number, startTime: string, endTime: string): boolean => {
    const [newStartHour, newStartMinute] = startTime.split(':').map(Number);
    const [newEndHour, newEndMinute] = endTime.split(':').map(Number);
    
    const newStartTotalMinutes = newStartHour * 60 + newStartMinute;
    const newEndTotalMinutes = newEndHour * 60 + newEndMinute;

    // Find all blocks on the same day
    const dayBlocks = blocks.filter(block => block.day === dayIndex);

    // Check if new slot overlaps with any existing slot
    return dayBlocks.some(block => {
      const existingStartTotalMinutes = block.startHour * 60 + block.startMinute;
      const existingEndTotalMinutes = block.endHour * 60 + block.endMinute;

      // Two time ranges overlap if:
      // new start < existing end AND new end > existing start
      return newStartTotalMinutes < existingEndTotalMinutes && newEndTotalMinutes > existingStartTotalMinutes;
    });
  };

  // Add a new time slot
  const handleAddTimeSlot = (dayIndex: number, startTime: string, endTime: string) => {
    // Check for conflicts
    if (hasTimeConflict(dayIndex, startTime, endTime)) {
      toast({ 
        title: 'Erro: o novo horário coincide com um horário já criado',
        description: 'Por favor, escolha um horário diferente não conflitante.'
      });
      return;
    }

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const newBlock: TimeBlock = {
      id: `temp-${Date.now()}-${Math.random()}`,
      day: dayIndex as 0 | 1 | 2 | 3 | 4 | 5 | 6,
      startHour,
      startMinute,
      endHour,
      endMinute,
    };

    setBlocks(prevBlocks => [...prevBlocks, newBlock]);
    
    // Show success toast
    toast({ 
      title: 'Nova disponibilidade adicionada a agenda.',
      description: `${startTime} - ${endTime}`
    });
  };

  // Save availability using service
  const handleSave = async () => {
    if (!mentorId) {
      toast({ title: 'Erro: ID do mentor não encontrado' });
      return;
    }

    try {
      setLoading(true);
      await saveMentorAvailability(mentorId, blocks, slotDuration);
      toast({ 
        title: 'Disponibilidade salva com sucesso',
        description: 'Suas informações foram atualizadas.'
      });
    } catch (err) {
      console.error('Erro ao salvar disponibilidade:', err);
      toast({ 
        title: 'Erro: as informações não puderam ser salvas',
        description: 'Por favor, tente novamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Transform TimeBlock[] to grouped format for AvailabilityGrid
  const getAvailabilityDataForGrid = (): { [key: string]: { id: string; timeRange: string }[] } => {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const result: { [key: string]: { id: string; timeRange: string }[] } = {};

    days.forEach((day, index) => {
      result[day] = blocks
        .filter(block => block.day === index)
        .map(block => ({
          id: block.id,
          timeRange: blockToTimeRange(block),
        }));
    });

    return result;
  };

  const availabilityDataForGrid = getAvailabilityDataForGrid();

  return (
      <div className={styles["mentor-dashboard"]}>
        <div className={styles["dashboard-container"]}>
          <main className={styles["dashboard-content"]}>
            <div className={`${styles.card} ${styles["capacity-card"]}`}>
              {mentorId && (
                <CapacityCard mentorId={mentorId} />
              )}
            </div>

            <div className={`${styles.card} ${styles["availability-card"]}`}>
              <div className={styles["card-header"]}>
                <h2>Minha Disponibilidade</h2>
                <Button className={styles["save-capacity-button"]} onClick={handleSave} disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
              {!loading && (
                <AvailabilityGrid
                  availabilityData={availabilityDataForGrid}
                  handleDelete={handleDelete}
                  handleAddTimeSlot={handleAddTimeSlot}
                />
              )}
            </div>

            <div className={`${styles.card} ${styles["sessions-card"]}`}>
              <div className={styles["card-header"]}>
                <h2>Próximas Sessões</h2>
              </div>
              {mentorId && (
                <SessionList 
                  mentorId={String(mentorId)}
                  showHeader={false}
                  upcomingOnly={true}
                  daysLimit={14}
                  emptyStateMessage="Não há mentorias marcadas"
                />
              )}
            </div>

            <div className={`${styles.card} ${styles["mentees-card"]}`}>
            <div className={styles["card-header"]}>
              <h3>Meus Mentorados</h3>
            </div>
              {mentorId && (
                <MenteeList 
                  mentorId={mentorId}
                  emptyStateMessage="Nenhum mentorado ainda"
                />
              )}
            </div>
          </main>
        </div>
      </div>
  );
};

export default MentorDashboard;

