import config from 'config';
import express, { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${config.get<string>('baseApiUrl')}/failed`,
  }),
  (_req: express.Request, res: express.Response) => {
    res.redirect('/profile');
  },
);

router.get('/failed', (_req: express.Request, res: express.Response) =>
  res.send('You Failed to log in!'),
);

router.post(
  '/logout',
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    req.logout(err => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  },
);

export default router;
