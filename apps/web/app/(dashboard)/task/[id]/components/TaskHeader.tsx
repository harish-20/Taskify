'use client';

import { useState, useRef, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Task, TaskType, TaskPriority, TaskStatus } from '@/lib/types/task';
import { updateTask } from '@/lib/services/api/task';
import { taskDetailSchema, TaskDetailFormType } from '../schemas/taskDetailSchema';
import TextInput from '@/components/UI/TextInput';
import Select, { SelectOption } from '@/components/UI/Select';
import { Star, Share2, MoreHorizontal } from 'lucide-react';

interface TaskHeaderProps {
  task: Task;
  onTaskUpdate: (task: Task) => void;
}

const taskTypeOptions: SelectOption[] = [
  { label: 'Story', value: 'story' },
  { label: 'Bug', value: 'bug' },
  { label: 'Feature', value: 'feature' },
  { label: 'Task', value: 'task' },
];

const priorityOptions: SelectOption[] = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' },
];

const statusOptions: SelectOption[] = [
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Review', value: 'review' },
  { label: 'Done', value: 'done' },
];

const TaskHeader: React.FC<TaskHeaderProps> = ({ task, onTaskUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedType, setSelectedType] = useState(task.type);
  const [selectedPriority, setSelectedPriority] = useState(task.priority);
  const [selectedStatus, setSelectedStatus] = useState(task.status);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TaskDetailFormType>({
    resolver: zodResolver(taskDetailSchema),
    defaultValues: {
      title: task.title,
    },
  });

  const currentTitle = watch('title');

  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditing]);

  const onSubmit: SubmitHandler<TaskDetailFormType> = async (data) => {
    try {
      setIsSaving(true);
      const response = await updateTask(task._id, {
        title: data.title,
        type: selectedType as TaskType,
        priority: selectedPriority as TaskPriority,
        status: selectedStatus as TaskStatus,
      });

      if (response.success && response.data) {
        onTaskUpdate(response.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = async (field: string, value: string) => {
    try {
      setIsSaving(true);
      const updateData: any = { [field]: value };
      const response = await updateTask(task._id, updateData);

      if (response.success && response.data) {
        onTaskUpdate(response.data);
      }
    } catch (error) {
      console.error(`Failed to update ${field}:`, error);
    } finally {
      setIsSaving(false);
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-800';
      case 'review':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Task ID and Title */}
      <div className="flex items-start gap-4">
        <div className="flex-1">
          {isEditing ? (
            <TextInput
              ref={titleInputRef}
              value={currentTitle}
              {...register('title')}
              error={errors.title?.message}
              className="text-2xl font-bold"
              containerClass="mb-2"
            />
          ) : (
            <div
              onClick={() => setIsEditing(true)}
              className="cursor-pointer hover:text-primary transition-colors"
            >
              <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
            </div>
          )}
          <p className="text-sm text-gray-500">ID: {task.ticketId}</p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Add to favorites"
          >
            <Star size={20} className="text-gray-600" />
          </button>
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Share"
          >
            <Share2 size={20} className="text-gray-600" />
          </button>
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="More options"
          >
            <MoreHorizontal size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Type, Priority, Status */}
      <div className="flex gap-4 flex-wrap items-start">
        <div className="min-w-max">
          <label className="text-xs text-gray-500 uppercase tracking-wider">Type</label>
          <Select
            options={taskTypeOptions}
            value={selectedType}
            onChange={(value) => {
              setSelectedType(value);
              handleFieldChange('type', value);
            }}
            className="mt-1 min-w-[120px]"
          />
        </div>

        <div className="min-w-max">
          <label className="text-xs text-gray-500 uppercase tracking-wider">Priority</label>
          <Select
            options={priorityOptions}
            value={selectedPriority}
            onChange={(value) => {
              setSelectedPriority(value);
              handleFieldChange('priority', value);
            }}
            className={`mt-1 min-w-[120px] ${getPriorityColor(selectedPriority as TaskPriority)}`}
          />
        </div>

        <div className="min-w-max">
          <label className="text-xs text-gray-500 uppercase tracking-wider">Status</label>
          <Select
            options={statusOptions}
            value={selectedStatus}
            onChange={(value) => {
              setSelectedStatus(value);
              handleFieldChange('status', value);
            }}
            className={`mt-1 min-w-[120px] ${getStatusColor(selectedStatus as TaskStatus)}`}
          />
        </div>

        {isEditing && (
          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
    </form>
  );
};

export default TaskHeader;
