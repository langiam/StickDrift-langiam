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
      return await Profile.find().populate('followers').populate('following');
    },

    profile: async (_parent: any, { profileId }: { profileId: string }) => {
      return await Profile.findById(profileId).populate('followers').populate('following');
    },

    me: async (_parent: any, _args: any, context: Context) => {
      if (!context.user) throw new AuthenticationError('Not logged in');
      return await Profile.findById(context.user._id).populate('followers').populate('following');
    },

    searchProfile: async (_parent: any, { searchTerm }: { searchTerm: string }) => {
      const regex = new RegExp(searchTerm, 'i');
      return await Profile.find({
        $or: [{ name: regex }, { email: regex }],
      }).limit(10);
    },
  },

  Mutation: {
    addProfile: async (_parent: any, { name, email, password }: { name: string; email: string; password: string }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newProfile = await Profile.create({ name, email, password: hashedPassword });

      const idString = String(newProfile._id);
      const token = signToken(newProfile.name, newProfile.email, idString);

      return { token, profile: newProfile };
    },

    login: async (_parent: any, { email, password }: { email: string; password: string }) => {
      const profile = await Profile.findOne({ email });
      if (!profile) throw new AuthenticationError('Incorrect credentials');

      const validPw = await bcrypt.compare(password, profile.password);
      if (!validPw) throw new AuthenticationError('Incorrect credentials');

      const idString = String(profile._id);
      const token = signToken(profile.name, profile.email, idString);
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

    changePassword: async (
      _parent: any,
      { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
      context: Context
    ) => {
      if (!context.user) throw new AuthenticationError('Not logged in');
      const profile = await Profile.findById(context.user._id);
      if (!profile) throw new AuthenticationError('Profile not found');

      const validPw = await bcrypt.compare(oldPassword, profile.password);
      if (!validPw) throw new AuthenticationError('Incorrect old password');

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      profile.password = hashedNewPassword;
      await profile.save();

      return { message: 'Password changed successfully' };
    },
  },
};

export default resolvers;