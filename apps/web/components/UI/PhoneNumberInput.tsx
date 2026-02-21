"use client";

import { InputHTMLAttributes } from "react";

interface PhoneNumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  label?: string;
  error?: string;
  onChange?: (value: string) => void;
  value?: string;
  countryCode?: string;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  label,
  error,
  disabled = false,
  id = "",
  className = "",
  onChange,
  value = "",
  countryCode = "+91",
  ...otherProps
}) => {
  const phone = value.replace(countryCode, "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, "");

    if (numericValue.length <= 10) {
      onChange?.(`${countryCode}${numericValue}`);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm">
          {label}
        </label>
      )}

      <div className="flex items-center border-2 rounded-md focus-within:border-black">
        <span className="px-3 text-sm text-gray-600 border-r">
          {countryCode}
        </span>

        <input
          id={id}
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={handleChange}
          disabled={disabled}
          className={`flex-1 p-2 outline-none ${className}`}
          placeholder="Enter phone number"
          {...otherProps}
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default PhoneNumberInput;
