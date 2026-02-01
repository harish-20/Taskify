"use client";

import React from "react";
import { SelectOption } from "@/lib/types/components";

interface CardSelectProps {
  label?: string;
  options: SelectOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  error?: string;
  disabled?: boolean;
  containerClass?: string;
}

const CardSelect: React.FC<CardSelectProps> = ({
  label,
  options,
  value,
  onChange,
  multiple = false,
  error,
  disabled = false,
  containerClass = "",
}) => {
  const selectedValues = Array.isArray(value) ? value : [value];

  const handleSelect = (val: string) => {
    if (disabled) return;

    if (multiple) {
      if (selectedValues.includes(val)) {
        onChange(selectedValues.filter((v) => v !== val));
      } else {
        onChange([...selectedValues, val]);
      }
    } else {
      onChange(val);
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${containerClass}`}>
      {label && <p className="text-sm text-dark-gray">{label}</p>}

      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => {
          const isSelected = selectedValues.includes(opt.value);

          return (
            <div
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`
                cursor-pointer rounded-md border-2 p-4 transition-all
                ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-gray hover:border-primary/50"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              <p className="font-medium text-sm">{opt.label}</p>
            </div>
          );
        })}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default CardSelect;
