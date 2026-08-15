'use client';

import TaskListItem from './TaskListItem';

import { Task } from '@/lib/types/task';

interface SubtaskCandidateRowProps {
  task: Task;
  isAdding: boolean;
  onAdd: (task: Task) => void;
}

const SubtaskCandidateRow: React.FC<SubtaskCandidateRowProps> = ({ task, isAdding, onAdd }) => (
  <TaskListItem task={task} onClick={() => onAdd(task)} disabled={isAdding} />
);

export default SubtaskCandidateRow;
