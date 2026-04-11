import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../Button/Button';
import styles from './TimeSlot.module.css';

interface TimeSlotProps {
  timeRange: string;
  onDelete: () => void;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ timeRange, onDelete }) => {
  return (
    <div className={styles.timeSlot}>
      <span>{timeRange}</span>
      <X size={18} onClick={onDelete} color="red" cursor="pointer" />
    </div>
  );
};

export default TimeSlot;

// --- Componentes Adicionais ---

interface DayColumnProps {
  day: string;
  dayIndex: number;
  slots: { id: string; timeRange: string }[];
  onDelete: (id: string) => void;
  onAddTimeSlot: (dayIndex: number, startTime: string, endTime: string) => void;
}

export const DayColumn: React.FC<DayColumnProps> = ({ day, dayIndex, slots, onDelete, onAddTimeSlot }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={styles.dayColumn}>
      <h4>{day}</h4>
      <div className={styles.timeSlots}>
        {slots.map(slot => (
          <TimeSlot
            key={slot.id}
            timeRange={slot.timeRange}
            onDelete={() => onDelete(slot.id)}
          />
        ))}
      </div>
      <Button 
        className={styles.addTimeSlot} 
        onClick={() => setShowModal(true)}
      >
        + Horário
      </Button>
      {showModal && (
        <AddTimeSlotModal
          day={day}
          onClose={() => setShowModal(false)}
          onConfirm={(startTime, endTime) => {
            onAddTimeSlot(dayIndex, startTime, endTime);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

interface AvailabilityGridProps {
  availabilityData: {
    [key: string]: { id: string; timeRange: string }[];
  };
  handleDelete: (id: string) => void;
  handleAddTimeSlot: (dayIndex: number, startTime: string, endTime: string) => void;
}

// --- Modal para Adicionar Novo Horário ---

interface AddTimeSlotModalProps {
  day: string;
  onClose: () => void;
  onConfirm: (startTime: string, endTime: string) => void;
}

const AddTimeSlotModal: React.FC<AddTimeSlotModalProps> = ({ day, onClose, onConfirm }) => {
  const [startHour, setStartHour] = useState('08');
  const [startMinute, setStartMinute] = useState('00');
  const [endHour, setEndHour] = useState('09');
  const [endMinute, setEndMinute] = useState('00');
  const [error, setError] = useState<string | null>(null);

  const VALID_MINUTES = ['00', '15', '30', '45'];

  const isValidMinute = (minute: string): boolean => VALID_MINUTES.includes(minute);

  const validateTimes = (): boolean => {
    // Check if minutes are valid
    if (!isValidMinute(startMinute) || !isValidMinute(endMinute)) {
      setError('Não é possível marcar um horário diferente das opções disponíveis');
      return false;
    }

    // Check if start time is before end time
    const startTotal = parseInt(startHour) * 60 + parseInt(startMinute);
    const endTotal = parseInt(endHour) * 60 + parseInt(endMinute);

    if (startTotal >= endTotal) {
      setError('A hora de início deve ser anterior à hora de fim');
      return false;
    }

    return true;
  };

  const handleConfirm = () => {
    setError(null);

    if (!validateTimes()) {
      return;
    }

    const startTime = `${startHour}:${startMinute}`;
    const endTime = `${endHour}:${endMinute}`;

    onConfirm(startTime, endTime);
  };

  const handleStartMinuteChange = (value: string) => {
    setStartMinute(value);
    setError(null);
  };

  const handleEndMinuteChange = (value: string) => {
    setEndMinute(value);
    setError(null);
  };

  const handleStartHourChange = (value: string) => {
    setStartHour(value);
    setError(null);
  };

  const handleEndHourChange = (value: string) => {
    setEndHour(value);
    setError(null);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Adicionar Horário - {day}</h3>
          <X size={24} onClick={onClose} cursor="pointer" color="var(--purple-primary)" />
        </div>
        <div className={styles.modalBody}>
          {error && (
            <div style={{
              backgroundColor: '#fee',
              color: '#c00',
              padding: '0.75rem',
              borderRadius: '6px',
              marginBottom: '1rem',
              border: '1px solid #fcc',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <div className={styles.timeInputGroup}>
            <label>Hora de Início</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select
                value={startHour}
                onChange={(e) => handleStartHourChange(e.target.value)}
                style={{ flex: 1, padding: '0.5rem' }}
              >
                {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')).map(hour => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
              <span>:</span>
              <select
                value={startMinute}
                onChange={(e) => handleStartMinuteChange(e.target.value)}
                style={{ flex: 1, padding: '0.5rem' }}
              >
                {VALID_MINUTES.map(minute => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.timeInputGroup}>
            <label>Hora de Fim</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select
                value={endHour}
                onChange={(e) => handleEndHourChange(e.target.value)}
                style={{ flex: 1, padding: '0.5rem' }}
              >
                {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')).map(hour => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
              <span>:</span>
              <select
                value={endMinute}
                onChange={(e) => handleEndMinuteChange(e.target.value)}
                style={{ flex: 1, padding: '0.5rem' }}
              >
                {VALID_MINUTES.map(minute => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.timePreview}>
            <span>{startHour}:{startMinute} - {endHour}:{endMinute}</span>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <Button className={styles.cancelBtn} onClick={onClose}>
            Cancelar
          </Button>
          <Button className={styles.confirmBtn} onClick={handleConfirm}>
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
};

export const AvailabilityGrid: React.FC<AvailabilityGridProps> = ({ availabilityData, handleDelete, handleAddTimeSlot }) => {
  const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const totalSlots = Object.values(availabilityData).reduce((acc, slots) => acc + slots.length, 0);

  return (
    <>
      <div className={styles.availabilityGrid}>
        {daysOfWeek.map((day, index) => (
          <DayColumn
            key={day}
            day={day}
            dayIndex={index}
            slots={availabilityData[day as keyof typeof availabilityData] || []}
            onDelete={handleDelete}
            onAddTimeSlot={handleAddTimeSlot}
          />
        ))}
      </div>
      <div className={styles.availabilityFooter}>
        <span>{totalSlots} Bloco(s) definido(s)</span>
      </div>
    </>
  );
};
