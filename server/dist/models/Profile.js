"use strict";
// server/src/models/Profile.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
const mongoose_1 = require("mongoose");
const profileSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    followers: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Profile',
        },
    ],
    following: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Profile',
        },
    ],
}, {
    toJSON: {
        virtuals: true,
    },
    id: false,
});
exports.Profile = (0, mongoose_1.model)('Profile', profileSchema);
