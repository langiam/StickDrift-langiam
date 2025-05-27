import { Profile } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';
const resolvers = {
    Query: {
        profiles: async () => {
            return await Profile.find();
        },
        profile: async (_parent, { profileId }) => {
            return await Profile.findOne({ _id: profileId });
        },
        me: async (_parent, _args, context) => {
            if (context.user) {
                return await Profile.findById(context.user._id).populate('followers', '_id name').populate('following', '_id name');
            }
            throw AuthenticationError;
        },
        searchProfile: async (_parent, { name }) => {
            const profiles = await Profile.find({ name: new RegExp(name, 'i') }).select('_id name');
            return profiles.map(profile => ({ _id: profile._id.toString(), name: profile.name }));
        },
    },
    Mutation: {
        addProfile: async (_parent, { input }) => {
            const profile = await Profile.create({ ...input });
            const token = signToken(profile.name, profile.email, profile._id);
            return { token, profile };
        },
        login: async (_parent, { email, password }) => {
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
        removeProfile: async (_parent, _args, context) => {
            if (context.user) {
                return await Profile.findOneAndDelete({ _id: context.user._id });
            }
            throw AuthenticationError;
        },
        followProfile: async (_parent, { profileId }, context) => {
            try {
                if (context.user) {
                    await Profile.findOneAndUpdate({ _id: context.user._id }, { $addToSet: { following: profileId } });
                    const profile = await Profile.findOneAndUpdate({ _id: profileId }, { $addToSet: { followers: context.user._id } }, { new: true });
                    return {
                        success: true,
                        message: 'Successfully followed the profile.',
                        profile: profile,
                    };
                }
                else {
                    return {
                        success: false,
                        message: 'Could not follow the profile.',
                        profile: null,
                    };
                }
            }
            catch (error) {
                console.error('Error following profile:', error);
                return {
                    success: false,
                    message: 'Could not follow the profile.',
                    profile: null,
                };
            }
        },
        unfollowProfile: async (_parent, { profileId }, context) => {
            try {
                if (context.user) {
                    await Profile.findOneAndUpdate({ _id: context.user._id }, { $pull: { following: profileId } });
                    const profile = await Profile.findOneAndUpdate({ _id: profileId }, { $pull: { followers: context.user._id } }, { new: true });
                    return {
                        success: true,
                        message: 'Successfully unfollowed the profile.',
                        profile: profile,
                    };
                }
                else {
                    return {
                        success: false,
                        message: 'Could not unfollow the profile.',
                        profile: null,
                    };
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
