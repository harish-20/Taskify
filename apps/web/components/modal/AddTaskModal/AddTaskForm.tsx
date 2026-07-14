'use client';

import { FC } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import TaskSchema, { TaskFormType } from './task.schema';

import { createTask } from '@/lib/services/api/task';

import TextInput from '@/components/UI/TextInput';
import DatePicker from '@/components/UI/DatePicker';
import Button from '@/components/UI/Button';

import { priorityOptions, statusOptions, taskTypeOptions } from './options';
import Select from '@/components/UI/Select';

interface AddTaskFormProps {
  onClose: () => void;
}

const AddTaskForm: FC<AddTaskFormProps> = ({ onClose }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormType>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'feature',
      priority: 'medium',
      status: 'todo',
      dueDate: new Date(),
      // TODO need to add assignee real when the endpoint is created
      assignees: ['test'],
      tags: [],
    },
  });

  const onSubmit: SubmitHandler<TaskFormType> = async (data) => {
    await createTask(data);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <TextInput
        label="Title"
        placeholder="Enter task title"
        error={errors.title?.message}
        {...register('title')}
      />

      <TextInput
        label="Description"
        placeholder="Task description"
        error={errors.description?.message}
        {...register('description')}
      />

      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <Select
            label="Task Type"
            options={taskTypeOptions}
            value={field.value}
            onChange={field.onChange}
            error={errors.type?.message}
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
          />
        )}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary-dark" onClick={onClose}>
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default AddTaskForm;
