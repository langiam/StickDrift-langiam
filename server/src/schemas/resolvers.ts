import { AuthenticationError } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import { Profile } from '../models/Profile';
import { signToken } from '../utils/auth';

interface Context {
  user: {
    _id: string;
    name: string;
    email: string;
  } | null;
}

export const resolvers = {
  Query: {
    profiles: async () => {
      try {
        return await Profile.find().populate('followers').populate('following');
      } catch (err) {
        console.error('[profiles resolver error]', err);
        throw new Error('Failed to fetch profiles');
      }
    },

    profile: async (_parent: any, { profileId }: { profileId: string }) => {
      try {
        const profile = await Profile.findById(profileId).populate('followers').populate('following');
        if (!profile) throw new Error('Profile not found');
        return profile;
      } catch (err) {
        console.error('[profile resolver error]', err);
        throw new Error('Failed to fetch profile');
      }
    },

    me: async (_parent: any, _args: any, context: Context) => {
      if (!context.user) throw new AuthenticationError('Not logged in');

      try {
        const profile = await Profile.findById(context.user._id).populate('followers').populate('following');
        if (!profile) throw new Error('Profile not found');
        return profile;
      } catch (err) {
        console.error('[me resolver error]', err);
        throw new Error('Failed to retrieve profile');
      }
    },

    searchProfile: async (_parent: any, { searchTerm }: { searchTerm: string }) => {
      try {
        const regex = new RegExp(searchTerm, 'i');
        return await Profile.find({
          $or: [{ name: regex }, { email: regex }],
        }).limit(10);
      } catch (err) {
        console.error('[searchProfile resolver error]', err);
        throw new Error('Failed to perform search');
      }
    },
  },

  Mutation: {
    addProfile: async (_parent: any, { name, email, password }: { name: string; email: string; password: string }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newProfile = await Profile.create({ name, email, password: hashedPassword });
      const token = signToken(newProfile.name, newProfile.email, String(newProfile._id));
      return { token, profile: newProfile };
    },

    login: async (_parent: any, { email, password }: { email: string; password: string }) => {
      const profile = await Profile.findOne({ email });
      if (!profile) throw new AuthenticationError('Incorrect credentials');

      const validPw = await bcrypt.compare(password, profile.password);
      if (!validPw) throw new AuthenticationError('Incorrect credentials');

      const token = signToken(profile.name, profile.email, String(profile._id));
      return { token, profile };
    },

    removeProfile: async (_parent: any, _args: any, context: Context) => {
      if (!context.user) throw new AuthenticationError('Not logged in');
      return await Profile.findByIdAndDelete(context.user._id);
    },

    followProfile: async (_parent: any, { profileId }: { profileId: string }, context: Context) => {
      if (!context.user) throw new AuthenticationError('You must be logged in to follow');
      const userId = context.user._id;
      if (userId === profileId) throw new Error("You can't follow yourself");

      await Profile.findByIdAndUpdate(userId, { $addToSet: { following: profileId } });
      return await Profile.findByIdAndUpdate(
        profileId,
        { $addToSet: { followers: userId } },
        { new: true }
      ).populate('followers').populate('following');
    },

    unfollowProfile: async (_parent: any, { profileId }: { profileId: string }, context: Context) => {
      if (!context.user) throw new AuthenticationError('You must be logged in to unfollow');
      const userId = context.user._id;

      await Profile.findByIdAndUpdate(userId, { $pull: { following: profileId } });
      return await Profile.findByIdAndUpdate(
        profileId,
        { $pull: { followers: userId } },
        { new: true }
      ).populate('followers').populate('following');
    },

    addToLibrary: async (_parent: any, { gameInput }: { gameInput: any }, context: Context) => {
      if (!context.user) throw new AuthenticationError('Not logged in');
      return await Profile.findByIdAndUpdate(
        context.user._id,
        {
          $addToSet: {
            library: {
              rawgId: gameInput.id.toString(),
              name: gameInput.name,
              released: gameInput.released || '',
              background_image: gameInput.background_image || '',
            },
          },
        },
        { new: true }
      );
    },

    addToWishlist: async (_parent: any, { gameInput }: { gameInput: any }, context: Context) => {
      if (!context.user) throw new AuthenticationError('Not logged in');
      return await Profile.findByIdAndUpdate(
        context.user._id,
        {
          $addToSet: {
            wishlist: {
              rawgId: gameInput.id.toString(),
              name: gameInput.name,
              released: gameInput.released || '',
              background_image: gameInput.background_image || '',
            },
          },
        },
        { new: true }
      );
    },

    addToPlaylist: async (_parent: any, { gameInput }: { gameInput: any }, context: Context) => {
      if (!context.user) throw new AuthenticationError('Not logged in');
      return await Profile.findByIdAndUpdate(
        context.user._id,
        {
          $addToSet: {
            playlist: {
              rawgId: gameInput.id.toString(),
              name: gameInput.name,
              released: gameInput.released || '',
              background_image: gameInput.background_image || '',
            },
          },
        },
        { new: true }
      );
    },

    removeFromLibrary: async (_parent: any, { gameId }: { gameId: string }, context: Context) => {
      if (!context.user) throw new AuthenticationError('Not logged in');
      return await Profile.findByIdAndUpdate(
        context.user._id,
        { $pull: { library: { rawgId: gameId } } },
        { new: true }
      );
    },

    removeFromWishlist: async (_parent: any, { gameId }: { gameId: string }, context: Context) => {
      if (!context.user) throw new AuthenticationError('Not logged in');
      return await Profile.findByIdAndUpdate(
        context.user._id,
        { $pull: { wishlist: { rawgId: gameId } } },
        { new: true }
      );
    },

    removeFromPlaylist: async (_parent: any, { gameId }: { gameId: string }, context: Context) => {
      if (!context.user) throw new AuthenticationError('Not logged in');
      return await Profile.findByIdAndUpdate(
        context.user._id,
        { $pull: { playlist: { rawgId: gameId } } },
        { new: true }
      );
    },

    updateProfile: async (_parent: any, { name, email }: { name: string; email: string }, context: Context) => {
      if (!context.user) throw new AuthenticationError('Not logged in');
      return await Profile.findByIdAndUpdate(
        context.user._id,
        { name, email },
        { new: true }
      ).populate('followers').populate('following');
    },

    changePassword: async (_parent: any, { oldPassword, newPassword }: { oldPassword: string; newPassword: string }, context: Context) => {
      if (!context.user) throw new AuthenticationError('Not logged in');
      const profile = await Profile.findById(context.user._id);
      if (!profile) throw new AuthenticationError('Profile not found');

      const validPw = await bcrypt.compare(oldPassword, profile.password);
      if (!validPw) throw new AuthenticationError('Incorrect old password');

      profile.password = await bcrypt.hash(newPassword, 10);
      await profile.save();

      return { message: 'Password changed successfully' };
    },
  },
};
