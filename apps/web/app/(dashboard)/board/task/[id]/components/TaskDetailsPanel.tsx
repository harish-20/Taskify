'use client';

import { Check, ChevronDown, Inbox, LayoutDashboard, LoaderCircle } from 'lucide-react';
import { useState, useCallback, useEffect, useRef } from 'react';

import { TaskFieldUpdater } from '../hooks/useTaskFields';

import { Card, CardHeader } from '@/components/UI/Card';
import DetailField from '@/components/UI/DetailField';
import DurationInput from '@/components/UI/DurationInput';
import TagInput from '@/components/UI/TagInput';
import UsersListInput from '@/components/UI/UsersListInput';
import useClickOutside from '@/lib/hooks/useClickoutside';
import { getBoards } from '@/lib/services/api/board';
import { getOrganizationUsers } from '@/lib/services/api/organization';
import { Board } from '@/lib/types/board';
import { Task } from '@/lib/types/task';

interface TaskDetailsPanelProps {
  task: Task;
  taskFieldUpdater: TaskFieldUpdater;
}

interface BoardAssignmentPickerProps {
  boards: Board[];
  boardId?: string | null;
  isSaving: boolean;
  onChange: (boardId: string | null) => void;
}

const BoardAssignmentPicker: React.FC<BoardAssignmentPickerProps> = ({
  boards,
  boardId,
  isSaving,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const selectedBoard = boards.find((board) => board._id === boardId);

  useClickOutside(pickerRef, () => setIsOpen(false), isOpen);

  const selectBoard = (nextBoardId: string | null) => {
    if (nextBoardId === boardId) {
      setIsOpen(false);
      return;
    }

    onChange(nextBoardId);
    setIsOpen(false);
  };

  return (
    <div ref={pickerRef} className="relative">
      <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Board</p>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Change task board"
        title="Change task board"
        disabled={isSaving}
        onClick={() => setIsOpen((current) => !current)}
        className="flex min-h-12 w-full items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 text-left transition-colors hover:border-primary/40 hover:bg-primary-light/40 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white text-primary shadow-sm">
          {selectedBoard ? <LayoutDashboard size={16} /> : <Inbox size={16} />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-gray-900">
            {selectedBoard?.name || 'Backlog'}
          </span>
          <span className="block truncate text-xs text-gray-500">
            {selectedBoard ? 'Assigned board' : 'Unassigned tasks'}
          </span>
        </span>
        {isSaving ? (
          <LoaderCircle size={17} className="shrink-0 animate-spin text-primary" />
        ) : (
          <ChevronDown
            size={17}
            className={`shrink-0 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Task board"
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
        >
          <button
            type="button"
            role="option"
            aria-selected={!boardId}
            onClick={() => selectBoard(null)}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors ${
              !boardId ? 'bg-primary-light text-primary' : 'hover:bg-gray-50'
            }`}
          >
            <Inbox size={16} className="shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">Backlog</span>
              <span className="block text-xs text-gray-500">Unassigned tasks</span>
            </span>
            {!boardId && <Check size={16} className="shrink-0" />}
          </button>

          {boards.length > 0 && <div className="mx-2 my-1 border-t border-gray-100" />}

          {boards.map((board) => {
            const isSelected = board._id === boardId;

            return (
              <button
                key={board._id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => selectBoard(board._id)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors ${
                  isSelected ? 'bg-primary-light text-primary' : 'hover:bg-gray-50'
                }`}
              >
                <LayoutDashboard size={16} className="shrink-0" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{board.name}</span>
                {isSelected && <Check size={16} className="shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const TaskDetailsPanel: React.FC<TaskDetailsPanelProps> = ({ task, taskFieldUpdater }) => {
  const [organizationUsers, setOrganizationUsers] = useState<Task['assignees']>([]);
  const [boards, setBoards] = useState<Board[]>([]);
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

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await getBoards();
        setBoards(response.data || []);
      } catch (error) {
        console.error('Failed to fetch boards:', error);
      }
    };

    fetchBoards();
  }, [task.organizationId]);

  const normalizeFieldValue = useCallback((field: keyof Task, value: unknown) => {
    if (field === 'startDate' || field === 'dueDate' || field === 'completedAt') {
      if (!value) {
        return undefined;
      }

      const date = new Date(value as string);
      return Number.isNaN(date.getTime()) ? undefined : date;
    }

    return value;
  }, []);

  const handleFieldUpdate = useCallback(
    async (field: keyof Task, value: unknown) => {
      await taskFieldUpdater.updateField(field, value, {
        isEqual: () => isFieldValueSame(field as string, value),
        normalize: (nextValue) => normalizeFieldValue(field, nextValue) as Task[typeof field],
      });
    },
    [isFieldValueSame, normalizeFieldValue, taskFieldUpdater],
  );

  return (
    <div className="sticky top-6 space-y-4">
      <Card className="flex flex-col gap-4">
        <CardHeader>Location</CardHeader>
        <BoardAssignmentPicker
          boards={boards}
          boardId={task.board}
          isSaving={taskFieldUpdater.loading && !!taskFieldUpdater.updatingFields.board}
          onChange={(boardId) => handleFieldUpdate('board', boardId)}
        />
      </Card>

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
          disabled={taskFieldUpdater.loading && !!taskFieldUpdater.updatingFields.estimate}
          showTotal={true}
        />

        <DurationInput
          label="Spent Time"
          id="spent-duration"
          value={Math.round((task.spentTime || 0) * 60)}
          onChange={(totalMinutes) =>
            handleFieldUpdate('spentTime', Number((totalMinutes / 60).toFixed(2)))
          }
          disabled={taskFieldUpdater.loading && !!taskFieldUpdater.updatingFields.spentTime}
          showTotal={true}
        />

        <DurationInput
          label="Remaining Time"
          id="remaining-duration"
          value={Math.round((task.remainingTime || 0) * 60)}
          onChange={(totalMinutes) =>
            handleFieldUpdate('remainingTime', Number((totalMinutes / 60).toFixed(2)))
          }
          disabled={taskFieldUpdater.loading && !!taskFieldUpdater.updatingFields.remainingTime}
          showTotal={true}
        />

        <DetailField
          label="Start Date"
          value={toDateInputValue(task.startDate)}
          type="date"
          onChange={(value) => handleFieldUpdate('startDate', value)}
          isSaving={taskFieldUpdater.loading && !!taskFieldUpdater.updatingFields.startDate}
          plain
        />

        <DetailField
          label="Due Date"
          value={toDateInputValue(task.dueDate)}
          type="date"
          onChange={(value) => handleFieldUpdate('dueDate', value)}
          isSaving={taskFieldUpdater.loading && !!taskFieldUpdater.updatingFields.dueDate}
          plain
        />

        <DetailField
          label="Completed Date"
          value={toDateInputValue(task.completedAt)}
          type="date"
          onChange={(value) => handleFieldUpdate('completedAt', value)}
          isSaving={taskFieldUpdater.loading && !!taskFieldUpdater.updatingFields.completedAt}
          plain
        />
      </Card>

      {/* Tags */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
        <p className="text-xs uppercase text-gray-500 font-semibold mb-2">Tags</p>
        <TagInput
          tags={task.tags || []}
          onChange={(tags) => handleFieldUpdate('tags', tags)}
          disabled={taskFieldUpdater.loading}
        />
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-4" />

      {/* Creation Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="space-y-2">
          <DetailField
            label="Created At"
            value={new Date(task.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
            type="text"
            isReadOnly={true}
            plain
          />
          <DetailField
            label="Last Updated"
            value={new Date(task.updatedAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
            type="text"
            isReadOnly={true}
            plain
          />
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPanel;
