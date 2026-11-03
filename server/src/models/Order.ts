import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  menuItemId: string;
  title: string;
  portionName: string;
  price: number;
  quantity: number;
  isVeg: boolean;
  image?: string;
}

export interface IOrder extends Document {
  orderCode: string;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  orderType: 'Delivery' | 'Pickup' | 'DineIn';
  outletSlug: string;
  outletName: string;
  customerName: string;
  email: string;
  phone: string;
  deliveryAddress?: {
    street: string;
    area: string;
    city: string;
    pincode: string;
    landmark?: string;
  };
  status: 'Pending' | 'Confirmed' | 'Preparing' | 'OutForDelivery' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  paymentMethod: 'CashOnDelivery' | 'UPI' | 'Card' | 'NetBanking';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    menuItemId: { type: String, required: true },
    title: { type: String, required: true },
    portionName: { type: String, required: true, default: 'Regular' },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    isVeg: { type: Boolean, default: false },
    image: { type: String },
  },
  { _id: false }
);

const OrderSchema: Schema<IOrder> = new Schema(
  {
    orderCode: { type: String, required: true, unique: true, index: true },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    orderType: {
      type: String,
      enum: ['Delivery', 'Pickup', 'DineIn'],
      default: 'Delivery',
    },
    outletSlug: { type: String, required: true },
    outletName: { type: String, required: true },
    customerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    deliveryAddress: {
      street: { type: String },
      area: { type: String },
      city: { type: String, default: 'Hyderabad' },
      pincode: { type: String },
      landmark: { type: String },
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Preparing', 'OutForDelivery', 'Delivered', 'Cancelled'],
      default: 'Pending',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: ['CashOnDelivery', 'UPI', 'Card', 'NetBanking'],
      default: 'CashOnDelivery',
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

OrderSchema.index({ createdAt: -1, status: 1 });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
