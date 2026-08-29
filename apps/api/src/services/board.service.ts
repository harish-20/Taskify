import { Types } from "mongoose";

import { Board } from "../models/board.model.js";
import { Task } from "../models/task.model.js";
import { CreateBoardInput, UpdateBoardInput } from "../schemas/board.schema.js";
import { NotFound } from "../utils/CustomError.js";

const DEFAULT_COLUMNS = [
  { name: "To do", order: 0 },
  { name: "In progress", order: 1 },
  { name: "Review", order: 2 },
  { name: "Done", order: 3 },
];

export const getBoards = (organizationId: Types.ObjectId) =>
  Board.find({ organization: organizationId, isArchived: false }).sort({
    updatedAt: -1,
  });

export const getBoard = async (
  boardId: string,
  organizationId: Types.ObjectId,
) => {
  const board = await Board.findOne({
    _id: boardId,
    organization: organizationId,
    isArchived: false,
  });

  if (!board) {
    throw new NotFound("Board not found");
  }

  return board;
};

export const createBoard = (
  input: CreateBoardInput,
  userId: Types.ObjectId,
  organizationId: Types.ObjectId,
) =>
  Board.create({
    ...input,
    organization: organizationId,
    createdBy: userId,
    members: input.members?.length ? input.members : [userId],
    columns: input.columns?.length ? input.columns : DEFAULT_COLUMNS,
  });

export const updateBoard = async (
  boardId: string,
  input: UpdateBoardInput,
  organizationId: Types.ObjectId,
) => {
  const board = await Board.findOneAndUpdate(
    { _id: boardId, organization: organizationId, isArchived: false },
    input,
    { new: true, runValidators: true },
  );

  if (!board) {
    throw new NotFound("Board not found");
  }

  return board;
};

export const archiveBoard = async (
  boardId: string,
  organizationId: Types.ObjectId,
  deleteTasks = false,
) => {
  const board = await Board.findOneAndUpdate(
    { _id: boardId, organization: organizationId, isArchived: false },
    { isArchived: true },
    { new: true },
  );

  if (!board) {
    throw new NotFound("Board not found");
  }

  await Task.updateMany(
    { board: board._id, organizationId, isDeleted: false },
    deleteTasks ? { isDeleted: true } : { $unset: { board: 1 } },
  );

  return board;
};
