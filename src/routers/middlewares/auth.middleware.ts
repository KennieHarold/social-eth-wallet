import express from 'express';

export const isLoggedIn = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (req.isAuthenticated() && req.user) {
    next();
  } else {
    res.redirect('/login');
  }
};
