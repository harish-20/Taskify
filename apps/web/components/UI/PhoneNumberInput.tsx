"use client";

import { InputHTMLAttributes, useState } from "react";

interface PhoneNumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  className?: string;
  labelClass?: string;
  containerClass?: string;
  error?: string;
  onChange?: (value: string) => void;
  countryCode?: string;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = (props) => {
  const {
    label,
    error,
    disabled = false,
    id = "",
    className = "",
    labelClass = "",
    containerClass = "",
    onChange,
    countryCode = "+91",
    ...otherProps
  } = props;

  const [phone, setPhone] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only digits
    const numericValue = e.target.value.replace(/\D/g, "");

    // Limit to 10 digits (India standard)
    if (numericValue.length <= 10) {
      setPhone(numericValue);
      onChange?.(`${countryCode}${numericValue}`);
    }
  };

  return (
    <div className={`flex flex-col gap-1 ${containerClass}`}>
      {label && (
        <label className={`text-sm text-dark-gray ${labelClass}`} htmlFor={id}>
          {label}
        </label>
      )}

      <div className="flex items-center border-2 rounded-md transition-colors duration-200 border-gray focus-within:border-black">
        <span className="px-3 text-sm text-gray-600 border-r">
          {countryCode}
        </span>

        <input
          id={id}
          type="tel"
          inputMode="numeric"
          className={`flex-1 min-h-10 p-2 outline-none disabled:bg-gray placeholder:text-sm ${className}`}
          value={phone}
          onChange={handleChange}
          disabled={disabled}
          placeholder="Enter phone number"
          {...otherProps}
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default PhoneNumberInput;
