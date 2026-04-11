import { useState, useMemo, useEffect } from 'react';
import { apiFetch } from '../../../services/api';
import { useMentoring } from '../BookingCalendar/MentoringContext';
import BookingCalendar from '../BookingCalendar/BookingCalendar';
import Button from '../Button/Button';
import { Badge } from '../Badge/Badge';
import { Switch } from '../Switch/Switch';
import { Label } from '../Label/Label';
import { CalendarCardContent, CalendarCardHeader, CalendarCardTitle } from '../CalendarCard/CalendarCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../Dialog/Dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../Select/Select';
import { CalendarIcon, Clock, Video, RefreshCw, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from '../../../hooks/use-toast';
import type { TimeBlock } from '../BookingCalendar/types';
import styles from './SlotSelector.module.css';


interface SlotSelectorProps {
  connected: boolean;
  mentorId: string;
  menteeId: string;
  connectionId: number | null;
  onBooked?: () => void;
  context?: 'mentor' | 'mentee';
}

const toMinutes = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

const fromMinutes = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

interface BackendSession {
  date: string;
  startTime: string;
  endTime: string;
}

export function SlotSelector({ connected, mentorId, menteeId, connectionId, onBooked }: SlotSelectorProps) {
  const { bookCustomSlot, getBackendAvailability } = useMentoring();

  const [availabilityBlocks, setAvailabilityBlocks] = useState<TimeBlock[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [bookedSessions, setBookedSessions] = useState<BackendSession[]>([]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedBlockIdx, setSelectedBlockIdx] = useState<number | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [isRecurring, setIsRecurring] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // If connection is lost while interacting, keep the component in read-only mode.
  useEffect(() => {
    if (connected) return;
    setShowConfirm(false);
    setSelectedBlockIdx(null);
    setSelectedStartTime(null);
    setSelectedDuration(60);
    setIsRecurring(false);
  }, [connected]);

  // Load booked sessions whenever connectionId changes
  useEffect(() => {
    if (!connectionId) return;
    let cancelled = false;
    apiFetch(`/mentorship-sessions/connection/${connectionId}`)
      .then(res => res.ok ? res.json() : [])
      .then((data: any[]) => {
        if (cancelled) return;
        const sessions: BackendSession[] = (Array.isArray(data) ? data : [])
          .filter(s => s.status === 'SCHEDULED')
          .map(s => {
            const sd: string = typeof s.scheduledDate === 'string'
              ? s.scheduledDate
              : Array.isArray(s.scheduledDate)
                ? `${s.scheduledDate[0]}-${String(s.scheduledDate[1]).padStart(2,'0')}-${String(s.scheduledDate[2]).padStart(2,'0')}T${String(s.scheduledDate[3]).padStart(2,'0')}:${String(s.scheduledDate[4] ?? 0).padStart(2,'0')}`
                : String(s.scheduledDate);
            const timePart = sd.includes('T') ? sd.split('T')[1].substring(0, 5) : '00:00';
            return {
              date: sd.split('T')[0],
              startTime: timePart,
              endTime: fromMinutes(toMinutes(timePart) + (s.durationMinutes ?? 60)),
            };
          });
        setBookedSessions(sessions);
      })
      .catch(err => console.error('[SlotSelector] Error loading booked sessions:', err));
    return () => { cancelled = true; };
  }, [connectionId]);

  // Fetch availability from backend on mount or when mentorId changes
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        console.log(`[SlotSelector] Fetching availability for mentorId: ${mentorId}`);
        setLoadingAvailability(true);
        setAvailabilityError(null);
        const result = await getBackendAvailability(mentorId);
        const blocks = result?.blocks || [];
        setAvailabilityBlocks(blocks);
        console.log(`[SlotSelector] Loaded ${blocks.length} availability block(s) for mentor ${mentorId}`, blocks);
      } catch (error) {
        console.error('[SlotSelector] Error loading availability:', error);
        setAvailabilityError('Não conseguimos carregar a disponibilidade do mentor. Tente novamente mais tarde.');
        setAvailabilityBlocks([]);
      } finally {
        setLoadingAvailability(false);
      }
    };

    if (mentorId && mentorId !== '0') {
      fetchAvailability();
    } else {
      console.warn(`[SlotSelector] Invalid mentorId: ${mentorId}`);
      setLoadingAvailability(false);
      setAvailabilityError('ID do mentor inválido.');
    }
  }, [mentorId, getBackendAvailability]);

  const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

  // Get available time blocks for selected date, excluding already-booked slots
  const blocks = useMemo(() => {
    if (!dateStr || availabilityBlocks.length === 0) return [];
    const dateObj = new Date(dateStr + 'T12:00:00');
    const dayOfWeek = dateObj.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    const dayBlocks = availabilityBlocks.filter(b => b.day === dayOfWeek);
    if (dayBlocks.length === 0) return [];
    const sessionsThatDay = bookedSessions.filter(s => s.date === dateStr);
    const freeWindows: { startTime: string; endTime: string }[] = [];
    for (const block of dayBlocks) {
      const blockStart = block.startHour * 60 + block.startMinute;
      const blockEnd = block.endHour * 60 + block.endMinute;
      const booked = sessionsThatDay
        .map(s => ({ start: toMinutes(s.startTime), end: toMinutes(s.endTime) }))
        .filter(b => b.start < blockEnd && b.end > blockStart)
        .sort((a, b) => a.start - b.start);
      let cursor = blockStart;
      for (const b of booked) {
        if (cursor < b.start && b.start - cursor >= 60)
          freeWindows.push({ startTime: fromMinutes(cursor), endTime: fromMinutes(b.start) });
        cursor = Math.max(cursor, b.end);
      }
      if (cursor < blockEnd && blockEnd - cursor >= 60)
        freeWindows.push({ startTime: fromMinutes(cursor), endTime: fromMinutes(blockEnd) });
    }
    return freeWindows;
  }, [dateStr, availabilityBlocks, bookedSessions]);

  const selectedBlock = selectedBlockIdx !== null ? blocks[selectedBlockIdx] : null;

  // Generate possible start times for the selected block (30min increments)
  const startTimeOptions = useMemo(() => {
    if (!selectedBlock) return [];
    const blockStart = toMinutes(selectedBlock.startTime);
    const blockEnd = toMinutes(selectedBlock.endTime);
    const options: string[] = [];
    for (let t = blockStart; t + 60 <= blockEnd; t += 30) {
      options.push(fromMinutes(t));
    }
    return options;
  }, [selectedBlock]);

  // Max duration for selected start time
  const maxDuration = useMemo(() => {
    if (!selectedBlock || !selectedStartTime) return 60;
    const start = toMinutes(selectedStartTime);
    const blockEnd = toMinutes(selectedBlock.endTime);
    return Math.min(blockEnd - start, 240); // cap 4h
  }, [selectedBlock, selectedStartTime]);

  // Duration options (1h to 4h in 30min steps, capped by maxDuration)
  const durationOptions = useMemo(() => {
    const opts: number[] = [];
    for (let d = 60; d <= maxDuration; d += 30) {
      opts.push(d);
    }
    return opts;
  }, [maxDuration]);

  const endTime = selectedStartTime ? fromMinutes(toMinutes(selectedStartTime) + selectedDuration) : '';

  // Check which dates have availability (for calendar highlighting)
  const availableDates = useMemo(() => {
    if (availabilityBlocks.length === 0) return new Set<string>();
    const dates = new Set<string>();
    const today = new Date();
    for (let i = 1; i <= 28; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const ds = format(d, 'yyyy-MM-dd');
      const dateObj = new Date(ds + 'T12:00:00');
      const dayOfWeek = dateObj.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
      const dayBlocks = availabilityBlocks.filter(b => b.day === dayOfWeek);
      if (dayBlocks.length > 0) dates.add(ds);
    }
    return dates;
  }, [availabilityBlocks]);

  const isDayAvailable = (date: Date) => availableDates.has(format(date, 'yyyy-MM-dd'));
  
  const resetSelection = () => {
    setSelectedBlockIdx(null);
    setSelectedStartTime(null);
    setSelectedDuration(60);
    setIsRecurring(false);
  };

  const handleConfirm = async () => {
    if (!selectedStartTime || !dateStr) return;

    if (!connectionId) {
      alert('Não foi possível identificar uma conexão ativa para este agendamento.');
      return;
    }

    try {
      await bookCustomSlot({
        mentorId,
        menteeId,
        connectionId,
        date: dateStr,
        startTime: selectedStartTime,
        endTime,
        isRecurring,
      });

      // Optimistic update: block the just-booked slot immediately
      setBookedSessions(prev => [...prev, { date: dateStr, startTime: selectedStartTime, endTime }]);
      setSelectedDate(undefined);
      setShowConfirm(false);
      resetSelection();
      onBooked?.();
      toast({
        title: 'Sessão agendada com sucesso!',
        description: `${format(selectedDate!, 'dd/MM/yyyy', { locale: ptBR })} às ${selectedStartTime}`,
      });
    } catch (err) {
      console.error('[SlotSelector] Falha ao agendar:', err);
      toast({
        title: 'Erro ao agendar sessão',
        description: err instanceof Error ? err.message : 'Tente novamente.',
      });
    }
  };

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (m === 0) return `${h}h`;
    return `${h}h${m}min`;
  };

  return (
    <>
      <CalendarCardHeader className={styles["slot-selector-card-header"]}>
        <CalendarCardTitle className={styles["slot-selector-card-title"]}>
          <CalendarIcon 
            size={18}
            color="var(--purple-primary)"
          />
          Agendar Próxima Mentoria
        </CalendarCardTitle>
      </CalendarCardHeader>
      <CalendarCardContent className={styles["slot-selector-card-content"]}>
          {loadingAvailability && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ 
                display: 'inline-block',
                width: '2rem', 
                height: '2rem', 
                border: '2px solid transparent',
                borderTopColor: 'var(--primary, #3b82f6)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p style={{ marginTop: '1rem', color: '#6b7280' }}>Carregando disponibilidade...</p>
            </div>
          )}

          {availabilityError && (
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginBottom: '1rem',
              color: '#b91c1c'
            }}>
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <div>
                <strong>Erro ao carregar disponibilidade</strong>
                <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{availabilityError}</p>
              </div>
            </div>
          )}

          {!loadingAvailability && availabilityBlocks.length === 0 && 
            !availabilityError && (
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              backgroundColor: '#fef3c7',
              border: '1px solid #fcd34d',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginBottom: '1rem',
              color: '#92400e'
            }}>
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <div>
                <strong>Sem disponibilidade configurada</strong>
                <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  O mentor ainda não configurou sua disponibilidade.
                </p>
              </div>
            </div>
          )}

          {/* Calendar - ALWAYS visible (regardless of loading state, errors, or availability blocks) */}
          <div className={styles["slot-selector-calendar-container"]}>
            {!loadingAvailability && !availabilityError && (
              <></>
            )}
            <BookingCalendar
              mentorId={mentorId}
              mode="single"
              selected={selectedDate}
              onSelect={(d: Date | undefined) => { 
                console.log('[SlotSelector] Selected date:', d);
                setSelectedDate(d); 
                resetSelection(); 
              }}
              modifiers={{ available: isDayAvailable }}
              modifiersClassNames={{ available: 'slot-selector-available-day' }}
            />
          </div>

          {/* Block & Time Selection - always visible, read-only when disconnected */}
          <div className={styles["slot-selector-selection-container"]}>
            {selectedDate ? (
              <div className={styles["slot-selector-selection-header"]}>
                <h4 className={styles["slot-selector-selection-title"]}>Horários Disponíveis</h4>
                <p className={styles["slot-selector-selection-subtitle"]}>
                {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
              </p>
            </div>
          ) : (
            <div className={styles["slot-selector-placeholder"]}>
              <p>Selecione uma data no calendário</p>
            </div>
          )}
          
          {selectedDate && (
            <div className={styles["slot-selector-blocks-container"]}>
              {blocks.length > 0 ? (
                <>
                  {/* Available Blocks */}
                  <div className={styles["slot-selector-block-list"]}>
                    {blocks.map((block, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={connected ? () => { setSelectedBlockIdx(idx); setSelectedStartTime(null); setSelectedDuration(60); } : undefined}
                        disabled={!connected}
                        className={`slot-selector-block-button ${connected && selectedBlockIdx === idx ? 'selected' : ''} ${!connected ? 'readonly' : ''}`}
                      >
                        <Clock color="var(--purple-primary)"/>
                        <div className={styles["slot-selector-block-button-info"]}>
                          <p>{block.startTime} – {block.endTime}</p>
                          <p>
                            {formatDuration(toMinutes(block.endTime) - toMinutes(block.startTime))} disponível
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {!connected && (
                    <p className={styles["slot-selector-readonly-hint"]}>
                      Conecte-se com o mentor para escolher horário e confirmar o agendamento.
                    </p>
                  )}

                  {/* Start Time & Duration pickers */}
                  {connected && selectedBlock && (
                    <div className={styles["slot-selector-pickers"]}>
                      <div className={styles["slot-selector-pickers-grid"]}>
                        <div>
                          <Label className={styles["slot-selector-picker-label"]}>Início</Label>
                          <Select
                            value={selectedStartTime || ''}
                            onValueChange={(v: string) => { setSelectedStartTime(v); setSelectedDuration(60); }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Horário" />
                            </SelectTrigger>
                            <SelectContent>
                              {startTimeOptions.map(t => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className={styles["slot-selector-picker-label"]}>Duração</Label>
                          <Select
                            value={String(selectedDuration)}
                            onValueChange={(v: string) => setSelectedDuration(Number(v))}
                            disabled={!selectedStartTime}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Duração" />
                            </SelectTrigger>
                            <SelectContent>
                              {durationOptions.map(d => (
                                <SelectItem key={d} value={String(d)}>{formatDuration(d)}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {selectedStartTime && (
                        <p className={styles["slot-selector-session-info"]}>
                          Sessão: <strong>{selectedStartTime} – {endTime}</strong> ({formatDuration(selectedDuration)})
                        </p>
                      )}
                    </div>
                  )}

                  {/* Recurring + Confirm */}
                  {connected && selectedStartTime && (
                    <div className={styles["slot-selector-actions"]}>
                      <div className={styles["slot-selector-recurring-option"]}>
                        <RefreshCw className={styles["slot-selector-recurring-icon"]} />
                        <div className={styles["slot-selector-recurring-text"]}>
                          <Label htmlFor="recurring" className={styles["slot-selector-recurring-label"]}>
                            Repetir semanalmente
                          </Label>
                          <p className={styles["slot-selector-recurring-description"]}>Máx. 10 encontros</p>
                        </div>
                        <Switch id="recurring" checked={isRecurring} onCheckedChange={setIsRecurring} />
                      </div>
                      <Button className={styles["slot-selector-confirm-button"]} onClick={() => setShowConfirm(true)}>
                        <Video className={styles["slot-selector-confirm-button-icon"]} />
                        Confirmar Agendamento
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <p className={styles["slot-selector-no-slots"]}>Nenhum horário disponível nesta data.</p>
              )}
            </div>
          )}
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className={styles["font-display"]}>Confirmar Agendamento</DialogTitle>
              <DialogDescription asChild>
                {selectedDate && selectedStartTime && (
                  <span className={styles["slot-selector-dialog-description-content"]} style={{ display: 'block' }}>
                    <p><strong>Data:</strong> {format(selectedDate, "dd/MM/yyyy (EEEE)", { locale: ptBR })}</p>
                    <p><strong>Horário:</strong> {selectedStartTime} – {endTime} ({formatDuration(selectedDuration)})</p>
                    {isRecurring && (
                      <Badge className={styles["slot-selector-dialog-badge"]}>
                        <RefreshCw className={styles["slot-selector-dialog-badge-icon"]} /> Recorrente · 10 sessões
                      </Badge>
                    )}
                    <p className={styles["slot-selector-dialog-info"]}>Um link do Google Meet será gerado automaticamente.</p>
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setShowConfirm(false)}>Cancelar</Button>
              <Button onClick={handleConfirm}>Confirmar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CalendarCardContent>
    </>
  );
}
