import { Schema, model } from 'mongoose';
import { ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS } from './order.constant';
import {  IOrder, IOrderItem } from './order.interface';
import { Coupon } from '../coupon/coupon.model';

const orderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: {type:String},
  variant: { type: Schema.Types.ObjectId, ref: 'Variant', required: true },
  productBasePrice: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  taxRate: { type: Number, required: true, min: 0 },
  taxAmount: { type: Number, required: true, min: 0 },
  type: { type: String, required: false, min: 0 },
  unit: { type: String, required: false, min: 0 },
  price: { type: Number, required: false, min: 0 },
  value: { type: String, required: false, min: 0 },
});



const orderSchema = new Schema<IOrder>(
  {
    orderId: { type: String,unique:true, required: true },
    royalMailStatus: { type: String,default:"" },
    orderIdentifier: { type: Number },
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    subTotal: { type: Number, required: false, min: 0 },
    couponCode: { type: String, required: false },
    taxAmount: { type: Number, required: false, min: 0 },
    totalAmount: { type: Number, required: false, min: 0 },
    orderStatus: {
      type: String,
      enum: ORDER_STATUS,
      default: 'pending',
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHOD,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUS,
      default: 'pending',
      required: true,
    },
  },
  { timestamps: true },
);

// Auto-calculate subTotal, taxAmount, and totalAmount before saving
orderSchema.pre('save', async function (next) {
  const Order = this as IOrder;

  let subTotal = 0;

  Order.items.forEach((item) => {
    const itemTotal = ((item.price ?? item.productBasePrice) ?? 0) * (item.quantity ?? 0);
    subTotal += itemTotal;
    item.taxRate = undefined;
    item.taxAmount = undefined;
  });

  // Calculate taxAmount and totalAmount
  Order.subTotal = parseFloat(subTotal.toFixed(2));
  Order.taxAmount = parseFloat((0.01 * Order.subTotal).toFixed(2));
  Order.totalAmount = parseFloat((Order.subTotal + Order.taxAmount).toFixed(2));

  // Calculate With coupon code
  if (Order.couponCode) {
    const couponCode = await Coupon.findOne({ 
      code: Order.couponCode,
      expiryDate: { $gt: new Date() },
      active: true,
    });

    if (couponCode) {
      if (couponCode.type === 'percent') {
        const discountAmount = (Order.totalAmount * (couponCode.value / 100));
        Order.totalAmount = parseFloat((Order.totalAmount - discountAmount).toFixed(2));
      }
      if (couponCode.type === 'fixed') {
        Order.totalAmount = parseFloat((Order.totalAmount - couponCode.value).toFixed(2));
      }
    }
  }

  // Will increase and decrease stock depend on order status
  next();
});

export const Order = model<IOrder>('Order', orderSchema);
