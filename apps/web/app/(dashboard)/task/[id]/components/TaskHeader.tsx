'use client';

import { useState, useRef, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { TaskTypeIcons, TaskPriorityIcons, TaskStatusIcons } from '@/components/icons/task';
import Select, { SelectOption } from '@/components/UI/Select';
import Tooltip from '@/components/UI/Tooltip';
import Button from '@/components/UI/Button';

import { Task, TaskType, TaskPriority, TaskStatus } from '@/lib/types/task';
import { updateTask } from '@/lib/services/api/task';

import { taskDetailSchema, TaskDetailFormType } from '../schemas/taskDetailSchema';

import { Star, Share2, MoreHorizontal, Copy, Check } from 'lucide-react';
import { EditableText } from '@/components/UI/EditableText';

interface TaskHeaderProps {
  task: Task;
  onTaskUpdate: (task: Task) => void;
}

const taskTypeOptions: SelectOption<TaskType>[] = [
  { label: 'Story', value: 'story', icon: <TaskTypeIcons.story size={16} /> },
  { label: 'Bug', value: 'bug', icon: <TaskTypeIcons.bug size={16} /> },
  { label: 'Feature', value: 'feature', icon: <TaskTypeIcons.feature size={16} /> },
  { label: 'Task', value: 'task', icon: <TaskTypeIcons.task size={16} /> },
];

const priorityOptions: SelectOption<TaskPriority>[] = [
  { label: 'Low', value: 'low', icon: <TaskPriorityIcons.low size={16} /> },
  { label: 'Medium', value: 'medium', icon: <TaskPriorityIcons.medium size={16} /> },
  { label: 'High', value: 'high', icon: <TaskPriorityIcons.high size={16} /> },
  { label: 'Critical', value: 'critical', icon: <TaskPriorityIcons.critical size={16} /> },
];

const statusOptions: SelectOption<TaskStatus>[] = [
  { label: 'To Do', value: 'todo', icon: <TaskStatusIcons.todo size={16} /> },
  { label: 'In Progress', value: 'in_progress', icon: <TaskStatusIcons.in_progress size={16} /> },
  { label: 'Review', value: 'review', icon: <TaskStatusIcons.review size={16} /> },
  { label: 'Done', value: 'done', icon: <TaskStatusIcons.done size={16} /> },
];

const TaskHeader: React.FC<TaskHeaderProps> = ({ task, onTaskUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedType, setSelectedType] = useState(task.type);
  const [selectedPriority, setSelectedPriority] = useState(task.priority);
  const [selectedStatus, setSelectedStatus] = useState(task.status);
  const [isCopying, setIsCopying] = useState(false);

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

  const handleCopyTicketId = () => {
    setIsCopying(true);
    navigator.clipboard.writeText(task.ticketId).then(() => {
      setTimeout(() => {
        setIsCopying(false);
      }, 1000);
    });
  };

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

  const TaskIcon = TaskTypeIcons[selectedType as TaskType] || TaskTypeIcons['task'];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <p className="text-sm font-bold text-gray-500">{task.ticketId}</p>
        <Tooltip content={isCopying ? 'Copied' : ''} alwaysVisible>
          <Button
            className="aspect-square"
            variant="text"
            size="sm"
            onClick={handleCopyTicketId}
            done={isCopying}
          >
            <Copy size={12} className="text-gray-600" />
          </Button>
        </Tooltip>
      </div>
      {/* Task ID and Title */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 flex gap-4">
            <TaskIcon size={32} className="mt-4 text-gray-600" />
            <EditableText
              value={task.title}
              onSave={(value) => handleFieldChange('title', value)}
              className="pl-0 p-3 text-4xl font-medium text-gray-900"
              placeholder="Enter task title"
            />
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
          <Select
            options={taskTypeOptions}
            value={selectedType}
            onChange={(value) => {
              setSelectedType(value);
              handleFieldChange('type', value);
            }}
            className="mt-1 min-w-[120px]"
          />

          <Select
            options={priorityOptions}
            value={selectedPriority}
            onChange={(value) => {
              setSelectedPriority(value);
              handleFieldChange('priority', value);
            }}
            className={`mt-1 min-w-[120px] ${getPriorityColor(selectedPriority as TaskPriority)}`}
          />

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
      </div>
    </form>
  );
};

export default TaskHeader;
