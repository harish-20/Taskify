'use client';

import { ArrowRight, LayoutDashboard, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

import type { Board } from '@/lib/types/board';

import Button from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';
import {
  BoardInput,
  createBoard,
  deleteBoard,
  getBoards,
  updateBoard,
} from '@/lib/services/api/board';

const emptyBoard: BoardInput = { name: '', description: '' };

export default function BoardPage() {
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [draft, setDraft] = useState<BoardInput>(emptyBoard);
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBoards = async () => {
    setIsLoading(true);
    try {
      const response = await getBoards();
      setBoards(response.data ?? []);
    } catch {
      setError('Unable to load boards.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadBoards();
  }, []);

  const closeForm = () => {
    setDraft(emptyBoard);
    setEditingBoardId(null);
    setIsFormOpen(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (editingBoardId) {
        const response = await updateBoard(editingBoardId, draft);
        if (response.data) {
          setBoards((currentBoards) =>
            currentBoards.map((board) => (board._id === editingBoardId ? response.data! : board)),
          );
        }
      } else {
        const response = await createBoard(draft);
        if (response.data) setBoards((currentBoards) => [response.data!, ...currentBoards]);
      }
      closeForm();
    } catch {
      setError('Unable to save the board.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (boardId: string) => {
    if (!window.confirm('Delete this board? Its tasks will be kept.')) return;

    try {
      await deleteBoard(boardId);
      setBoards((currentBoards) => currentBoards.filter((board) => board._id !== boardId));
    } catch {
      setError('Unable to delete the board.');
    }
  };

  const startEditing = (board: Board) => {
    setDraft({ name: board.name, description: board.description ?? '' });
    setEditingBoardId(board._id);
    setIsFormOpen(true);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 py-2">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-light text-primary">
            <LayoutDashboard size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-950">Boards</h1>
            <p className="mt-1 text-sm text-gray-600">Your organization workspaces</p>
          </div>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => setIsFormOpen(true)}
          title="Create board"
        >
          <Plus size={18} /> Create board
        </Button>
      </header>

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="grid gap-3 border-b border-gray-200 pb-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_auto] md:items-end"
        >
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-800">
            Board name
            <input
              required
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              className="min-h-10 rounded-md border border-gray-300 px-3 outline-none focus:border-black"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-800">
            Description
            <input
              value={draft.description}
              onChange={(event) => setDraft({ ...draft, description: event.target.value })}
              className="min-h-10 rounded-md border border-gray-300 px-3 outline-none focus:border-black"
            />
          </label>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
              aria-label="Cancel board editing"
              title="Cancel"
            >
              <X size={20} />
            </button>
          </div>
        </form>
      )}

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-600">Loading boards...</p>
      ) : boards.length === 0 ? (
        <div className="border border-dashed border-gray-300 py-14 text-center text-sm text-gray-600">
          No boards yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => (
            <Card
              key={board._id}
              padding="md"
              radius="md"
              hover
              className="group flex min-h-44 flex-col gap-4"
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => router.push(`/board/${board._id}`)}
                  className="min-w-0 text-left"
                  title={`Open ${board.name}`}
                >
                  <h2 className="truncate text-lg font-semibold text-gray-950">{board.name}</h2>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                    {board.description || 'No description'}
                  </p>
                </button>
                <div className="flex shrink-0 gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => startEditing(board)}
                    className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-950"
                    aria-label={`Edit ${board.name}`}
                    title="Edit board"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(board._id)}
                    className="rounded-md p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Delete ${board.name}`}
                    title="Delete board"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => router.push(`/board/${board._id}`)}
                className="mt-auto flex items-center gap-2 self-start text-sm font-semibold text-primary hover:underline"
              >
                Open board <ArrowRight size={16} />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
