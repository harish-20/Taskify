'use client';

import { useState } from 'react';
import { Task } from '@/lib/types/task';
import { updateTask } from '@/lib/services/api/task';
import { Plus, X } from 'lucide-react';

interface TaskChecklistProps {
  task: Task;
  onTaskUpdate: (task: Task) => void;
}

interface ChecklistItem {
  title: string;
  completed: boolean;
}

const TaskChecklist: React.FC<TaskChecklistProps> = ({ task, onTaskUpdate }) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(task.checklist || []);
  const [newItem, setNewItem] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddItem = async () => {
    if (!newItem.trim()) return;

    const updatedChecklist = [...checklist, { title: newItem.trim(), completed: false }];
    try {
      setIsSaving(true);
      const response = await updateTask(task._id, { checklist: updatedChecklist });
      if (response.success && response.data) {
        setChecklist(updatedChecklist);
        setNewItem('');
        onTaskUpdate(response.data);
      }
    } catch (error) {
      console.error('Failed to add checklist item:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleItem = async (index: number) => {
    const updatedChecklist = [...checklist];
    updatedChecklist[index].completed = !updatedChecklist[index].completed;

    try {
      setIsSaving(true);
      const response = await updateTask(task._id, { checklist: updatedChecklist });
      if (response.success && response.data) {
        setChecklist(updatedChecklist);
        onTaskUpdate(response.data);
      }
    } catch (error) {
      console.error('Failed to update checklist:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveItem = async (index: number) => {
    const updatedChecklist = checklist.filter((_, i) => i !== index);

    try {
      setIsSaving(true);
      const response = await updateTask(task._id, { checklist: updatedChecklist });
      if (response.success && response.data) {
        setChecklist(updatedChecklist);
        onTaskUpdate(response.data);
      }
    } catch (error) {
      console.error('Failed to remove checklist item:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const completedCount = checklist.filter((item) => item.completed).length;
  const progress = checklist.length > 0 ? (completedCount / checklist.length) * 100 : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Checklist</h3>
          {checklist.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {completedCount} of {checklist.length} completed
            </p>
          )}
        </div>
      </div>

      {checklist.length > 0 && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-black h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-2 mb-4">
        {checklist.map((item, index) => (
          <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => handleToggleItem(index)}
              disabled={isSaving}
              className="w-5 h-5 rounded cursor-pointer"
            />
            <span
              className={`flex-1 ${item.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}
            >
              {item.title}
            </span>
            <button
              onClick={() => handleRemoveItem(index)}
              disabled={isSaving}
              className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
          placeholder="Add new checklist item"
          disabled={isSaving}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-black outline-none disabled:bg-gray-50"
        />
        <button
          onClick={handleAddItem}
          disabled={!newItem.trim() || isSaving}
          className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
};

export default TaskChecklist;
