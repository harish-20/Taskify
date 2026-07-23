'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
}

const TagInput: React.FC<TagInputProps> = ({ tags, onChange, disabled = false }) => {
  const [input, setInput] = useState('');
  const [isEditing, setIsEditing] = useState(tags.length === 0);

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      onChange([...tags, tag.trim()]);
      setInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      handleAddTag(input);
    }
  };

  if (isEditing && !disabled) {
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(index)}
                className="p-0.5 hover:bg-blue-200 rounded"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a tag..."
          disabled={disabled}
          className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:border-black outline-none disabled:bg-gray-50"
        />
        <button
          onClick={() => setIsEditing(false)}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div>
      {tags.length === 0 ? (
        <button
          onClick={() => setIsEditing(true)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          + Add tags
        </button>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(index)}
                disabled={disabled}
                className="p-0.5 hover:bg-blue-200 rounded"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <button
            onClick={() => setIsEditing(true)}
            disabled={disabled}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            + Add
          </button>
        </div>
      )}
    </div>
  );
};

export default TagInput;
