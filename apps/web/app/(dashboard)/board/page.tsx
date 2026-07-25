'use client';

import { DragDropProvider } from '@dnd-kit/react';
import { useEffect } from 'react';

import Board from '@/components/board/Board';
import HeadSection from '@/components/board/HeadSection';
import useTaskBoardStore from '@/lib/store/board';

export default function BoardPage() {
  const loadTasks = useTaskBoardStore((state) => state.loadTasks);
  const loadOrganizationUsers = useTaskBoardStore((state) => state.loadOrganizationUsers);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    void loadOrganizationUsers();
  }, [loadOrganizationUsers]);

  return (
    <DragDropProvider>
      <div className="flex-1 flex flex-col gap-8">
        <HeadSection />
        <Board />
      </div>
    </DragDropProvider>
  );
}
