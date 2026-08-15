'use client';

import { CalendarIcon } from 'lucide-react';
import { InputHTMLAttributes, useMemo, useRef, useState } from 'react';
import Calendar from 'react-calendar';

import useClickOutside from '@/lib/hooks/useClickoutside';

type CalendarValue = Date | null;

interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  className?: string;
  labelClass?: string;
  containerClass?: string;
  error?: string;
}

const DatePicker: React.FC<DatePickerProps> = (props) => {
  const {
    label,
    value,
    onChange,
    error,
    disabled = false,
    id = '',
    className = '',
    labelClass = '',
    containerClass = '',
    ...otherProps
  } = props;

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useClickOutside(rootRef, () => setOpen(false), open);

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const parseDateValue = (input: unknown): Date | null => {
    if (input instanceof Date && !Number.isNaN(input.getTime())) {
      return input;
    }

    if (typeof input === 'string' && input.trim()) {
      const parsed = new Date(input);

      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }

    return null;
  };

  const selectedDate = useMemo(() => parseDateValue(value), [value]);
  const displayValue = selectedDate ? selectedDate.toLocaleDateString() : '';

  const emitChange = (date: Date) => {
    const formatted = formatDateForInput(date);

    const syntheticEvent = {
      target: { value: formatted },
      currentTarget: { value: formatted },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange?.(syntheticEvent);
  };

  const handleCalendarChange = (nextValue: CalendarValue) => {
    if (!nextValue) {
      return;
    }

    emitChange(nextValue);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={`relative flex flex-col gap-1 ${containerClass}`}>
      {label && (
        <label htmlFor={id} className={`text-sm text-dark-gray ${labelClass}`}>
          {label}
        </label>
      )}

      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={`
          min-h-10
          rounded-xl
          border-2
          border-gray
          bg-white
          px-3
          py-2
          text-left
          outline-none
          transition-colors
          duration-200
          focus:border-black
          active:border-black
          hover:border-dark-gray
          disabled:bg-gray
          disabled:cursor-not-allowed
          disabled:text-dark-gray
          flex
          items-center
          justify-between
          ${className}
        `}
        {...otherProps}
      >
        <span className={`text-sm ${displayValue ? 'text-black' : 'text-dark-gray'}`}>
          {displayValue || 'Select date'}
        </span>
        <CalendarIcon size={16} className="text-dark-gray" />
      </button>

      {open && (
        <div className="absolute top-full z-30 mt-2 overflow-hidden rounded-2xl border-2 border-gray bg-white p-3 shadow-xl">
          <Calendar
            onChange={(nextValue) => handleCalendarChange(nextValue as CalendarValue)}
            value={selectedDate}
            className="taskify-calendar border-0"
            prev2Label={null}
            next2Label={null}
            formatShortWeekday={(_locale, date) =>
              date.toLocaleDateString(undefined, { weekday: 'narrow' })
            }
            navigationLabel={({ date }) =>
              date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
            }
            tileClassName={({ date, view }) => {
              if (view !== 'month') {
                return '';
              }

              const isSelected =
                selectedDate && formatDateForInput(selectedDate) === formatDateForInput(date);

              if (isSelected) {
                return '!bg-black !text-white rounded-md';
              }

              return 'rounded-md hover:!bg-gray';
            }}
          />
        </div>
      )}

      <input type="hidden" value={selectedDate ? formatDateForInput(selectedDate) : ''} readOnly />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default DatePicker;
