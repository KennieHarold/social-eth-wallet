import mongoose from 'mongoose';

export const connect = (url: string) => {
  mongoose.set('strictQuery', true);
  return mongoose.connect(url);
};
