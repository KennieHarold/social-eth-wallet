import express from 'express';
import cookieSession from 'cookie-session';
import path from 'path';
import { createServer } from 'http';
import config from 'config';
import passport from 'passport';
import { log, reportError } from '@/utils/logger';
import AuthRouter from '@/routers/auth.router';
import WalletRouter from '@/routers/wallet.router';
import { connect } from '@/config/mongodb.config';
import '@/config/passport.config';

const port = config.get<number>('port');
const host = config.get<string>('host');
const baseApiUrl = config.get<string>('baseApiUrl');
const mongodbUrl = config.get<string>('mongodbUrl');

const app = express();
const httpServer = createServer(app);

// Setting up cookies
app.use(
  cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
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
app.get('/', (_, res) => res.render('index'));
app.get('/profile', (_, res) => res.render('profile'));

// Base Routes
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
