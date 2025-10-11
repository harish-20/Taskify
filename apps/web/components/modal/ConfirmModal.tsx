import Button from "../UI/Button";
import BaseModal from "./BaseModal";

interface ConfirmModalProps extends ModalProps {
  onConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = (props) => {
  const { onClose } = props;

  return (
    <BaseModal onClose={onClose}>
      <div className="bg-white rounded-lg min-w-md">
        <h2 className="text-xl p-4 text-center">Confirm</h2>
        <hr className="text-gray-400" />

        <div className="p-4 min-h-[160px] flex flex-col justify-between">
          <p className="">Do you want to delete this task</p>

          <div className="flex gap-4 justify-center">
            <Button size="md" variant="secondary-dark" onClick={onClose}>
              Cancel
            </Button>
            <Button size="md" onClick={onClose}>
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};
export default ConfirmModal;
