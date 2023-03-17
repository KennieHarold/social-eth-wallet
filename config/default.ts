import dotenv from 'dotenv';
dotenv.config();

export default {
  port: 8080,
  host: 'localhost',
  baseApiUrl: '/api/v1',
  encryptionKey: process.env.ENCRYPTION_KEY,
  mongodbUrl: process.env.MONGODB_URL,
  credentials: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:8080/api/v1/auth/google/callback',
    },
  },
};
