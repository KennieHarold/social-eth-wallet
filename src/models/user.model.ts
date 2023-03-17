import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface IUser {
  name: string;
  email: string;
  credentials: {
    googleId: string;
  };
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  credentials: {
    googleId: {
      type: String,
      required: true,
    },
  },
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
