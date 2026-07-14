import { RequestHandler } from "express";

export const getUser: RequestHandler = (req, res, next) => {
  try {
    const user = req.userObj;

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
