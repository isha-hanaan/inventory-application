import mongoose from 'mongoose';

export interface ItemDocument extends mongoose.Document {
  name: string;
  length: number;
  width: number;
  thickness: number;
  type: string;
  price: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    length: { type: Number, required: true, min: 0 },
    width: { type: Number, required: true, min: 0 },
    thickness: { type: Number, required: true, min: 0 },
    type: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ItemDocument>('Item', itemSchema);
