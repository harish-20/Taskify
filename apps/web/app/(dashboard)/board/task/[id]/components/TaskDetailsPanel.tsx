'use client';

import { useState, useCallback, useEffect } from 'react';

import { Card, CardHeader } from '@/components/UI/Card';
import DetailField from '@/components/UI/DetailField';
import DurationInput from '@/components/UI/DurationInput';
import TagInput from '@/components/UI/TagInput';
import UsersListInput from '@/components/UI/UsersListInput';
import { getOrganizationUsers } from '@/lib/services/api/organization';
import { updateTask } from '@/lib/services/api/task';
import { Task } from '@/lib/types/task';

interface TaskDetailsPanelProps {
  task: Task;
  onTaskUpdate: (task: Task) => void;
}

const TaskDetailsPanel: React.FC<TaskDetailsPanelProps> = ({ task, onTaskUpdate }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [savingField, setSavingField] = useState<string | null>(null);
  const [organizationUsers, setOrganizationUsers] = useState<Task['assignees']>([]);
  const taskFields = task as unknown as Record<string, unknown>;

  const toDateInputValue = (value: unknown) => {
    if (!value) {
      return '';
    }

    const date = new Date(value as string | number | Date);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const toDateKey = (value: unknown) => {
    if (!value) {
      return '';
    }

    const date = new Date(value as string | number | Date);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toISOString().split('T')[0] || '';
  };

  const getUserIds = (value: unknown) => {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => {
        if (!item || typeof item !== 'object') {
          return '';
        }

        return String((item as { _id?: string })._id || '');
      })
      .filter(Boolean);
  };

  const isFieldValueSame = (field: string, nextValue: any) => {
    if (field === 'estimate' || field === 'spentTime' || field === 'remainingTime') {
      const current = Number(taskFields[field] || 0);
      const next = Number(nextValue || 0);

      return Number.isFinite(current) && Number.isFinite(next) && current === next;
    }

    if (field === 'startDate' || field === 'dueDate' || field === 'completedAt') {
      const current = toDateKey(taskFields[field]);
      const next = toDateKey(nextValue);

      return current === next;
    }

    if (field === 'assignees' || field === 'watchers') {
      const currentIds = getUserIds(taskFields[field]);
      const nextIds = getUserIds(nextValue);

      return (
        currentIds.length === nextIds.length &&
        currentIds.every((id, index) => id === nextIds[index])
      );
    }

    if (field === 'tags') {
      const currentTags = Array.isArray(task.tags) ? task.tags : [];
      const nextTags = Array.isArray(nextValue) ? nextValue : [];

      return (
        currentTags.length === nextTags.length &&
        currentTags.every((tag, index) => tag === nextTags[index])
      );
    }

    const current = taskFields[field];

    return current === nextValue;
  };

  useEffect(() => {
    const fetchOrganizationUsers = async () => {
      try {
        const response = await getOrganizationUsers();
        setOrganizationUsers(response.data || []);
      } catch (error) {
        console.error('Failed to fetch organization users:', error);
      }
    };

    fetchOrganizationUsers();
  }, [task.organizationId]);

  const handleFieldUpdate = useCallback(
    async (field: string, value: any) => {
      if (isFieldValueSame(field, value)) {
        return;
      }

      try {
        setIsSaving(true);
        setSavingField(field);
        const response = await updateTask(task._id, { [field]: value });
        if (response.success && response.data) {
          onTaskUpdate(response.data);
        }
      } catch (error) {
        console.error(`Failed to update ${field}:`, error);
      } finally {
        setIsSaving(false);
        setSavingField(null);
      }
    },
    [task, task._id, onTaskUpdate],
  );

  return (
    <div className="sticky top-6 space-y-4">
      {/* Assignees */}
      <Card className="flex flex-col gap-4">
        <CardHeader>People</CardHeader>
        <UsersListInput
          label="Assignees"
          id="assignees-input"
          availableUsers={organizationUsers}
          users={task.assignees}
          onChange={(selectedUsers) => handleFieldUpdate('assignees', selectedUsers)}
          editable
        />
        <UsersListInput
          label="Watchers"
          id="watchers-input"
          availableUsers={organizationUsers}
          users={task.watchers || []}
          onChange={(selectedUsers) => handleFieldUpdate('watchers', selectedUsers)}
          editable
        />
        <UsersListInput
          label="Created By"
          id="created-by-input"
          users={task.createdBy ? [task.createdBy] : []}
          editable={false}
        />
      </Card>

      {/* Schedule & Time */}
      <Card className="flex flex-col gap-4">
        <CardHeader>Schedule & Time</CardHeader>
        <p className="text-xs text-dark-gray">
          Time format: use 2h30m, 1h, 45m, or 2:30. Press Enter to save.
        </p>

        <DurationInput
          label="Estimate"
          id="estimate-duration"
          value={Math.round((task.estimate || 0) * 60)}
          onChange={(totalMinutes) =>
            handleFieldUpdate('estimate', Number((totalMinutes / 60).toFixed(2)))
          }
          disabled={isSaving && savingField === 'estimate'}
          showTotal={true}
        />

        <DurationInput
          label="Spent Time"
          id="spent-duration"
          value={Math.round((task.spentTime || 0) * 60)}
          onChange={(totalMinutes) =>
            handleFieldUpdate('spentTime', Number((totalMinutes / 60).toFixed(2)))
          }
          disabled={isSaving && savingField === 'spentTime'}
          showTotal={true}
        />

        <DurationInput
          label="Remaining Time"
          id="remaining-duration"
          value={Math.round((task.remainingTime || 0) * 60)}
          onChange={(totalMinutes) =>
            handleFieldUpdate('remainingTime', Number((totalMinutes / 60).toFixed(2)))
          }
          disabled={isSaving && savingField === 'remainingTime'}
          showTotal={true}
        />

        <DetailField
          label="Start Date"
          value={toDateInputValue(task.startDate)}
          type="date"
          onChange={(value) => handleFieldUpdate('startDate', value)}
          isSaving={isSaving}
          plain
        />

        <DetailField
          label="Due Date"
          value={toDateInputValue(task.dueDate)}
          type="date"
          onChange={(value) => handleFieldUpdate('dueDate', value)}
          isSaving={isSaving}
          plain
        />

        <DetailField
          label="Completed Date"
          value={toDateInputValue(task.completedAt)}
          type="date"
          onChange={(value) => handleFieldUpdate('completedAt', value)}
          isSaving={isSaving}
          plain
        />
      </Card>

      {/* Tags */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
        <p className="text-xs uppercase text-gray-500 font-semibold mb-2">Tags</p>
        <TagInput
          tags={task.tags || []}
          onChange={(tags) => handleFieldUpdate('tags', tags)}
          disabled={isSaving}
        />
      </div>

      {/* Color */}
      <DetailField
        label="Color"
        value={task.color || 'No color'}
        type="color"
        onChange={(value) => handleFieldUpdate('color', value)}
        isSaving={isSaving}
      />

      {/* Parent Task */}
      <DetailField
        label="Parent Task"
        value={task.parentTask ? 'Set' : 'None'}
        type="text"
        isReadOnly={true}
      />

      {/* Dependencies */}
      <DetailField
        label="Blocked By"
        value={task.blockedBy?.length || 0}
        type="text"
        isReadOnly={true}
      />

      {/* Divider */}
      <div className="border-t border-gray-200 my-4" />

      {/* Creation Info */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
        <p className="text-xs uppercase text-gray-500 font-semibold mb-3">Created</p>
        <div className="space-y-2">
          <DetailField
            label="Created At"
            value={new Date(task.createdAt).toLocaleDateString()}
            type="text"
            isReadOnly={true}
          />
          <DetailField
            label="Last Updated"
            value={new Date(task.updatedAt).toLocaleDateString()}
            type="text"
            isReadOnly={true}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPanel;
