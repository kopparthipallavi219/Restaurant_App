import mongoose, { Schema, Document } from 'mongoose';

export interface ICateringEnquiry extends Document {
  enquiryCode: string;
  eventType: 'Wedding' | 'Corporate' | 'Birthday' | 'Family Function' | 'Bulk Biryani Handi' | 'Other';
  guestCount: number;
  date: string;
  contactName: string;
  email: string;
  phone: string;
  venueLocation: string;
  preferredOutlet?: string;
  status: 'Pending' | 'Contacted' | 'Confirmed' | 'Cancelled';
  budgetPerPlate?: number;
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CateringEnquirySchema: Schema<ICateringEnquiry> = new Schema(
  {
    enquiryCode: { type: String, required: true, unique: true, index: true },
    eventType: {
      type: String,
      enum: ['Wedding', 'Corporate', 'Birthday', 'Family Function', 'Bulk Biryani Handi', 'Other'],
      required: true,
    },
    guestCount: { type: Number, required: true, min: 20 },
    date: { type: String, required: true },
    contactName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    venueLocation: { type: String, required: true, trim: true },
    preferredOutlet: { type: String, trim: true },
    status: {
      type: String,
      enum: ['Pending', 'Contacted', 'Confirmed', 'Cancelled'],
      default: 'Pending',
      index: true,
    },
    budgetPerPlate: { type: Number },
    message: { type: String, trim: true },
  },
  { timestamps: true }
);

CateringEnquirySchema.index({ createdAt: -1, status: 1 });

export const CateringEnquiry = mongoose.model<ICateringEnquiry>(
  'CateringEnquiry',
  CateringEnquirySchema
);
