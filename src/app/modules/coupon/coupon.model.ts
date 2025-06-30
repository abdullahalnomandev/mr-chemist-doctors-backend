import { Schema, model } from 'mongoose';
import { ICoupon } from './coupon.interface';

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, unique: true, uppercase: true },
    type: { type: String, enum: ['percent', 'fixed'], required: true },
    value: { type: Number, required: true },
    active: { type: Boolean, default: true },
    expiry: { type: Date, required: true }
  },
  { toJSON: { virtuals: true } },
);


export const Coupon = model<ICoupon>('Coupon', couponSchema);
