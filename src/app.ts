import express from 'express';
import session from 'express-session';
import path from 'path';
import { createServer } from 'http';
import config from 'config';
import passport from 'passport';
import { log, reportError } from '@/utils/logger';
import AuthRouter from '@/routers/auth.router';
import WalletRouter from '@/routers/wallet.router';
import { connect } from '@/config/mongodb.config';
import '@/config/passport.config';
import {
  checkLoggedInThenRedirectProfile,
  isLoggedIn,
} from './routers/middlewares/auth.middleware';
import Wallet from './models/wallet.model';
import { IUser } from './models/user.model';
import { HydratedDocument } from 'mongoose';

const port = config.get<number>('port');
const host = config.get<string>('host');
const baseApiUrl = config.get<string>('baseApiUrl');
const mongodbUrl = config.get<string>('mongodbUrl');

const app = express();
const httpServer = createServer(app);

app.use(express.json());

app.set('trust proxy', 1);

// Setting up sessions
app.use(
  session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
  }),
);

// Passport Initialized
app.use(passport.initialize());

// Setting Up Session
app.use(passport.session());

// Serve static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Views
app.get('/', checkLoggedInThenRedirectProfile, (req, res) =>
  res.render('index'),
);

app.get('/profile', isLoggedIn, async (req, res) => {
  const user = <HydratedDocument<IUser>>req.user;
  const wallet = await Wallet.findOne({ owner: user._id }).exec();

  if (wallet) {
    res.render('profile', {
      user,
    });
  } else {
    res.redirect('/create_wallet');
  }
});

app.get('/create_wallet', isLoggedIn, async (req, res) => {
  const user = <HydratedDocument<IUser>>req.user;
  const wallet = await Wallet.findOne({ owner: user._id }).exec();

  if (wallet) {
    res.redirect('/profile');
  } else {
    res.render('create_wallet');
  }
});

// Base API Routes
app.use(`${baseApiUrl}/auth`, AuthRouter);
app.use(`${baseApiUrl}/wallet`, WalletRouter);

connect(mongodbUrl)
  .then(() => {
    log.info('Connected to database');

    httpServer.listen(port, host, () => {
      log.info(`🚀 Server listening on port ${port}`);
    });
  })
  .catch(error => {
    reportError(error, 'Error connecting to database');
  });
