import passport from "passport";

import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { validateUser } from "../services/auth.service.js";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../configs/index.js";
import { handleGoogleUser } from "../services/user.service.js";

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (username, password, done) => {
      try {
        const user = await validateUser(username, password);

        done(null, user);
      } catch (err) {
        done(err, false);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID as string,
      clientSecret: GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:3000",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await handleGoogleUser(profile);
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);
