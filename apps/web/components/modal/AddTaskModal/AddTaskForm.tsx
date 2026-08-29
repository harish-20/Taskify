'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarDays, Tags, Users } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import TaskSchema, { TaskFormType } from './task.schema';

import { TaskPriorityIcons, TaskStatusIcons, TaskTypeIcons } from '@/components/icons/task';
import DatePicker from '@/components/UI/DatePicker';
import { RichTextEditor } from '@/components/UI/RichTextEditor/RichTextEditor';
import Select, { SelectOption } from '@/components/UI/Select';
import TagInput from '@/components/UI/TagInput';
import TextInput from '@/components/UI/TextInput';
import UsersListInput from '@/components/UI/UsersListInput';
import {
  TASK_PRIORITY_LABEL,
  TASK_PRIORITY_VALUES,
  TASK_STATUS_LABEL,
  TASK_STATUS_VALUES,
  TASK_TYPE_LABEL,
  TASK_TYPE_VALUES,
} from '@/lib/constants/task';
import { getOrganizationUsers } from '@/lib/services/api/organization';
import { type CreateTaskInput } from '@/lib/services/api/task';
import useTaskBoardStore from '@/lib/store/board';
import { Task, TaskPriority, TaskStatus, TaskType } from '@/lib/types/task';

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

interface AddTaskFormProps {
  onClose: () => void;
  defaultStatus?: TaskStatus;
}

const AddTaskForm: FC<AddTaskFormProps> = ({ onClose, defaultStatus = 'todo' }) => {
  const [organizationUsers, setOrganizationUsers] = useState<Task['assignees']>([]);
  const [loadingAssignees, setLoadingAssignees] = useState(true);

  const addTask = useTaskBoardStore((state) => state.addTask);
  const currentBoardId = useTaskBoardStore((state) => state.currentBoardId);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormType>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'feature',
      priority: 'medium',
      status: defaultStatus,
      startDate: undefined,
      dueDate: new Date(),
      assignees: [],
      tags: [],
    },
  });

  useEffect(() => {
    const fetchOrganizationMembers = async () => {
      try {
        const response = await getOrganizationUsers();
        setOrganizationUsers((response.data as Task['assignees']) || []);
      } catch (error) {
        console.error('Failed to fetch organization users:', error);
      } finally {
        setLoadingAssignees(false);
      }
    };

    fetchOrganizationMembers();
  }, []);

  const onSubmit: SubmitHandler<TaskFormType> = async (data) => {
    if (!currentBoardId) return;

    const taskPayload: CreateTaskInput = { ...data, board: currentBoardId };
    await addTask(taskPayload);
    onClose();
  };

  const selectedType = watch('type');
  const selectedPriority = watch('priority');
  const selectedStatus = watch('status');
  const selectedAssignees = watch('assignees');
  const selectedTags = watch('tags');
  const selectedDueDate = watch('dueDate');

  const TypeIcon = TaskTypeIcons[selectedType];
  const PriorityIcon = TaskPriorityIcons[selectedPriority];
  const StatusIcon = TaskStatusIcons[selectedStatus];
  const selectedUsers = organizationUsers.filter((user) => selectedAssignees.includes(user._id));
  const fieldLabelClass = 'text-sm font-semibold text-gray-900';

  return (
    <form id="create-task-form" onSubmit={handleSubmit(onSubmit)} className="min-h-0">
      <div className="grid min-h-0 gap-0 lg:grid-cols-[minmax(0,1.75fr)_minmax(280px,0.95fr)]">
        <div className="min-w-0 space-y-6 p-5 lg:p-6">
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <TextInput
                label="Title"
                placeholder="e.g. Implement responsive navigation bar"
                error={errors.title?.message}
                labelClass={fieldLabelClass}
                containerClass="gap-2"
                className="min-h-11 rounded-xl border-gray-200 bg-white px-4 text-sm hover:border-gray-300"
                {...field}
              />
            )}
          />

          <div className="grid gap-4 md:grid-cols-3">
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select
                  label="Type"
                  options={taskTypeOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.type?.message}
                  labelClass={fieldLabelClass}
                  containerClass="gap-2"
                  className="min-h-11 rounded-xl border-gray-200 bg-white px-4"
                />
              )}
            />

            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  label="Status"
                  options={statusOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.status?.message}
                  labelClass={fieldLabelClass}
                  containerClass="gap-2"
                  className="min-h-11 rounded-xl border-gray-200 bg-white px-4"
                />
              )}
            />

            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <Select
                  label="Priority"
                  options={priorityOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.priority?.message}
                  labelClass={fieldLabelClass}
                  containerClass="gap-2"
                  className="min-h-11 rounded-xl border-gray-200 bg-white px-4"
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className={fieldLabelClass}>Description</label>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <TypeIcon size={14} />
                <span>{TASK_TYPE_LABEL[selectedType]}</span>
                <PriorityIcon size={14} className="ml-2" />
                <span>{TASK_PRIORITY_LABEL[selectedPriority]}</span>
                <StatusIcon size={14} className="ml-2" />
                <span>{TASK_STATUS_LABEL[selectedStatus]}</span>
              </div>
            </div>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={(value) => field.onChange(String(value))}
                  placeholder="Add a detailed description..."
                />
              )}
            />

            {errors.description?.message && (
              <p className="text-xs text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className={fieldLabelClass}>Tags</label>
            <Controller
              control={control}
              name="tags"
              render={({ field }) => (
                <div className="rounded-xl border border-gray-200 bg-white p-3">
                  <TagInput tags={field.value} onChange={field.onChange} disabled={isSubmitting} />
                </div>
              )}
            />
          </div>
        </div>

        <aside className="min-w-0 border-t border-gray-200 p-5 lg:border-t-0 lg:border-l lg:p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className={`inline-flex items-center gap-2 ${fieldLabelClass}`}>
                <Users size={16} className="text-gray-500" />
                Assignees
              </label>
              <Controller
                control={control}
                name="assignees"
                render={({ field }) => (
                  <div className="space-y-2">
                    <div className="rounded-xl border border-gray-200 bg-white p-3">
                      <UsersListInput
                        id="task-assignees"
                        users={selectedUsers}
                        availableUsers={organizationUsers}
                        onChange={(users) => field.onChange(users.map((user) => user._id))}
                        editable
                        loadingAvailableUsers={loadingAssignees}
                        emptyStateMessage="No teammates found"
                      />
                    </div>
                    {errors.assignees?.message && (
                      <p className="text-xs text-red-500">{errors.assignees.message}</p>
                    )}
                  </div>
                )}
              />
            </div>

            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <DatePicker
                  label="Start Date"
                  value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                  onChange={(e) =>
                    field.onChange(e.target.value ? new Date(e.target.value) : undefined)
                  }
                  error={errors.startDate?.message}
                  labelClass={`inline-flex items-center gap-2 ${fieldLabelClass}`}
                  containerClass="gap-2"
                  className="min-h-11 rounded-xl border-gray-200 bg-white px-4"
                />
              )}
            />

            <Controller
              control={control}
              name="dueDate"
              render={({ field }) => (
                <DatePicker
                  label="Due Date"
                  value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                  error={errors.dueDate?.message}
                  labelClass={`inline-flex items-center gap-2 ${fieldLabelClass}`}
                  containerClass="gap-2"
                  className="min-h-11 rounded-xl border-gray-200 bg-white px-4"
                />
              )}
            />

            <div className="space-y-2">
              <label className={`inline-flex items-center gap-2 ${fieldLabelClass}`}>
                <CalendarDays size={16} className="text-gray-500" />
                Summary
              </label>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                <div className="flex items-center justify-between py-1">
                  <span>Due date</span>
                  <span className="font-medium text-gray-900">
                    {selectedDueDate
                      ? new Date(selectedDueDate).toLocaleDateString(undefined, {
                          dateStyle: 'medium',
                        })
                      : 'Not set'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span>Assignees</span>
                  <span className="font-medium text-gray-900">{selectedAssignees.length}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span>Tags</span>
                  <span className="font-medium text-gray-900">{selectedTags.length}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
};

export default AddTaskForm;
