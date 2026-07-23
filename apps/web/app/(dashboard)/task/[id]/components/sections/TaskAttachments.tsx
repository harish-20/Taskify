'use client';

import { Task } from '@/lib/types/task';
import { Upload, X } from 'lucide-react';

interface TaskAttachmentsProps {
  task: Task;
  onTaskUpdate: (task: Task) => void;
}

const TaskAttachments: React.FC<TaskAttachmentsProps> = ({ task }) => {
  const attachmentCount = task.attachments?.length || 0;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>

      {attachmentCount === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <Upload className="mx-auto text-gray-400 mb-2" size={32} />
          <p className="text-gray-400 text-sm">No attachments yet</p>
          <button className="mt-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
            + Upload File
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {task.attachments?.map((attachment, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{attachment.fileName}</p>
                <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
              </div>
              <button className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskAttachments;
