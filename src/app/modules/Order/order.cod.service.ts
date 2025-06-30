import { PaymentStatus } from './order.constant';
import {  IOrder } from './order.interface';
import {  Order } from './order.model';

const createOrder = async ({ customer, items,orderId, paymentMethod, couponCode }: IOrder) => {
  const order = new Order({
    orderId,
    customer,
    items,
    paymentMethod,
    couponCode,
    paymentStatus: PaymentStatus.COD_PENDING,
  });

  return await order.save();
};

export const OrderCodService = {
  createOrder,
};
