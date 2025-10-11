import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

import usePortalTarget from "@/lib/hooks/usePortalTarget";

import Backdrop from "../UI/Backdrop";

interface BaseModalProps extends PropsWithChildren, ModalProps {}

const BaseModal: React.FC<BaseModalProps> = (props) => {
  const { onClose, children } = props;

  const target = usePortalTarget("modal");

  if (!target) return null;

  const modalElement = (
    <>
      <div className="fixed top-1/2 left-1/2 translate-x-1/2 translate-y-1/2">
        {children}
      </div>

      <Backdrop onClose={onClose} />
    </>
  );

  const backdrop = createPortal(modalElement, target);

  return backdrop;
};

export default BaseModal;
