'use client';

import { Copy, MoreHorizontal, Share2, Star } from 'lucide-react';
import { useState } from 'react';

import { TaskFieldUpdater } from '../hooks/useTaskFields';

import { TaskPriorityIcons, TaskStatusIcons, TaskTypeIcons } from '@/components/icons/task';
import Button from '@/components/UI/Button';
import { EditableText } from '@/components/UI/EditableText';
import Select, { SelectOption } from '@/components/UI/Select';
import Tooltip from '@/components/UI/Tooltip';
import {
  TASK_PRIORITY_LABEL,
  TASK_PRIORITY_VALUES,
  TASK_STATUS_LABEL,
  TASK_STATUS_VALUES,
  TASK_TYPE_LABEL,
  TASK_TYPE_VALUES,
} from '@/lib/constants/task';
import { Task, TaskPriority, TaskStatus, TaskType } from '@/lib/types/task';

interface TaskHeaderProps {
  task: Task;
  taskFieldUpdater: TaskFieldUpdater;
}

const taskTypeOptions: SelectOption<TaskType>[] = TASK_TYPE_VALUES.map((type) => {
  const Icon = TaskTypeIcons[type];

  return {
    label: TASK_TYPE_LABEL[type],
    value: type,
    icon: <Icon size={16} />,
  };
});

const priorityOptions: SelectOption<TaskPriority>[] = TASK_PRIORITY_VALUES.map((priority) => {
  const Icon = TaskPriorityIcons[priority];

  return {
    label: TASK_PRIORITY_LABEL[priority],
    value: priority,
    icon: <Icon size={16} />,
  };
});

const statusOptions: SelectOption<TaskStatus>[] = TASK_STATUS_VALUES.map((status) => {
  const Icon = TaskStatusIcons[status];

  return {
    label: TASK_STATUS_LABEL[status],
    value: status,
    icon: <Icon size={16} />,
  };
});

type EditableField = Pick<Task, 'title' | 'type' | 'priority' | 'status'>;

const TaskHeader: React.FC<TaskHeaderProps> = ({ task, taskFieldUpdater }) => {
  const [isCopying, setIsCopying] = useState(false);

  const updateField = async <K extends keyof EditableField>(field: K, value: EditableField[K]) => {
    await taskFieldUpdater.updateField(field, value);
  };

  const handleCopyTicketId = async () => {
    await navigator.clipboard.writeText(task.ticketId);

    setIsCopying(true);

    setTimeout(() => setIsCopying(false), 1000);
  };

  const TaskIcon = TaskTypeIcons[task.type];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <p className="text-sm font-bold text-gray-500">{task.ticketId}</p>

        <Tooltip content={isCopying ? 'Copied!' : ''} alwaysVisible>
          <Button
            variant="text"
            size="sm"
            className="aspect-square"
            done={isCopying}
            onClick={handleCopyTicketId}
          >
            <Copy size={12} className="text-gray-600" />
          </Button>
        </Tooltip>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-1 gap-4">
            <TaskIcon size={32} className="mt-4" />

            <EditableText
              value={task.title}
              placeholder="Enter task title"
              className="p-3 pl-0 text-4xl font-medium text-gray-900"
              onSave={(value) => updateField('title', value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <button type="button" className="rounded-lg p-2 transition-colors hover:bg-gray-100">
              <Star size={20} className="text-gray-600" />
            </button>

            <button type="button" className="rounded-lg p-2 transition-colors hover:bg-gray-100">
              <Share2 size={20} className="text-gray-600" />
            </button>

            <button type="button" className="rounded-lg p-2 transition-colors hover:bg-gray-100">
              <MoreHorizontal size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-4">
          <Select
            value={task.type}
            options={taskTypeOptions}
            disabled={taskFieldUpdater.loading && !!taskFieldUpdater.updatingFields.type}
            onChange={(value) => updateField('type', value)}
          />

          <Select
            value={task.priority}
            options={priorityOptions}
            disabled={taskFieldUpdater.loading && !!taskFieldUpdater.updatingFields.priority}
            onChange={(value) => updateField('priority', value)}
          />

          <Select
            value={task.status}
            options={statusOptions}
            disabled={taskFieldUpdater.loading && !!taskFieldUpdater.updatingFields.status}
            onChange={(value) => updateField('status', value)}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskHeader;
