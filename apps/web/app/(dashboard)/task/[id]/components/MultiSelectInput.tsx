'use client';

import { useState, useRef } from 'react';
import { X, ChevronDown } from 'lucide-react';
import useClickOutside from '@/lib/hooks/useClickoutside';

interface Option {
  label: string;
  value: string;
}

interface MultiSelectInputProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

const MultiSelectInput: React.FC<MultiSelectInputProps> = ({
  options,
  selectedValues,
  onChange,
  placeholder = 'Select items...',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false), isOpen);

  const handleToggle = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const selectedLabels = options
    .filter((opt) => selectedValues.includes(opt.value))
    .map((opt) => opt.label);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-left flex items-center justify-between hover:bg-gray-50 disabled:bg-gray-50"
      >
        <span className={selectedValues.length === 0 ? 'text-gray-400' : 'text-gray-700'}>
          {selectedValues.length === 0 ? placeholder : `${selectedValues.length} selected`}
        </span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="max-h-60 overflow-y-auto p-2">
            {options.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <label
                  key={option.value}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer rounded"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggle(option.value)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected items display */}
      {selectedValues.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedLabels.map((label, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
            >
              {label}
              <button
                onClick={() =>
                  onChange(
                    selectedValues.filter(
                      (v) => v !== options.find((opt) => opt.label === label)?.value,
                    ),
                  )
                }
                className="p-0.5 hover:bg-blue-200 rounded"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectInput;
