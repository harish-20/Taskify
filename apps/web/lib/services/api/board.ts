import { ApiResponse } from '@repo/shared/types';

import pathMap from './pathMap';

import Api from '.';

import type { Board } from '@/lib/types/board';

export interface BoardInput {
  name: string;
  description?: string;
}

export const getBoards = async () => {
  const response = await Api.get<ApiResponse<Board[]>>(pathMap.board.list);
  return response.data;
};

export const getBoard = async (boardId: string) => {
  const response = await Api.get<ApiResponse<Board>>(pathMap.board.byId(boardId));
  return response.data;
};

export const createBoard = async (board: BoardInput) => {
  const response = await Api.post<ApiResponse<Board>>(pathMap.board.create, board);
  return response.data;
};

export const updateBoard = async (boardId: string, board: BoardInput) => {
  const response = await Api.patch<ApiResponse<Board>>(pathMap.board.byId(boardId), board);
  return response.data;
};

export const deleteBoard = async (boardId: string) => {
  const response = await Api.delete<ApiResponse<null>>(pathMap.board.byId(boardId));
  return response.data;
};
