import bcrypt from 'bcrypt';
import {Profile} from '../models/index.js';
import {GameItem} from '../models/index.js';
import { signToken } from '../utils/auth.js';

interface Context {
  user: {
    _id: string;
    name: string;
    email: string;
  } | null;
}

async function addToList(
  listType: 'library' | 'wishlist' | 'playlist',
  gameInput: any,
  context: Context
) {
  if (!context.user) throw new Error('Not logged in');
  const existing = await GameItem.findOne({ rawgId: gameInput.rawgId, listType, addedBy: context.user._id });
  const game = existing || await GameItem.create({
    rawgId: gameInput.rawgId,
    name: gameInput.name,
    released: gameInput.released || '',
    background_image: gameInput.background_image || '',
    addedBy: context.user._id,
    listType,
  });
  return await Profile.findByIdAndUpdate(
    context.user._id,
    { $addToSet: { [listType]: game._id } },
    { new: true }
  ).populate(listType);
}

async function removeFromList(
  listType: 'library' | 'wishlist' | 'playlist',
  gameId: string,
  context: Context
) {
  if (!context.user) throw new Error('Not logged in');

  const targetGame = await GameItem.findOne({ rawgId: gameId, addedBy: context.user._id, listType });
  if (!targetGame) throw new Error('Game not found for removal');

  await GameItem.findByIdAndDelete(targetGame._id);
  return await Profile.findByIdAndUpdate(
    context.user._id,
    { $pull: { [listType]: targetGame._id } },
    { new: true }
  ).populate(listType);
}

const resolvers = {
  Query: {
    profiles: async () => await Profile.find().populate('followers').populate('following'),

    profile: async (_parent: any, args: { profileId: string }) => {
      const { profileId } = args;
      const profile = await Profile.findById(profileId).populate('followers').populate('following');
      if (!profile) throw new Error('Profile not found');
      return profile;
    },

    me: async (_parent: any, _args: any, context: Context) => {
      if (!context.user) throw new Error('Not logged in');
      const profile = await Profile.findById(context.user._id)
        .populate('followers')
        .populate('following')
        .populate('library')
        .populate('wishlist')
        .populate('playlist');
      if (!profile) throw new Error('Profile not found');
      return profile;
    },

    searchProfile: async (_parent: any, args: { searchTerm: string }) => {
      const { searchTerm } = args;
      const regex = new RegExp(searchTerm, 'i');
      return await Profile.find({ $or: [{ name: regex }, { email: regex }] }).limit(10);
    },
  },

  Mutation: {
    addProfile: async (_parent: any, args: { name: string; email: string; password: string }) => {
      const { name, email, password } = args;
      const newProfile = await Profile.create({ name, email, password });
      const token = signToken({ _id: String(newProfile._id), name, email });
      return { token, profile: { _id: newProfile._id, name, email } };
    },

    login: async (_parent: any, args: { email: string; password: string }) => {
      const { email, password } = args;
      const profile = await Profile.findOne({ email });
      if (!profile || !(await bcrypt.compare(password, profile.password))) {
        throw new Error('Incorrect credentials');
      }
      const token = signToken({ _id: String(profile._id), name: profile.name, email });
      return { token, profile: { _id: profile._id, name: profile.name, email } };
    },

    removeProfile: async (_parent: any, _args: any, context: Context) => {
      if (!context.user) throw new Error('Not logged in');
      return await Profile.findByIdAndDelete(context.user._id);
    },

    followProfile: async (_parent: any, args: { profileId: string }, context: Context) => {
      if (!context.user) throw new Error('You must be logged in to follow');
      const { profileId } = args;
      const userId = context.user._id;
      if (userId === profileId) throw new Error("You can't follow yourself");
      await Profile.findByIdAndUpdate(userId, { $addToSet: { following: profileId } });
      return await Profile.findByIdAndUpdate(
        profileId,
        { $addToSet: { followers: userId } },
        { new: true }
      ).populate('followers').populate('following');
    },

    unfollowProfile: async (_parent: any, args: { profileId: string }, context: Context) => {
      if (!context.user) throw new Error('You must be logged in to unfollow');
      const { profileId } = args;
      const userId = context.user._id;
      await Profile.findByIdAndUpdate(userId, { $pull: { following: profileId } });
      return await Profile.findByIdAndUpdate(
        profileId,
        { $pull: { followers: userId } },
        { new: true }
      ).populate('followers').populate('following');
    },

    addToLibrary: async (_p: any, args: { gameInput: any }, context: Context) => addToList('library', args.gameInput, context),
    addToWishlist: async (_p: any, args: { gameInput: any }, context: Context) => addToList('wishlist', args.gameInput, context),
    addToPlaylist: async (_p: any, args: { gameInput: any }, context: Context) => addToList('playlist', args.gameInput, context),

    removeFromLibrary: async (_p: any, args: { gameId: string }, context: Context) => removeFromList('library', args.gameId, context),
    removeFromWishlist: async (_p: any, args: { gameId: string }, context: Context) => removeFromList('wishlist', args.gameId, context),
    removeFromPlaylist: async (_p: any, args: { gameId: string }, context: Context) => removeFromList('playlist', args.gameId, context),

    updateProfile: async (_p: any, args: { name: string; email: string }, context: Context) => {
      if (!context.user) throw new Error('Not logged in');
      return await Profile.findByIdAndUpdate(
        context.user._id,
        { name: args.name, email: args.email },
        { new: true }
      ).populate('followers').populate('following');
    },

    changePassword: async (_p: any, args: { oldPassword: string; newPassword: string }, context: Context) => {
      if (!context.user) throw new Error('Not logged in');
      const profile = await Profile.findById(context.user._id);
      if (!profile) throw new Error('Profile not found');
      const validPw = await bcrypt.compare(args.oldPassword, profile.password);
      if (!validPw) throw new Error('Incorrect old password');
      profile.password = await bcrypt.hash(args.newPassword, 10);
      await profile.save();
      return { message: 'Password changed successfully' };
    },
  },
};

export default resolvers;