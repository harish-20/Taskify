"use client";

interface TextInputProps {
  label?: string;
  id?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  className?: string;
  labelClass?: string;
  containerClass?: string;
}

const TextInput: React.FC<TextInputProps> = (props) => {
  const {
    label,
    value,
    onChange,
    disabled = false,
    id = "",
    className = "",
    labelClass = "",
    containerClass = "",
  } = props;

  return (
    <div className={`flex flex-col gap-1 ${containerClass}`}>
      {label && (
        <label className={` text-dark-gary ${labelClass}`} htmlFor={id}>
          {label}
        </label>
      )}
      <input
        id={id}
        className={`border-2 min-h-10 p-1 rounded-md transition-colors duration-200 border-gray outline-none disabled:bg-gray focus:border-black active:border-black ${className}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};
export default TextInput;
