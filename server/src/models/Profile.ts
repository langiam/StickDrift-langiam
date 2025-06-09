import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IProfile extends Document {
  name: string;
  email: string;
  password: string;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  library: mongoose.Types.ObjectId[];
  wishlist: mongoose.Types.ObjectId[];
  playlist: mongoose.Types.ObjectId[];
  isCorrectPassword(password: string): Promise<boolean>;
}

const profileSchema: Schema<IProfile> = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Must use a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
    },
  ],
  library: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GameItem',
    },
  ],
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GameItem',
    },
  ],
  playlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GameItem',
    },
  ],
});

// Hash password before save
profileSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare incoming password
profileSchema.methods.isCorrectPassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const Profile: Model<IProfile> = mongoose.model<IProfile>('Profile', profileSchema);
export default Profile;
