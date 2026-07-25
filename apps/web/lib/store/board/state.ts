import { BoardState } from './types';

export const defaultState: BoardState = {
  tasks: [],
  organizationUsers: [],
  draggedTask: null,
  draggedOverColumn: null,
  isDragging: false,
  isLoading: false,
};
