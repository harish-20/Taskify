'use client';

import { AnimatePresence } from 'motion/react';
import { PropsWithChildren, useMemo } from 'react';


import useModalStore from '../store/modal';
import { AvailableModals } from '../store/modal/types';

import type { ModalProps } from '@/lib/types/components';

import AddTaskModal from '@/components/modal/AddTaskModal/AddTaskModal';
import ConfirmModal from '@/components/modal/ConfirmModal';

const modalMap: Record<AvailableModals, React.FC<ModalProps & any>> = {
  confirm: ConfirmModal,
  'add-task': AddTaskModal,
};

interface ModalProviderProps extends PropsWithChildren {}

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const { type, props: modalProps, closeModal } = useModalStore();

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
