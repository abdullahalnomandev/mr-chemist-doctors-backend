/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-unused-vars */
export const ORDER_STATUS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
export const PAYMENT_STATUS = ['pending', 'paid', 'failed', 'cod_pending', 'refunded'] as const;
export const PAYMENT_METHOD = ['card', 'paypal', 'cash'] as const;
export const orderSearchableFields = ['orderId', 'orderStatus'];

//@ts-ignore
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  COD_PENDING = 'cod_pending',
  REFUNDED = 'refunded',
}

//@ts-ignore
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}
