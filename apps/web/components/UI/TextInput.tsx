"use client";

import { InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  labelClass?: string;
  containerClass?: string;
  error?: string;
}

const TextInput: React.FC<TextInputProps> = (props) => {
  const {
    label,
    value,
    onChange,
    error,
    disabled = false,
    id = "",
    className = "",
    labelClass = "",
    containerClass = "",
    ...otherProps
  } = props;

  return (
    <div className={`flex flex-col gap-1 ${containerClass}`}>
      {label && (
        <label className={` text-dark-gray ${labelClass}`} htmlFor={id}>
          {label}
        </label>
      )}
      <input
        id={id}
        className={`border-2 min-h-10 p-1 rounded-md transition-colors duration-200 border-gray outline-none disabled:bg-gray focus:border-black active:border-black ${className}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...otherProps}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
export default TextInput;
