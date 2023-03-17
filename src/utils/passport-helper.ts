import User, { IUser } from '../models/user.model';
import { Profile } from 'passport';
import { HydratedDocument } from 'mongoose';

export const findOrCreateProfile = async (
  profile: Profile,
): Promise<{ err?: Error | string; user: HydratedDocument<IUser> | null }> => {
  const user: HydratedDocument<IUser> | null = await User.findOne({
    googleId: profile.id,
  }).exec();

  if (user) {
    return { user };
  } else {
    if (!(profile?.emails && profile?.emails?.length > 0)) {
      return { err: "Can't fetched email", user: null };
    }

    const user = await new User<IUser>({
      name: profile.displayName,
      email: profile.emails[0].value,
      credentials: {
        googleId: profile.id,
      },
    }).save();

    return { user };
  }
};
