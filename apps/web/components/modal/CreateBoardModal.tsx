'use client';

import { LayoutDashboard, X } from 'lucide-react';
import { FormEvent, useState } from 'react';

import BaseModal from './BaseModal';

import type { Board } from '@/lib/types/board';
import type { ModalProps } from '@/lib/types/components';

import Button from '@/components/UI/Button';
import TextInput from '@/components/UI/TextInput';
import { BoardInput, createBoard, updateBoard } from '@/lib/services/api/board';

interface CreateBoardModalProps extends ModalProps {
  board?: Board;
  onSaved: (board: Board, isNew: boolean) => void;
}

const CreateBoardModal: React.FC<CreateBoardModalProps> = ({ board, onClose, onSaved }) => {
  const [draft, setDraft] = useState<BoardInput>({
    name: board?.name ?? '',
    description: board?.description ?? '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = Boolean(board);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const response = board ? await updateBoard(board._id, draft) : await createBoard(draft);
      if (response.data) {
        onSaved(response.data, !board);
        onClose();
      }
    } catch {
      setError('Unable to save the board.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BaseModal onClose={onClose}>
      <div className="flex w-[min(96vw,30rem)] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
              <LayoutDashboard size={18} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Edit board' : 'Create board'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            aria-label="Close modal"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <TextInput
            required
            label="Board name"
            value={draft.name}
            onChange={(event) => setDraft({ ...draft, name: event.target.value })}
            error={error ?? undefined}
            autoFocus
          />
          <TextInput
            label="Description"
            value={draft.description}
            onChange={(event) => setDraft({ ...draft, description: event.target.value })}
            placeholder="What is this board for?"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary-dark" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isSaving}>
              {isEditing ? 'Save changes' : 'Create board'}
            </Button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
};

export default CreateBoardModal;
