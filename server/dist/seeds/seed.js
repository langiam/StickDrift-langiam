"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const connection_1 = __importDefault(require("../config/connection"));
const Profile_1 = require("../models/Profile");
dotenv_1.default.config();
const seedProfiles = async () => {
    try {
        await (0, connection_1.default)();
        console.log('🗑 Deleting all profiles...');
        await Profile_1.Profile.deleteMany({});
        console.log('✨ Creating sample profiles...');
        const saltRounds = 10;
        const profilesData = [
            { name: 'Alice Johnson', email: 'alice@example.com', password: 'password123' },
            { name: 'Bob Smith', email: 'bob@example.com', password: 'password123' },
            { name: 'Carol Lee', email: 'carol@example.com', password: 'password123' },
        ];
        for (const profile of profilesData) {
            const hashedPw = await bcrypt_1.default.hash(profile.password, saltRounds);
            await Profile_1.Profile.create({
                name: profile.name,
                email: profile.email,
                password: hashedPw,
            });
        }
        console.log('✅ Seeding complete!');
        process.exit(0);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
};
seedProfiles();
