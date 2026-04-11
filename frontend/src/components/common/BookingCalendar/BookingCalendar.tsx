import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { isBefore, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import styles from 'react-day-picker/dist/style.module.css';

interface BookingCalendarProps {
  mentorId?: string;
  mode?: 'single' | 'multiple' | 'range';
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  modifiers?: Record<string, (date: Date) => boolean>;
  modifiersClassNames?: Record<string, string>;
  locale?: any;
  className?: string;
}

export default function BookingCalendar({ 
  mode = 'single',
  selected,
  onSelect,
  disabled,
  modifiers,
  modifiersClassNames,
  locale = ptBR,
  className
}: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(selected);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    onSelect?.(date);
  };

  return (
    <div>
      <div>
        <DayPicker
          mode={mode as any}
          selected={selectedDate}
          onSelect={handleDateSelect}
          locale={locale}
          disabled={disabled || ((date: Date) => isBefore(date, startOfDay(new Date())))}
          className={className || "border rounded-xl p-3 shadow-sm bg-white"}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
        />
      </div>
    </div>
  );
}
