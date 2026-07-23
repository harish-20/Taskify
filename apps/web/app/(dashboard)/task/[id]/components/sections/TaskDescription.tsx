'use client';

import { useState } from 'react';
import { Edit2, Check } from 'lucide-react';

interface TaskDescriptionProps {
  description: string;
  onUpdate: (description: string) => Promise<void>;
  isSaving: boolean;
}

const TaskDescription: React.FC<TaskDescriptionProps> = ({ description, onUpdate, isSaving }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(description);

  const handleSave = async () => {
    await onUpdate(content);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Description</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit description"
          >
            <Edit2 size={18} className="text-gray-600" />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a description... Supports markdown"
            className="w-full min-h-64 p-3 border-2 border-gray-200 rounded-lg focus:border-black outline-none resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              <Check size={18} />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setContent(description);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="prose prose-sm max-w-none text-gray-600 min-h-24">
          {description ? (
            <p className="whitespace-pre-wrap text-gray-700">{description}</p>
          ) : (
            <p className="text-gray-400 italic">No description yet</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskDescription;
