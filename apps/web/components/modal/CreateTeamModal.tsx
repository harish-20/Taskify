'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Users, X } from 'lucide-react';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import BaseModal from './BaseModal';

import type { ModalProps } from '@/lib/types/components';

import Button from '@/components/UI/Button';
import MultiSelectInput from '@/components/UI/MultiSelectInput';
import TextInput from '@/components/UI/TextInput';
import { useAuthStore } from '@/lib/providers/auth-store-provider';
import { createTeam } from '@/lib/services/api/team';
import { User } from '@/lib/types/user';

const createTeamSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
  description: z.string().optional(),
  members: z.array(z.string()),
});

type CreateTeamFormType = z.infer<typeof createTeamSchema>;

interface CreateTeamModalProps extends ModalProps {
  organizationUsers: User[];
  onCreated?: () => void;
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  onClose,
  organizationUsers,
  onCreated,
}) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateTeamFormType>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: { name: '', description: '', members: [] },
  });

  const memberOptions = organizationUsers.map((member) => ({
    label: member.name,
    value: member._id,
  }));

  const onSubmit: SubmitHandler<CreateTeamFormType> = async (data) => {
    try {
      setSubmitError(null);
      if (!user?.organizationId) return;

      await createTeam({ ...data, organizationId: user.organizationId });
      onCreated?.();
      onClose();
    } catch (err) {
      setSubmitError((err as { message?: string })?.message ?? 'Failed to create team');
    }
  };

  return (
    <BaseModal onClose={onClose}>
      <div className="flex w-[min(96vw,28rem)] flex-col overflow-visible rounded-[24px] border border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
              <Users size={18} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Create Team</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5">
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <TextInput
                label="Team Name"
                placeholder="Engineering"
                error={errors.name?.message}
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <TextInput
                label="Description"
                placeholder="What does this team do?"
                error={errors.description?.message}
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="members"
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                <label className="text-sm text-dark-gray">Members</label>
                <MultiSelectInput
                  options={memberOptions}
                  selectedValues={field.value}
                  onChange={field.onChange}
                  placeholder="Select members..."
                />
              </div>
            )}
          />

          {submitError && <p className="text-xs text-red-500">{submitError}</p>}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="secondary-dark" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Create Team
            </Button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
};

export default CreateTeamModal;
