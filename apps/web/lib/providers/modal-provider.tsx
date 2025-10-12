"use client";

import { PropsWithChildren, useMemo } from "react";
import { AnimatePresence } from "motion/react";

import ConfirmModal from "@/components/modal/ConfirmModal";

import useModalStore from "../store/modal";

import { AvailableModals } from "../store/modal/types";

const modalMap: Record<AvailableModals, React.FC<ModalProps & any>> = {
  confirm: ConfirmModal,
};

interface ModalProviderProps extends PropsWithChildren {}

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const { type, props: modalProps, closeModal } = useModalStore();

  const ModalToRender = useMemo(() => (type ? modalMap[type] : null), [type]);

  return (
    <>
      {children}

      <AnimatePresence mode="wait">
        {ModalToRender && (
          <ModalToRender key={type} {...modalProps} onClose={closeModal} />
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalProvider;
