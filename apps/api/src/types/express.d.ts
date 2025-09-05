import { IUser } from "../models/user.model.ts";

/**
 * Extends Express Request type to include the authenticated user.
 * This allows accessing `req.user` in controllers and middlewares
 * without needing to redefine or cast the request type everywhere.
 *
 * Example:
 *    app.get("/me", (req, res) => {
 *      console.log(req.user?.email);
 *    });
 */
declare global {
  namespace Express {
    interface Request {
      userObj?: IUser;
    }
  }
}
