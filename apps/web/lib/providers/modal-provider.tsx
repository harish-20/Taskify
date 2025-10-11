"use client";

import { PropsWithChildren } from "react";

import useModalStore from "../store/modal";

import ConfirmModal from "@/components/modal/ConfirmModal";

import { AvailableModals } from "../store/modal/types";

const modalMap: Record<AvailableModals, React.FC<ModalProps & any>> = {
  confirm: ConfirmModal,
};

interface ModalProviderProps extends PropsWithChildren {}

const ModalProvider: React.FC<ModalProviderProps> = (props) => {
  const { children } = props;

  const { type, props: modalProps, closeModal } = useModalStore();

  if (!type) return <>{children}</>;

  const ModalToBeDisplyed = modalMap[type];

  return (
    <>
      {children}
      <ModalToBeDisplyed {...modalProps} onClose={closeModal} />
    </>
  );
};

export default ModalProvider;
