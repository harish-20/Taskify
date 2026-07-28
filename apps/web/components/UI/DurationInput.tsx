'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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

const toFieldValue = (value: number) => (value === 0 ? '' : String(value));

const toNumber = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return 0;
  }

  return Number.parseInt(trimmed, 10);
};

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

type DurationFormValues = {
  hours: string;
  minutes: string;
};

const DurationInput: React.FC<DurationInputProps> = ({
  label,
  id = '',
  name,
  value = 0,
  onChange,
  onDurationChange,
  maxHours = 99,
  disabled = false,
  error,
  className = '',
  labelClass = '',
  containerClass = '',
  showTotal = true,
}) => {
  const safeMaxHours = clamp(Number.isFinite(maxHours) ? Math.floor(maxHours) : 99, 1, 999);
  const safeValue = Math.max(0, Math.floor(Number.isFinite(value) ? value : 0));

  const hours = clamp(Math.floor(safeValue / 60), 0, safeMaxHours);
  const minutes = safeValue % 60;
  const lastSyncedValueRef = useRef(safeValue);
  const inputName = name || id || 'duration';

  const validationSchema = useMemo(
    () =>
      z
        .object({
          hours: z
            .string()
            .trim()
            .refine((value) => value === '' || /^\d+$/.test(value), {
              message: 'Hours must be a number. Example: 2h 30m',
            }),
          minutes: z
            .string()
            .trim()
            .refine((value) => value === '' || /^\d+$/.test(value), {
              message: 'Minutes must be a number. Example: 2h 30m',
            }),
        })
        .refine(
          (data) => {
            const parsedHours = toNumber(data.hours);
            return parsedHours <= safeMaxHours;
          },
          {
            path: ['hours'],
            message: `Hours cannot exceed ${safeMaxHours}.`,
          },
        )
        .refine(
          (data) => {
            const parsedMinutes = toNumber(data.minutes);
            return parsedMinutes >= 0 && parsedMinutes <= 59;
          },
          {
            path: ['minutes'],
            message: 'Minutes must be between 0 and 59. Example: 2h 30m',
          },
        ),
    [safeMaxHours],
  );

  const {
    register,
    setValue,
    getValues,
    clearErrors,
    trigger,
    formState: { errors },
  } = useForm<DurationFormValues>({
    resolver: zodResolver(validationSchema),
    mode: 'onBlur',
    defaultValues: {
      hours: toFieldValue(hours),
      minutes: toFieldValue(minutes),
    },
  });

  useEffect(() => {
    if (lastSyncedValueRef.current === safeValue) {
      return;
    }

    setValue('hours', toFieldValue(hours), {
      shouldDirty: false,
      shouldValidate: false,
    });
    setValue('minutes', toFieldValue(minutes), {
      shouldDirty: false,
      shouldValidate: false,
    });
    clearErrors();
    lastSyncedValueRef.current = safeValue;
  }, [hours, minutes, safeValue, setValue, clearErrors]);

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

  const commitInput = async () => {
    const isValid = await trigger(['hours', 'minutes']);

    if (!isValid) {
      return;
    }

    const formValues = getValues();
    const boundedHours = clamp(toNumber(formValues.hours), 0, safeMaxHours);
    const boundedMinutes = clamp(toNumber(formValues.minutes), 0, 59);
    const nextTotalMinutes = boundedHours * 60 + boundedMinutes;

    if (nextTotalMinutes === safeValue) {
      setValue('hours', toFieldValue(boundedHours), {
        shouldDirty: false,
        shouldValidate: false,
      });
      setValue('minutes', toFieldValue(boundedMinutes), {
        shouldDirty: false,
        shouldValidate: false,
      });
      return;
    }

    emitChange(boundedHours, boundedMinutes);
    setValue('hours', toFieldValue(boundedHours), {
      shouldDirty: false,
      shouldValidate: false,
    });
    setValue('minutes', toFieldValue(boundedMinutes), {
      shouldDirty: false,
      shouldValidate: false,
    });
  };

  const hoursField = register('hours');
  const minutesField = register('minutes');
  const durationFieldError = error || errors.hours?.message || errors.minutes?.message;

  return (
    <div className={`flex flex-col gap-1 ${containerClass}`}>
      {label && (
        <label htmlFor={id} className={`text-sm text-dark-gray ${labelClass}`}>
          {label}
        </label>
      )}

      <div className={`flex flex-col gap-1 ${className}`}>
        <div className="inline-flex w-fit min-h-10 items-center self-start rounded-md border-2 border-gray bg-white px-2 text-sm transition-colors duration-200 focus-within:border-black disabled:cursor-not-allowed disabled:bg-gray">
          <input
            id={id ? `${id}-hours` : ''}
            type="text"
            inputMode="numeric"
            disabled={disabled}
            aria-label="Hours"
            {...hoursField}
            onBlur={(event) => {
              hoursField.onBlur(event);
              void commitInput();
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                void commitInput();
              }
            }}
            className="w-14 border-none bg-transparent p-0 text-right outline-none"
          />
          <span className="mx-1 text-dark-gray">h</span>

          <span className="mx-2 h-5 w-px bg-gray-300" />

          <input
            id={id ? `${id}-minutes` : ''}
            type="text"
            inputMode="numeric"
            disabled={disabled}
            aria-label="Minutes"
            {...minutesField}
            onBlur={(event) => {
              minutesField.onBlur(event);
              void commitInput();
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                void commitInput();
              }
            }}
            className="w-14 border-none bg-transparent p-0 text-right outline-none"
          />
          <span className="ml-1 text-dark-gray">m</span>

          <input type="hidden" name={inputName} value={`${hours}h${minutes}m`} readOnly />
        </div>
      </div>

      {durationFieldError && <p className="text-xs text-red-500">{durationFieldError}</p>}
    </div>
  );
};

export default DurationInput;
