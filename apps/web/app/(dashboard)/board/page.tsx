'use client';

import { useEffect } from 'react';

import Board from '@/components/board/Board';
import HeadSection from '@/components/board/HeadSection';

import useTaskBoardStore from '@/lib/store/board';
import { DragDropProvider } from '@dnd-kit/react';

export default function BoardPage() {
  const loadTasks = useTaskBoardStore((state) => state.loadTasks);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  return (
    <DragDropProvider>
      <div className="flex-1 flex flex-col gap-8">
        <HeadSection />
        <Board />
      </div>
    </DragDropProvider>
  );
}
