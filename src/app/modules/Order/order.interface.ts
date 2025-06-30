/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { IProduct, IVariant } from '../Product/product.interface';

export type IOrderItem = {
  product: mongoose.Types.ObjectId | IProduct;
  quantity: number;
  taxRate?: number;
  taxAmount?: number;
  name?: string;
  variant : IVariant | null;
  productBasePrice?: number;
  type?:string;
  unit?:string;
  price:number;
  value?:string;
};
export type IOrder = {
  orderIdentifier?: number;
  royalMailStatus?: string;
  orderId: string;
  customer: mongoose.Types.ObjectId;
  couponCode?: string;
  items: IOrderItem[];
  subTotal?: number;
  taxAmount?: number;
  totalAmount?: number;
  orderStatus?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
  paymentMethod: "card" | "paypal" | "cash",
  paymentStatus ?: "pending" | "paid"| "failed"| "cod_pending" | "refunded"
};

type OrderItemInput = {
  id: string;
  variant_id: string;
  quantity: number;
};

export type CreateOrderPayload = {
  customer: string;
  items: OrderItemInput[];
  paymentMethod: string;
  couponCode?: string;
};

export type RoyalMailEntry = {
  orderIdentifier: number;
  shippedOn?: string;
  manifestedOn?: string;
  printedOn?: string;
  createdOn?: string;
  orderDate?: string;
};
export type GetAllOrderParams ={
  query?: Record<string, any>;
  userId?: string;
  role?: string;
}
