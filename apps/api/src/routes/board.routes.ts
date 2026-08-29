import { Router } from "express";

import {
  createBoard,
  deleteBoard,
  getBoard,
  getBoards,
  updateBoard,
} from "../controllers/board.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  validateParams,
  validateRequest,
} from "../middlewares/validate.middleware.js";
import {
  boardIdParamSchema,
  createBoardSchema,
  updateBoardSchema,
} from "../schemas/board.schema.js";

const boardRouter = Router();

boardRouter.get("/", authMiddleware, getBoards);
boardRouter.post(
  "/",
  authMiddleware,
  validateRequest(createBoardSchema),
  createBoard,
);
boardRouter.get(
  "/:boardId",
  authMiddleware,
  validateParams(boardIdParamSchema),
  getBoard,
);
boardRouter.patch(
  "/:boardId",
  authMiddleware,
  validateParams(boardIdParamSchema),
  validateRequest(updateBoardSchema),
  updateBoard,
);
boardRouter.delete(
  "/:boardId",
  authMiddleware,
  validateParams(boardIdParamSchema),
  deleteBoard,
);

export default boardRouter;
