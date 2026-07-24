'use client';

import { ReactNode, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

import useClickOutside from '@/lib/hooks/useClickoutside';

export interface SelectOption<T extends string> {
  label: string;
  value: T;
  icon?: ReactNode;
}

interface SelectProps<T extends string> {
  label?: string;
  options: SelectOption<T>[];
  value?: T;
  onChange: (value: T) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  labelClass?: string;
  containerClass?: string;
}

const Select = <T extends string>({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select',
  error,
  disabled = false,
  className = '',
  labelClass = '',
  containerClass = '',
}: SelectProps<T>) => {
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setOpen(false), open);

  const selected = options.find((option) => option.value === value);

  return (
    <div ref={containerRef} className={`relative flex flex-col gap-1 ${containerClass}`}>
      {label && <label className={`text-sm text-dark-gray ${labelClass}`}>{label}</label>}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={`
          min-h-10
          rounded-md
          border-2
          border-gray
          bg-white
          px-3
          transition-colors
          duration-200
          outline-none
          disabled:bg-gray
          disabled:cursor-not-allowed
          flex
          items-center
          justify-between
          focus:border-black
          ${className}
        `}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {selected?.icon}

          <span className={`truncate text-sm ${selected ? 'text-black' : 'text-dark-gray'}`}>
            {selected?.label ?? placeholder}
          </span>
        </div>

        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute top-full z-20 mt-2 w-full overflow-hidden rounded-md border-2 border-gray bg-white shadow-lg">
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`
                  flex
                  w-full
                  items-center
                  justify-between
                  px-3
                  py-2.5
                  text-left
                  text-sm
                  transition-colors
                  ${isSelected ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray'}
                `}
              >
                <div className="flex items-center gap-2">
                  {option.icon}
                  <span>{option.label}</span>
                </div>

                {isSelected && <Check size={16} />}
              </button>
            );
          })}
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Select;
