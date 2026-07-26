'use client';

import { Plus, X } from 'lucide-react';
import { useState } from 'react';

import Badge from '@/components/UI/Badge';
import { updateTask } from '@/lib/services/api/task';
import { Task } from '@/lib/types/task';

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
    if (updatedChecklist[index]) {
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
      <div className="flex justify-between items-start py-4">
        <div>
          <h3 className="font-semibold text-lg">Checklist</h3>
          <p className="text-sm text-muted-foreground">Keep track of subtasks</p>
        </div>

        <Badge>
          {completedCount}/{checklist.length}
        </Badge>
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
          <label
            htmlFor={`checklist-item-${item.title}-${index}`}
            key={index}
            className="flex items-center gap-3 p-4 shadow-sm hover:bg-gray-50 rounded-lg"
          >
            <input
              type="checkbox"
              id={`checklist-item-${item.title}-${index}`}
              checked={item.completed}
              onChange={() => handleToggleItem(index)}
              disabled={isSaving}
              className="w-4 h-4 rounded cursor-pointer accent-primary"
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
          </label>
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
