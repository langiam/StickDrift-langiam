import { Profile } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';

interface Profile {
  _id: string;
  name: string;
  email: string;
  password: string;
  followers: string[];
  following: string[];
}

interface FollowResponse {
  success: boolean;
  message: string;
  profile: Profile | null;
}

interface UnfollowResponse {
  success: boolean;
  message: string;
  profile: Profile | null;
}

interface ProfileArgs {
  profileId: string;
}

interface AddProfileArgs {
  input:{
    name: string;
    email: string;
    password: string;
  }
}

interface Context {
  user?: Profile;
}

const resolvers = {
  Query: {
    profiles: async (): Promise<Profile[]> => {
      return await Profile.find();
    },
    profile: async (_parent: any, _args: ProfileArgs, _context: Context): Promise<Profile | null> => {
      const { profileId } = _args;
      return await Profile.findOne({ _id: profileId }).populate('followers', '_id name').populate('following', '_id name');
    },
    me: async (_parent: any, _args: any, context: Context): Promise<Profile | null> => {
      if (context.user) {
        return await Profile.findById( context.user._id ).populate('followers', '_id name').populate('following', '_id name');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
   searchProfile: async (_parent: any, { name }: { name: string }) => {
      const profiles = await Profile.find({ name: new RegExp(name, 'i') }).select('_id name');
      return profiles.map(profile => ({ _id: profile._id.toString(), name: profile.name }));  
    },
  },
  Mutation: {
    addProfile: async (_parent: any, { input }: AddProfileArgs): Promise<{ token: string; profile: Profile }> => {
      const profile = await Profile.create({ ...input });
      const token = signToken(profile.name, profile.email, profile._id);
      return { token, profile };
    },
    login: async (_parent: any, { email, password }: { email: string; password: string }): Promise<{ token: string; profile: Profile }> => {
      const profile = await Profile.findOne({ email });
      if (!profile) {
        throw AuthenticationError;
      }
      const correctPw = await profile.isCorrectPassword(password);
      if (!correctPw) {
        throw AuthenticationError;
      }
      const token = signToken(profile.name, profile.email, profile._id);
      return { token, profile };
    },
    removeProfile: async (_parent: any, _args: any, context: Context): Promise<Profile | null> => {
      if (context.user) {
        return await Profile.findOneAndDelete({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
    followProfile: async (_parent: any, { profileId }: ProfileArgs, context: Context): Promise<FollowResponse | null> => {
      try {
        if (context.user) {
          await Profile.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { following: profileId } },
          );
          const profile = await Profile.findOneAndUpdate(
            { _id: profileId },
            { $addToSet: { followers: context.user._id } },
            { new: true }
          ).select('_id name');
          return {
            success: true,
            message: 'Successfully followed the profile.',
            profile: profile,
          };
        } else {
          return {
            success: false,
            message: 'Could not follow the profile.',
            profile: null,
          }
        }
      } catch (error) {
        console.error('Error following profile:', error);
          return {
            success: false,
            message: 'Could not follow the profile.',
            profile: null,
          };
          
        }
      },
    unfollowProfile: async (_parent: any, { profileId }: ProfileArgs, context: Context): Promise<UnfollowResponse | null> => {
      try {
        if (context.user) {
          await Profile.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { following: profileId } },
          );
          const profile = await Profile.findOneAndUpdate(
            { _id: profileId },
            { $pull: { followers: context.user._id } },
            { new: true }
          );
          return {
            success: true,
            message: 'Successfully unfollowed the profile.',
            profile: profile,
          };
        } else {
          return {
            success: false,
            message: 'Could not unfollow the profile.',
            profile: null,
          }
        }
      }
      catch (error) {
        console.error('Error unfollowing profile:', error);
        return {
            success: false,
            message: 'Could not unfollow the profile.',
            profile: null,
          };
      }
        },
  },
 };

export default resolvers;
