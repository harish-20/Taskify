'use client';

import { AnimatePresence } from 'motion/react';
import { PropsWithChildren, useMemo } from 'react';

import useModalStore from '../store/modal';
import { AvailableModals } from '../store/modal/types';

import type { ModalProps } from '@/lib/types/components';

import AddTaskModal from '@/components/modal/AddTaskModal/AddTaskModal';
import ConfirmModal from '@/components/modal/ConfirmModal';
import CreateTeamModal from '@/components/modal/CreateTeamModal';
import InviteMemberModal from '@/components/modal/InviteMemberModal';
import TaskPreviewModal from '@/components/modal/TaskPreviewModal';

const modalMap: Record<AvailableModals, React.FC<ModalProps & any>> = {
  confirm: ConfirmModal,
  'add-task': AddTaskModal,
  'task-preview': TaskPreviewModal,
  'invite-member': InviteMemberModal,
  'create-team': CreateTeamModal,
};

interface ModalProviderProps extends PropsWithChildren {}

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const type = useModalStore((state) => state.type);
  const modalProps = useModalStore((state) => state.props);
  const closeModal = useModalStore((state) => state.closeModal);

  const ModalToRender = useMemo(() => (type ? modalMap[type] : null), [type]);

  return (
    <>
      {children}

      <AnimatePresence mode="wait">
        {ModalToRender && <ModalToRender key={type} {...modalProps} onClose={closeModal} />}
      </AnimatePresence>
    </>
  );
};

export default ModalProvider;
