"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
// server/src/schemas/resolvers.ts
const apollo_server_express_1 = require("apollo-server-express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Profile_1 = require("../models/Profile");
const auth_1 = require("../utils/auth");
exports.resolvers = {
    Query: {
        profiles: async () => {
            return await Profile_1.Profile.find().populate('followers').populate('following');
        },
        profile: async (_parent, { profileId }) => {
            return await Profile_1.Profile.findById(profileId).populate('followers').populate('following');
        },
        me: async (_parent, _args, context) => {
            if (!context.user) {
                throw new apollo_server_express_1.AuthenticationError('Not logged in');
            }
            return await Profile_1.Profile.findById(context.user._id)
                .populate('followers')
                .populate('following');
        },
        searchProfile: async (_parent, { searchTerm }) => {
            const regex = new RegExp(searchTerm, 'i');
            return await Profile_1.Profile.find({
                $or: [{ name: regex }, { email: regex }],
            }).limit(10);
        },
    },
    Mutation: {
        addProfile: async (_parent, { name, email, password }) => {
            const saltRounds = 10;
            const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
            const newProfile = await Profile_1.Profile.create({
                name,
                email,
                password: hashedPassword,
            });
            // <-- Convert ObjectId to string here:
            const token = (0, auth_1.signToken)(newProfile.name, newProfile.email, newProfile._id.toString());
            return { token, profile: newProfile };
        },
        login: async (_parent, { email, password }) => {
            const profile = await Profile_1.Profile.findOne({ email });
            if (!profile) {
                throw new apollo_server_express_1.AuthenticationError('Incorrect credentials');
            }
            const validPw = await bcrypt_1.default.compare(password, profile.password);
            if (!validPw) {
                throw new apollo_server_express_1.AuthenticationError('Incorrect credentials');
            }
            // <-- Convert ObjectId to string here:
            const token = (0, auth_1.signToken)(profile.name, profile.email, profile._id.toString());
            return { token, profile };
        },
        removeProfile: async (_parent, _args, context) => {
            if (!context.user) {
                throw new apollo_server_express_1.AuthenticationError('Not logged in');
            }
            return await Profile_1.Profile.findByIdAndDelete(context.user._id);
        },
        followProfile: async (_parent, { profileId }, context) => {
            if (!context.user) {
                throw new apollo_server_express_1.AuthenticationError('You must be logged in to follow');
            }
            const userId = context.user._id;
            if (userId === profileId) {
                throw new Error("You can't follow yourself");
            }
            await Profile_1.Profile.findByIdAndUpdate(userId, {
                $addToSet: { following: profileId },
            });
            const updatedTarget = await Profile_1.Profile.findByIdAndUpdate(profileId, { $addToSet: { followers: userId } }, { new: true })
                .populate('followers')
                .populate('following');
            return updatedTarget;
        },
        unfollowProfile: async (_parent, { profileId }, context) => {
            if (!context.user) {
                throw new apollo_server_express_1.AuthenticationError('You must be logged in to unfollow');
            }
            const userId = context.user._id;
            await Profile_1.Profile.findByIdAndUpdate(userId, { $pull: { following: profileId } });
            const updatedTarget = await Profile_1.Profile.findByIdAndUpdate(profileId, { $pull: { followers: userId } }, { new: true })
                .populate('followers')
                .populate('following');
            return updatedTarget;
        },
    },
};
