'use client';

import { useState, useCallback, useEffect } from 'react';

import { Card, CardHeader } from '@/components/UI/Card';
import DetailField from '@/components/UI/DetailField';
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
  const [organizationUsers, setOrganizationUsers] = useState<Task['assignees']>([]);

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
      try {
        setIsSaving(true);
        const response = await updateTask(task._id, { [field]: value });
        if (response.success && response.data) {
          onTaskUpdate(response.data);
        }
      } catch (error) {
        console.error(`Failed to update ${field}:`, error);
      } finally {
        setIsSaving(false);
      }
    },
    [task._id, onTaskUpdate],
  );

  return (
    <div className="sticky top-6 space-y-4">
      {/* Assignees */}
      <Card>
        <CardHeader>People</CardHeader>
        <UsersListInput
          label="Assignees"
          id="assignees-input"
          availableUsers={organizationUsers}
          users={task.assignees}
          onChange={(selectedUsers) => handleFieldUpdate('assignees', selectedUsers)}
          editable
        />
      </Card>

      {/* Watchers */}

      <DetailField
        label="Watchers"
        value={task.watchers?.length || 0}
        type="text"
        isReadOnly={true}
      />

      {/* Start Date */}
      <DetailField
        label="Start Date"
        value={task.startDate ? new Date(task.startDate).toLocaleDateString() : 'Not set'}
        type="date"
        onChange={(value) => handleFieldUpdate('startDate', value)}
        isSaving={isSaving}
      />

      {/* Due Date */}
      <DetailField
        label="Due Date"
        value={task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}
        type="date"
        onChange={(value) => handleFieldUpdate('dueDate', value)}
        isSaving={isSaving}
      />

      {/* Completed Date */}
      <DetailField
        label="Completed Date"
        value={task.completedAt ? new Date(task.completedAt).toLocaleDateString() : 'Not set'}
        type="date"
        isReadOnly={true}
      />

      {/* Estimate */}
      <DetailField
        label="Estimate (hours)"
        value={task.estimate?.toString() || 'Not set'}
        type="number"
        onChange={(value) => handleFieldUpdate('estimate', parseInt(value) || 0)}
        isSaving={isSaving}
      />

      {/* Spent Time */}
      <DetailField
        label="Spent Time (hours)"
        value={task.spentTime?.toString() || '0'}
        type="number"
        onChange={(value) => handleFieldUpdate('spentTime', parseInt(value) || 0)}
        isSaving={isSaving}
      />

      {/* Remaining Time */}
      <DetailField
        label="Remaining Time (hours)"
        value={task.remainingTime?.toString() || 'Not set'}
        type="number"
        onChange={(value) => handleFieldUpdate('remainingTime', parseInt(value) || 0)}
        isSaving={isSaving}
      />

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
          <DetailField label="Created By" value="User Name" type="text" isReadOnly={true} />
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
