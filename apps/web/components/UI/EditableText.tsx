import { useEffect, useRef, useState } from 'react';

type EditableTextProps = {
  value: string;
  onSave: (value: string) => Promise<void> | void;
  className?: string;
  placeholder?: string;
};

export function EditableText({ value, onSave, className, placeholder }: EditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const save = async () => {
    setEditing(false);

    const trimmed = text.trim();

    if (!trimmed) {
      setText(value);
      return;
    }

    if (trimmed !== value) {
      await onSave(trimmed);
    }
  };

  const cancel = () => {
    setText(value);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.currentTarget.blur();
          }

          if (e.key === 'Escape') {
            cancel();
          }
        }}
        className={`bg-transparent outline-none w-full ${className}`}
      />
    );
  }

  return (
    <div className={`cursor-text w-full ${className}`} onClick={() => setEditing(true)}>
      {value || placeholder}
    </div>
  );
}
