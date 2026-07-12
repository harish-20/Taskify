import { useCallback } from 'react';

import useTaskBoardStore from '@/lib/store/board';
import { Task, TaskStatus } from '@/lib/types/task';

const useDnd = () => {
  const {
    draggedTask,
    draggedOverColumn,
    isDragging,
    moveTask,
    setDraggedTask,
    setDraggedOverColumn,
    setIsDragging,
    updateTaskStatus,
  } = useTaskBoardStore();

  const handleDragStart = useCallback(
    (taskId: Task['_id'], e: React.DragEvent<HTMLDivElement>) => {
      setDraggedTask(taskId);
      setIsDragging(true);
    },
    [setDraggedTask, setIsDragging],
  );

  const handleDragEnd = useCallback(() => {
    setDraggedTask(null);
    setIsDragging(false);
  }, [setDraggedTask, setIsDragging]);

  const handleDragOver = useCallback(
    (status: TaskStatus) => {
      setDraggedOverColumn(status);
    },
    [setDraggedOverColumn],
  );

  const handleDrop = useCallback(
    async (status: TaskStatus, e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!draggedTask) return;

      setDraggedTask(null);
      setDraggedOverColumn(null);
      setIsDragging(false);

      moveTask(draggedTask, status);
      await updateTaskStatus(draggedTask, status);
    },
    [draggedTask, moveTask, setDraggedTask, setDraggedOverColumn, setIsDragging, updateTaskStatus],
  );

  return {
    draggedTask,
    draggedOverColumn,
    isDragging,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  };
};

export default useDnd;
