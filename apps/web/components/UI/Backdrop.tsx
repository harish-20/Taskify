import { Ref } from "react";
import { motion } from "motion/react";
import { createPortal } from "react-dom";

import usePortalTarget from "@/lib/hooks/usePortalTarget";

interface BackdropProps {
  onClose: () => void;
  ref?: Ref<any>;
}

const Backdrop: React.FC<BackdropProps> = (props) => {
  const { onClose } = props;

  const target = usePortalTarget("backdrop");

  if (!target) return null;

  const portal = createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute top-0 left-0 w-full h-screen bg-black/30"
      onClick={onClose}
    />,
    target
  );

  return portal;
};

export default Backdrop;
