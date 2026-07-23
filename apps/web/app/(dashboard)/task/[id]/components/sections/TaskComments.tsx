'use client';

import { useState } from 'react';
import { Task } from '@/lib/types/task';
import { Send } from 'lucide-react';

interface TaskCommentsProps {
  task: Task;
  onTaskUpdate: (task: Task) => void;
}

const TaskComments: React.FC<TaskCommentsProps> = ({ task }) => {
  const [newComment, setNewComment] = useState('');
  const [isSending, setIsSending] = useState(false);
  const commentCount = task.comments?.length || 0;

  const handleAddComment = async () => {
    if (!newComment.trim() || isSending) return;

    try {
      setIsSending(true);
      // TODO: Add comment API call
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>

      {/* Comments List */}
      <div className="space-y-4 mb-6">
        {commentCount === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">No comments yet. Start the conversation!</p>
          </div>
        ) : (
          task.comments?.map((comment, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">User Name</p>
                <p className="text-xs text-gray-500 mb-1">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-700">{comment.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Comment Input */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                handleAddComment();
              }
            }}
            placeholder="Add a comment... (Ctrl+Enter to submit)"
            disabled={isSending}
            className="flex-1 min-h-20 p-3 border border-gray-200 rounded-lg focus:border-black outline-none resize-none disabled:bg-gray-50"
          />
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim() || isSending}
            className="self-end p-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
            title="Send comment (or Ctrl+Enter)"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskComments;
