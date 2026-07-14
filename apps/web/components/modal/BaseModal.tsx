import { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import type { ModalProps } from '@/lib/types/components';

import usePortalTarget from '@/lib/hooks/usePortalTarget';

import Backdrop from '../UI/Backdrop';

interface BaseModalProps extends PropsWithChildren, ModalProps {}

const BaseModal: React.FC<BaseModalProps> = (props) => {
  const { onClose, children } = props;

  const target = usePortalTarget('modal');

  if (!target) return null;

  const modalElement = (
    <>
      <motion.div
        animate={{ translateY: ['-30%', '-50%'], opacity: [0, 1] }}
        exit={{ translateY: ['-50%', '-30%'], opacity: [1, 0] }}
        className="z-10 absolute top-1/2 left-1/2 -translate-x-1/2"
      >
        {children}
      </motion.div>

      <Backdrop onClose={onClose} />
    </>
  );

  const backdrop = createPortal(modalElement, target);

  return backdrop;
};

export default BaseModal;
