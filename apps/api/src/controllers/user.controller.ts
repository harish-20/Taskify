import { RequestHandler } from "express";

export const getUser: RequestHandler = (req, res, next) => {
  res.status(200).send("user");
};
