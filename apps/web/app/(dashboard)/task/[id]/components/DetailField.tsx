'use client';

import { useState, useRef } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import Select from '@/components/UI/Select';
import DatePicker from '@/components/UI/DatePicker';

interface DetailFieldProps {
  label: string;
  value: any;
  type?: 'text' | 'select' | 'date' | 'number' | 'color';
  options?: Array<{ label: string; value: string }>;
  onChange?: (value: any) => void;
  isSaving?: boolean;
  isReadOnly?: boolean;
}

const DetailField: React.FC<DetailFieldProps> = ({
  label,
  value,
  type = 'text',
  options = [],
  onChange,
  isSaving = false,
  isReadOnly = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (onChange) {
      onChange(editValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(String(value));
    setIsEditing(false);
  };

  if (isReadOnly) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
        <p className="text-xs uppercase text-gray-500 font-semibold mb-1">{label}</p>
        <p className="text-sm text-gray-700">{value}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs uppercase text-gray-500 font-semibold">{label}</p>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            disabled={isSaving}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Edit2 size={14} className="text-gray-400" />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          {type === 'select' && (
            <Select
              options={options}
              value={editValue}
              onChange={setEditValue}
              className="text-sm"
            />
          )}

          {type === 'date' && (
            <DatePicker
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="text-sm"
            />
          )}

          {type === 'color' && (
            <input
              type="color"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          )}

          {(type === 'text' || type === 'number') && (
            <input
              ref={inputRef}
              type={type}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:border-black outline-none"
              autoFocus
            />
          )}

          <div className="flex gap-1">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-1 py-1 bg-black text-white rounded text-xs hover:bg-gray-800 disabled:opacity-50"
            >
              <Check size={12} />
              Save
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-1 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300"
            >
              <X size={12} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-700">{value}</p>
      )}
    </div>
  );
};

export default DetailField;
