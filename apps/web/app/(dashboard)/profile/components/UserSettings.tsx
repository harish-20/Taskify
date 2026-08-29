'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ImagePlus, LockKeyhole, LogOut, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import Avatar from '@/components/UI/Avatar';
import Button from '@/components/UI/Button';
import ErrorText from '@/components/UI/ErrorText';
import SubTitle from '@/components/UI/SubTitle';
import TextInput from '@/components/UI/TextInput';
import Title from '@/components/UI/Title';
import { useApi } from '@/lib/hooks/useApi';
import { useAuthStore } from '@/lib/providers/auth-store-provider';
import { updateAvatar, updateMe } from '@/lib/services/api/auth';
import { customLocalStorage } from '@/lib/services/localStorage';
import useModalStore from '@/lib/store/modal';

const settingsSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(80, 'Name is too long'),
});

type SettingsForm = z.infer<typeof settingsSchema>;

const UserSettings = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const openModal = useModalStore((state) => state.openModal);
  const [saved, setSaved] = useState(false);
  const [avatarSaved, setAvatarSaved] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const { execute, error, loading } = useApi(updateMe);
  const avatarUpload = useApi(updateAvatar);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: { name: user?.name ?? '' },
  });

  useEffect(() => {
    reset({ name: user?.name ?? '' });
  }, [reset, user?.name]);

  const onSubmit: SubmitHandler<SettingsForm> = async ({ name }) => {
    setSaved(false);
    try {
      const response = await execute(name);
      if (response.data) {
        setUser(response.data);
        reset({ name: response.data.name });
        setSaved(true);
      }
    } catch {
      setSaved(false);
    }
  };

  const onAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarSaved(false);
    try {
      const response = await avatarUpload.execute(file);
      if (response.data) {
        setUser(response.data);
        setAvatarSaved(true);
      }
    } catch {
      setAvatarSaved(false);
    } finally {
      event.target.value = '';
    }
  };

  const handleLogout = () => {
    customLocalStorage.removeValue('accessToken');
    customLocalStorage.removeValue('refreshToken');
    clearAuth();
    router.replace('/signin');
  };

  const confirmLogout = () => {
    openModal('confirm', {
      title: 'Log out',
      message: 'Are you sure you want to log out?',
      confirmLabel: 'Log out',
      onConfirm: handleLogout,
    });
  };

  return (
    <section className="grid w-full gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3">
            <Avatar name={user?.name} src={user?.avatarUrl} size="xl" bordered />
            <div>
              <Title order={2} size="sm">
                Profile photo
              </Title>
              <SubTitle size="sm" variant="secondary">
                Use a clear image so your team can recognize you.
              </SubTitle>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={avatarInputRef}
              className="hidden"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={onAvatarChange}
            />
            <Button
              type="button"
              variant="secondary"
              loading={avatarUpload.loading}
              onClick={() => avatarInputRef.current?.click()}
            >
              <ImagePlus className="mr-2 h-4 w-4" aria-hidden="true" />
              Change photo
            </Button>
          </div>
        </div>
        {avatarUpload.error && <ErrorText className="mb-4">{avatarUpload.error.message}</ErrorText>}
        {avatarSaved && (
          <div className="mb-4 flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-2 text-sm text-emerald-700">
            <Check className="h-4 w-4" aria-hidden="true" />
            Profile photo updated successfully.
          </div>
        )}
        <div className="mb-6 flex items-start gap-3 border-b border-gray-100 pb-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
            <UserRound className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <Title order={2} size="sm">
              Personal details
            </Title>
            <SubTitle size="sm" variant="secondary">
              Your name is visible to members of your workspace.
            </SubTitle>
          </div>
        </div>

        {error && <ErrorText className="mb-4">{error.message}</ErrorText>}
        {saved && (
          <div className="mb-4 flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-2 text-sm text-emerald-700">
            <Check className="h-4 w-4" aria-hidden="true" />
            Changes saved successfully.
          </div>
        )}

        <form className="flex max-w-xl flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="Full name"
            id="name"
            placeholder="Your full name"
            autoComplete="name"
            {...register('name')}
            error={errors.name?.message}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm text-dark-gray" htmlFor="email">
              Email address
            </label>
            <div className="relative">
              <TextInput id="email" value={user?.email ?? ''} disabled className="w-full pr-10" />
              <LockKeyhole
                className="absolute right-3 top-2.5 h-4 w-4 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <p className="text-xs text-gray-500">
              Email changes are managed by your sign-in provider.
            </p>
          </div>
          <div className="flex justify-end border-t border-gray-100 pt-4">
            <Button type="submit" loading={loading} disabled={!isDirty}>
              Save changes
            </Button>
          </div>
        </form>
      </div>

      <aside className="rounded-xl border border-gray-200 bg-gray-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Account</p>
        <p className="mt-2 break-words text-sm font-medium text-gray-800">{user?.email}</p>
        <p className="mt-1 text-sm text-gray-500">
          Signed in with {user?.provider ?? 'your account'}.
        </p>
        {user?.role && (
          <span className="mt-3 inline-block rounded-full bg-primary-light px-3 py-1 text-xs font-medium capitalize text-primary">
            {user.role}
          </span>
        )}
        <Button
          type="button"
          variant="secondary-dark"
          className="mt-6 w-full"
          onClick={confirmLogout}
        >
          <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
          Log out
        </Button>
      </aside>
    </section>
  );
};

export default UserSettings;
