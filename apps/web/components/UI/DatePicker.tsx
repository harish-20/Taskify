'use client';

import { InputHTMLAttributes } from 'react';

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

  return (
    <div className={`flex flex-col gap-1 ${containerClass}`}>
      {label && (
        <label htmlFor={id} className={`text-sm text-dark-gray ${labelClass}`}>
          {label}
        </label>
      )}

      <input
        id={id}
        type="date"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          min-h-10
          rounded-md
          border-2
          border-gray
          p-2
          outline-none
          transition-colors
          duration-200
          focus:border-black
          active:border-black
          disabled:bg-gray
          disabled:cursor-not-allowed
          ${className}
        `}
        {...otherProps}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default DatePicker;
