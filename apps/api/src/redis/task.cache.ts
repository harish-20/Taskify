import { Types } from "mongoose";

import { getMilliSeconds } from "../utils/getMilliSeconds.js";

import redis from "./redis.client.js";

const getTaskCacheKey = (organizationId: Types.ObjectId) =>
  `tasks:${organizationId.toString()}`;

export const getCachedTasks = async (
  organizationId: Types.ObjectId,
  boardId?: string,
) => {
  const key = getTaskCacheKey(organizationId);
  const field = boardId ?? "no-board";

  const cached = await redis.hGet(key, field);

  return cached ? JSON.parse(cached) : null;
};

export const cacheTasks = async (
  organizationId: Types.ObjectId,
  boardId: string | undefined,
  tasks: unknown,
) => {
  const key = getTaskCacheKey(organizationId);
  const field = boardId ?? "no-board";

  await redis.hSet(key, field, JSON.stringify(tasks));

  await redis.expire(key, getMilliSeconds({ days: 2 }));
};

export const invalidateTaskCache = async (organizationId: Types.ObjectId) => {
  await redis.del(getTaskCacheKey(organizationId));
};
