import express from 'express';
import config from 'config';
import passport, { DoneCallback, Profile } from 'passport';
import GoogleStrategy, {
  GoogleCallbackParameters,
  VerifyCallback,
} from 'passport-google-oauth20';
import { findOrCreateProfile } from '../utils/passport-helper';

// Used to serialize the user for the session
passport.serializeUser(function (user, done: DoneCallback) {
  done(null, user);
});

// Used to deserialize the user
passport.deserializeUser(function (user: Express.User, done) {
  return done(null, user);
});

// Google strategy
passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: config.get<string>('credentials.google.clientId'),
      clientSecret: config.get<string>('credentials.google.clientSecret'),
      callbackURL: config.get<string>('credentials.google.callbackURL'),
      passReqToCallback: true,
    },
    (
      _req: express.Request,
      _accessToken: string,
      _refreshToken: string,
      _params: GoogleCallbackParameters,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      findOrCreateProfile(profile).then(({ err, user }) => {
        if (err) {
          return done(err);
        }
        done(null, user as Express.User);
      });
    },
  ),
);
