import BaseModal from "./BaseModal";

interface ConfirmModalProps extends ModalProps {}

const ConfirmModal: React.FC<ConfirmModalProps> = (props) => {
  const { onClose } = props;

  return (
    <BaseModal onClose={onClose}>
      <h1>Hello</h1>
    </BaseModal>
  );
};
export default ConfirmModal;
