'use client';

import { useEffect, useState } from 'react';
import { Edit2, Check } from 'lucide-react';
import { RichTextEditor } from '@/components/UI/RichTextEditor/RichTextEditor';

interface TaskDescriptionProps {
  description: string | TrustedHTML;
  onUpdate: (description: string | TrustedHTML) => Promise<void>;
  isSaving: boolean;
}

const TaskDescription: React.FC<TaskDescriptionProps> = ({ description, onUpdate, isSaving }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(description);

  useEffect(() => {
    if (!isEditing) {
      setContent(description);
    }
  }, [description, isEditing]);

  const handleSave = async () => {
    await onUpdate(content);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4 border-b border-gray-200 p-6 pb-2">
        <h2 className="text-lg font-semibold text-gray-900">Description</h2>
      </div>

      {isEditing ? (
        <div className="space-y-3 p-6">
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Add a description..."
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
        <div
          className="prose prose-sm max-w-[100vw] p-6 text-gray-600 min-h-24  prose-p:my-1 prose-headings:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-blockquote:my-2"
          onClick={() => setIsEditing(true)}
        >
          {description ? (
            <div dangerouslySetInnerHTML={{ __html: description }} />
          ) : (
            <p className="text-gray-400 italic">No description yet</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskDescription;
