import mongoose, { Schema, Document } from 'mongoose';

export interface IPortionSize {
  name: 'Single' | 'Regular' | 'Jumbo' | 'Handi';
  price: number;
  serves: string;
}

export interface IMenuItem extends Document {
  title: string;
  slug: string;
  categorySlug: string;
  description: string;
  price: number;
  portionSizes: IPortionSize[];
  isVeg: boolean;
  isChefSpecial: boolean;
  spiceLevel: 'Mild' | 'Medium' | 'Hot' | 'Spicy';
  image: string;
  isAvailable: boolean;
  allergens?: string[];
  ingredients?: string[];
  rating?: number;
  ordersCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const PortionSizeSchema = new Schema<IPortionSize>(
  {
    name: { type: String, enum: ['Single', 'Regular', 'Jumbo', 'Handi'], required: true },
    price: { type: Number, required: true },
    serves: { type: String, required: true },
  },
  { _id: false }
);

const MenuItemSchema: Schema<IMenuItem> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    categorySlug: { type: String, required: true, lowercase: true, index: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    portionSizes: [PortionSizeSchema],
    isVeg: { type: Boolean, default: false, index: true },
    isChefSpecial: { type: Boolean, default: false, index: true },
    spiceLevel: {
      type: String,
      enum: ['Mild', 'Medium', 'Hot', 'Spicy'],
      default: 'Medium',
    },
    image: { type: String, required: true },
    isAvailable: { type: Boolean, default: true, index: true },
    allergens: [{ type: String }],
    ingredients: [{ type: String }],
    rating: { type: Number, default: 4.8 },
    ordersCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

MenuItemSchema.index({ title: 'text', description: 'text' });
MenuItemSchema.index({ categorySlug: 1, isAvailable: 1, price: 1 });

export const MenuItem = mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
