import { Router } from 'express';
import config from 'config';
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
  (_req, res) => {
    res.redirect('/profile');
  },
);

router.get('/failed', (_req, res) => res.send('You Failed to log in!'));

router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});

export default router;
