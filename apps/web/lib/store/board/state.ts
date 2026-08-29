import { BoardState } from './types';

export const defaultState: BoardState = {
  tasks: [],
  currentBoardId: null,
  tasksMovingStatus: {},
  organizationUsers: [],
  draggedTask: null,
  draggedTaskHeight: null,
  feedbackTaskPosition: null,
  draggedOverColumn: null,
  isDragging: false,
  isLoading: false,
};
