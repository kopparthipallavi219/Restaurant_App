import mongoose, { Schema, Document } from 'mongoose';

export interface IReservation extends Document {
  reservationCode: string;
  branchSlug: string;
  branchName: string;
  customerName: string;
  email: string;
  phone: string;
  guestCount: number;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "07:30 PM"
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  specialRequests?: string;
  tableNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema: Schema<IReservation> = new Schema(
  {
    reservationCode: { type: String, required: true, unique: true, index: true },
    branchSlug: { type: String, required: true, lowercase: true, index: true },
    branchName: { type: String, required: true },
    customerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    guestCount: { type: Number, required: true, min: 1, max: 30 },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending',
      index: true,
    },
    specialRequests: { type: String, trim: true },
    tableNumber: { type: String },
  },
  { timestamps: true }
);

ReservationSchema.index({ date: 1, status: 1 });

export const Reservation = mongoose.model<IReservation>('Reservation', ReservationSchema);
