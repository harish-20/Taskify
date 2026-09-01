import { Types } from "mongoose";

import { getMilliSeconds } from "../utils/getMilliSeconds.js";

import redis from "./index.js";

const getBoardCacheKey = (organizationId: Types.ObjectId) =>
  `boards:${organizationId.toString()}`;

export const getCachedBoards = async (
  organizationId: Types.ObjectId,
  boardId?: string,
) => {
  const key = getBoardCacheKey(organizationId);
  const field = boardId ?? "no-board";

  const cached = await redis.hGet(key, field);

  return cached ? JSON.parse(cached) : null;
};

export const cacheBoards = async (
  organizationId: Types.ObjectId,
  boardId: string | undefined,
  tasks: unknown,
) => {
  const key = getBoardCacheKey(organizationId);
  const field = boardId ?? "no-board";

  await redis.hSet(key, field, JSON.stringify(tasks));

  await redis.expire(key, getMilliSeconds({ days: 2 }));
};

export const invalidateBoardCache = async (organizationId: Types.ObjectId) => {
  await redis.del(getBoardCacheKey(organizationId));
};
