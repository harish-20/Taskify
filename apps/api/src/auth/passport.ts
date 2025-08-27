import passport from "passport";

import { Strategy } from "passport-local";

import { validateUser } from "../services/auth.service.js";
import logger from "../utils/logger.js";

passport.use(
  new Strategy({ usernameField: "email" }, async (username, password, done) => {
    try {
      const user = await validateUser(username, password);

      done(null, user);
    } catch (err) {
      done(err, false);
    }
  })
);
