'use client';

import { ArrowRight, LayoutDashboard, Pencil, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import type { Board } from '@/lib/types/board';

import Button from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';
import { deleteBoard, getBoards } from '@/lib/services/api/board';
import useModalStore from '@/lib/store/modal';

export default function BoardPage() {
  const router = useRouter();
  const openModal = useModalStore((state) => state.openModal);
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const handleDelete = async (boardId: string, deleteTasks: boolean) => {
    try {
      await deleteBoard(boardId, deleteTasks);
      setBoards((currentBoards) => currentBoards.filter((board) => board._id !== boardId));
    } catch {
      setError('Unable to delete the board.');
    }
  };

  const confirmDelete = (board: Board) => {
    openModal('confirm', {
      title: 'Delete board',
      message: `Delete ${board.name}? Tasks kept will move to Backlog.`,
      confirmLabel: 'Delete board',
      checkboxLabel: 'Delete all tasks in this board',
      onConfirm: (deleteTasks: boolean) => void handleDelete(board._id, deleteTasks),
    });
  };

  const openBoardModal = (board?: Board) => {
    openModal('create-board', {
      board,
      onSaved: (savedBoard: Board, isNew: boolean) => {
        setBoards((currentBoards) =>
          isNew
            ? [savedBoard, ...currentBoards]
            : currentBoards.map((currentBoard) =>
                currentBoard._id === savedBoard._id ? savedBoard : currentBoard,
              ),
        );
      },
    });
  };

  return (
    <div className="mx-auto flex w-full flex-col gap-8 py-2">
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
          onClick={() => openBoardModal()}
          title="Create board"
        >
          <Plus size={18} /> Create board
        </Button>
      </header>

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
          <Card
            padding="md"
            radius="md"
            hover
            className="group flex min-h-44 flex-col gap-4 border-dashed"
          >
            <div className="flex items-start justify-between gap-3">
              <button
                type="button"
                onClick={() => router.push('/board/backlog')}
                className="min-w-0 text-left"
                title="Open backlog"
              >
                <h2 className="truncate text-lg font-semibold text-gray-950">Backlog</h2>
                <p className="mt-2 text-sm text-gray-600">Tasks not assigned to a board</p>
              </button>
            </div>
            <button
              type="button"
              onClick={() => router.push('/board/backlog')}
              className="mt-auto flex items-center gap-2 self-start text-sm font-semibold text-primary cursor-pointer hover:underline"
            >
              Open backlog <ArrowRight size={16} />
            </button>
          </Card>
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
                    onClick={() => openBoardModal(board)}
                    className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-950"
                    aria-label={`Edit ${board.name}`}
                    title="Edit board"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => confirmDelete(board)}
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
                className="mt-auto flex items-center gap-2 self-start text-sm font-semibold text-primary cursor-pointer hover:underline"
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
