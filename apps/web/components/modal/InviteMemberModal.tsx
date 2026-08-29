'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus, X } from 'lucide-react';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import BaseModal from './BaseModal';

import type { SelectOption } from '@/components/UI/Select';
import type { ModalProps } from '@/lib/types/components';

import Button from '@/components/UI/Button';
import Select from '@/components/UI/Select';
import TextInput from '@/components/UI/TextInput';
import { emailSchema } from '@/lib/schemas';
import { inviteMember } from '@/lib/services/api/organization';
import { UserRole } from '@/lib/types/user';

const inviteMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: emailSchema,
  role: z.enum(['admin', 'manager', 'lead', 'member'] as UserRole[]),
});

type InviteMemberFormType = z.infer<typeof inviteMemberSchema>;

const roleOptions: SelectOption<UserRole>[] = [
  { label: 'Admin', value: 'admin' },
  { label: 'Manager', value: 'manager' },
  { label: 'Lead', value: 'lead' },
  { label: 'Member', value: 'member' },
];

interface InviteMemberModalProps extends ModalProps {
  onInvited?: () => void;
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ onClose, onInvited }) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InviteMemberFormType>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: { name: '', email: '', role: 'member' },
  });

  const onSubmit: SubmitHandler<InviteMemberFormType> = async (data) => {
    try {
      setSubmitError(null);
      await inviteMember(data);
      onInvited?.();
      onClose();
    } catch (err) {
      setSubmitError((err as { message?: string })?.message ?? 'Failed to send invitation');
    }
  };

  return (
    <BaseModal onClose={onClose}>
      <div className="flex w-[min(96vw,28rem)] flex-col overflow-visible rounded-[24px] border border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
              <UserPlus size={18} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Invite Member</h2>
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
                label="Name"
                placeholder="Jane Doe"
                error={errors.name?.message}
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <TextInput
                label="Email"
                type="email"
                placeholder="jane@company.com"
                error={errors.email?.message}
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Select
                label="Role"
                options={roleOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.role?.message}
              />
            )}
          />

          {submitError && <p className="text-xs text-red-500">{submitError}</p>}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="secondary-dark" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Send Invite
            </Button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
};

export default InviteMemberModal;
