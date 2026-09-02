'use client';

import { DragDropProvider } from '@dnd-kit/react';
import { useEffect, useState } from 'react';

import Board from '@/app/(dashboard)/board/components/Board';
import HeadSection from '@/app/(dashboard)/board/components/HeadSection';
import Spinner from '@/components/UI/Spinner';
import { getBoard } from '@/lib/services/api/board';
import useTaskBoardStore from '@/lib/store/board';

interface BoardKanbanPageProps {
  params: Promise<{ boardId: string }>;
}

export default function BoardKanbanPage({ params }: BoardKanbanPageProps) {
  const [boardId, setBoardId] = useState<string | null>(null);
  const [boardName, setBoardName] = useState('');
  const loadTasks = useTaskBoardStore((state) => state.loadTasks);
  const isBoardLoading = useTaskBoardStore((state) => state.isLoading);
  const loadOrganizationUsers = useTaskBoardStore((state) => state.loadOrganizationUsers);
  const resetBoard = useTaskBoardStore((state) => state.reset);

  useEffect(() => {
    void params.then(({ boardId: resolvedBoardId }) => setBoardId(resolvedBoardId));
  }, [params]);

  useEffect(() => {
    if (!boardId) return;
    const isBacklog = boardId === 'backlog';
    void loadTasks(isBacklog ? undefined : boardId);
    void loadOrganizationUsers();
    if (isBacklog) {
      setBoardName('Backlog');
    } else {
      void getBoard(boardId).then((response) => {
        if (response.data) setBoardName(response.data.name);
      });
    }

    return resetBoard;
  }, [boardId, loadOrganizationUsers, loadTasks]);

  if (!boardId) return null;

  if (isBoardLoading)
    return (
      <div className="w-full min-h-[40vh] flex items-center justify-center">
        <Spinner size="md" />
      </div>
    );

  return (
    <DragDropProvider>
      <div className="h-[calc(100vh-92px)] md:h-[calc(100vh-124px)] flex-1 flex flex-col gap-8">
        <HeadSection boardName={boardName} />
        <Board />
      </div>
    </DragDropProvider>
  );
}
