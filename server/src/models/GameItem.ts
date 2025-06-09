import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGameItem extends Document {
  rawgId: string;
  name: string;
  released?: string;
  background_image?: string;
  addedBy: mongoose.Types.ObjectId;
  listType: 'library' | 'wishlist' | 'playlist';
}

const gameItemSchema = new Schema<IGameItem>({
  rawgId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  released: {
    type: String,
  },
  background_image: {
    type: String,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  },
  listType: {
    type: String,
    enum: ['library', 'wishlist', 'playlist'],
    required: true,
  },
});

const GameItem: Model<IGameItem> = mongoose.model<IGameItem>('GameItem', gameItemSchema);
export default GameItem;
