import mongoose, { Schema, Document } from 'mongoose';

export interface IOutlet extends Document {
  branchName: string;
  slug: string;
  address: string;
  area: string;
  city: string;
  phone: string;
  altPhone?: string;
  email?: string;
  timings: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  mapUrl: string;
  seatingCapacity: number;
  hasDineIn: boolean;
  hasTakeaway: boolean;
  hasDelivery: boolean;
  hasBanquet: boolean;
  isActive: boolean;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const OutletSchema: Schema<IOutlet> = new Schema(
  {
    branchName: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    address: { type: String, required: true, trim: true },
    area: { type: String, required: true, trim: true },
    city: { type: String, default: 'Hyderabad' },
    phone: { type: String, required: true, trim: true },
    altPhone: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    timings: { type: String, required: true, default: '11:00 AM - 11:30 PM' },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    mapUrl: { type: String, required: true },
    seatingCapacity: { type: Number, default: 150 },
    hasDineIn: { type: Boolean, default: true },
    hasTakeaway: { type: Boolean, default: true },
    hasDelivery: { type: Boolean, default: true },
    hasBanquet: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

OutletSchema.index({ slug: 1, isActive: 1 });

export const Outlet = mongoose.model<IOutlet>('Outlet', OutletSchema);
