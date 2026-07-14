import { create } from 'zustand';

import { defaultState } from './state';
import { boardActions } from './actions';
import { boardAsyncActions } from './asyncActions';
import { BoardStore } from './types';

export const useTaskBoardStore = create<BoardStore>((set, get, store) => ({
  ...defaultState,
  ...boardActions(set, get, store),
  ...boardAsyncActions(set, get, store),
}));

export default useTaskBoardStore;