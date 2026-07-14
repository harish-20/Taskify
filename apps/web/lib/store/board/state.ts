import { BoardState } from './types';

export const defaultState: BoardState = {
  tasks: [],
  draggedTask: null,
  draggedOverColumn: null,
  isDragging: false,
  isLoading: false,
};
