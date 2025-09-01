import { IUser } from "../models/user.model";

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
      user?: IUser;
    }
  }
}
