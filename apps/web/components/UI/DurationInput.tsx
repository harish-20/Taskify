'use client';

import { useEffect, useMemo, useState } from 'react';

interface DurationInputProps {
  label?: string;
  id?: string;
  name?: string;
  value?: number;
  onChange?: (totalMinutes: number) => void;
  onDurationChange?: (value: { hours: number; minutes: number; totalMinutes: number }) => void;
  minuteStep?: number;
  maxHours?: number;
  disabled?: boolean;
  error?: string;
  className?: string;
  labelClass?: string;
  containerClass?: string;
  showTotal?: boolean;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const formatDuration = (hours: number, minutes: number) => {
  if (hours === 0 && minutes === 0) {
    return '0m';
  }

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h${minutes}m`;
};

const parseDuration = (value: string) => {
  const input = value.trim().toLowerCase();

  if (!input) {
    return null;
  }

  const colonMatch = input.match(/^(\d+)\s*:\s*(\d{1,2})$/);

  if (colonMatch) {
    return {
      hours: Number.parseInt(colonMatch[1] ?? '0', 10),
      minutes: Number.parseInt(colonMatch[2] ?? '0', 10),
    };
  }

  const hourMatch = input.match(/(\d+)\s*h/);
  const minuteMatch = input.match(/(\d+)\s*m/);

  if (hourMatch || minuteMatch) {
    return {
      hours: hourMatch ? Number.parseInt(hourMatch[1] ?? '0', 10) : 0,
      minutes: minuteMatch ? Number.parseInt(minuteMatch[1] ?? '0', 10) : 0,
    };
  }

  if (/^\d+$/.test(input)) {
    return {
      hours: Number.parseInt(input, 10),
      minutes: 0,
    };
  }

  return null;
};

const DurationInput: React.FC<DurationInputProps> = ({
  label,
  id = '',
  name,
  value = 0,
  onChange,
  onDurationChange,
  minuteStep = 5,
  maxHours = 99,
  disabled = false,
  error,
  className = '',
  labelClass = '',
  containerClass = '',
  showTotal = true,
}) => {
  const safeStep = clamp(Number.isFinite(minuteStep) ? Math.floor(minuteStep) : 5, 1, 30);
  const safeMaxHours = clamp(Number.isFinite(maxHours) ? Math.floor(maxHours) : 99, 1, 999);
  const safeValue = Math.max(0, Math.floor(Number.isFinite(value) ? value : 0));

  const hours = clamp(Math.floor(safeValue / 60), 0, safeMaxHours);
  const minutes = safeValue % 60;

  const [durationInput, setDurationInput] = useState(formatDuration(hours, minutes));

  useEffect(() => {
    setDurationInput(formatDuration(hours, minutes));
  }, [hours, minutes]);

  const minuteOptions = useMemo(() => {
    const options = new Set<number>();

    for (let i = 0; i < 60; i += safeStep) {
      options.add(i);
    }

    options.add(minutes);

    return [...options].sort((a, b) => a - b);
  }, [minutes, safeStep]);

  const durationSuggestions = useMemo(() => {
    const suggestions: string[] = ['15m', '30m', '45m'];

    for (let hour = 1; hour <= Math.min(safeMaxHours, 12); hour += 1) {
      suggestions.push(`${hour}h`);
      for (let minute = safeStep; minute < 60; minute += safeStep) {
        suggestions.push(`${hour}h${minute}m`);
      }
    }

    return suggestions;
  }, [safeMaxHours, safeStep]);

  const emitChange = (nextHours: number, nextMinutes: number) => {
    const boundedHours = clamp(nextHours, 0, safeMaxHours);
    const boundedMinutes = clamp(nextMinutes, 0, 59);
    const totalMinutes = boundedHours * 60 + boundedMinutes;

    onChange?.(totalMinutes);
    onDurationChange?.({
      hours: boundedHours,
      minutes: boundedMinutes,
      totalMinutes,
    });
  };

  const commitInput = () => {
    const parsed = parseDuration(durationInput);

    if (!parsed) {
      setDurationInput(formatDuration(hours, minutes));
      return;
    }

    const totalInputMinutes = parsed.hours * 60 + parsed.minutes;
    const normalizedHours = Math.floor(totalInputMinutes / 60);
    const normalizedMinutes = totalInputMinutes % 60;
    const boundedHours = clamp(normalizedHours, 0, safeMaxHours);
    const boundedMinutes = clamp(normalizedMinutes, 0, 59);
    const nextTotalMinutes = boundedHours * 60 + boundedMinutes;

    if (nextTotalMinutes === safeValue) {
      setDurationInput(formatDuration(boundedHours, boundedMinutes));
      return;
    }

    emitChange(boundedHours, boundedMinutes);
    setDurationInput(formatDuration(boundedHours, boundedMinutes));
  };

  const durationListId = `${id || name || 'duration'}-list`;

  return (
    <div className={`flex flex-col gap-1 ${containerClass}`}>
      {label && (
        <label htmlFor={id} className={`text-sm text-dark-gray ${labelClass}`}>
          {label}
        </label>
      )}

      <div className={`flex flex-col gap-1 ${className}`}>
        <input
          id={id}
          name={name}
          type="text"
          value={durationInput}
          disabled={disabled}
          list={durationListId}
          onChange={(event) => setDurationInput(event.target.value)}
          onBlur={commitInput}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              commitInput();
            }
          }}
          placeholder="e.g. 2h30m"
          className="min-h-10 rounded-md border-2 border-gray bg-white px-2 text-sm outline-none transition-colors duration-200 focus:border-black disabled:cursor-not-allowed disabled:bg-gray"
        />

        <datalist id={durationListId}>
          {durationSuggestions.map((option) => (
            <option key={option} value={option} />
          ))}
          {minuteOptions.map((option) => (
            <option key={`m-${option}`} value={`${option}m`} />
          ))}
        </datalist>
      </div>

      {showTotal && (
        <p className="text-xs text-dark-gray">Selected: {formatDuration(hours, minutes)}</p>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default DurationInput;
