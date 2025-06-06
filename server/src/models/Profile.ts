// server/src/models/Profile.ts

import { Schema, model, Document } from 'mongoose';

export interface IProfile extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  followers: Schema.Types.ObjectId[];
  following: Schema.Types.ObjectId[];
}

const profileSchema = new Schema<IProfile>(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Profile',
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Profile',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    id: false,
  }
);

export const Profile = model<IProfile>('Profile', profileSchema);
