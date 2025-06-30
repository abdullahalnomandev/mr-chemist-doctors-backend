import { Response } from 'express';
import mongoose from 'mongoose';
import { Stripe } from 'stripe';
import config from '../../config';
import { User } from '../User/user.model';
import { PaymentStatus } from './order.constant';
import {  IOrder, IOrderItem } from './order.interface';
import { Order } from './order.model';
import { RoyalMailOrderService } from './royalmail/order.roymail.service';
import { sendEmailToCustomer } from './order.util';
// import { RoyalMailOrderService } from './royalmail/order.roymail.service';

export const createOrder = async ({ customer, orderId, items, paymentMethod, couponCode }: IOrder,origin:string): Promise<{redirectStripeUrl:string}> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Save order inside the transaction
    const order = new Order({
      orderId,
      customer,
      items,
      paymentMethod,
      couponCode,
      paymentStatus: PaymentStatus.PENDING,
    });

    await order.save({ session });
    // await RoyalMailOrderService.createOrder(order);

    const userInfo = await User.findById(customer).lean();

    // Step 2: Convert items to Stripe format
    const convertToStripeLineItems = (items:IOrderItem[]) => {
      return items.map((item) => {
        const vatRate = 0.01;
        const unitPriceWithVAT = item.price * (1 + vatRate); // add 1% VAT
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item?.name,
            },
            unit_amount: Math.round(unitPriceWithVAT * 100), // convert to cents
          },
          quantity: item.quantity,
        };
      });
    };

    const lineItems = convertToStripeLineItems(items);

    // Step 3: Create Stripe checkout session
    const stripe = new Stripe(config.stripe_secret_key as string, {
      apiVersion: '2025-04-30.basil',
    });

    const stripeSession = await stripe.checkout.sessions.create({
      line_items: lineItems as Stripe.Checkout.SessionCreateParams.LineItem[],
      customer_email: userInfo?.email || 'user@gmail.com',
      mode: 'payment',
      success_url: `${origin}/api/v1/orders/success?status=success&orderId=${order._id}`,
      cancel_url: `${origin}/api/v1/orders/cancel?status=cancel&orderId=${order._id}`,
      metadata: {
        orderId: order._id.toString(),
        customerId: customer._id?.toString() || 'guest',
      },
    });

    // Step 4: Commit transaction only after Stripe session is created
    await session.commitTransaction();
    session.endSession();

    return { redirectStripeUrl: stripeSession.url || "" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error('Failed to create order. Please try again.');
  }
};

const confirmOrder = async (payload: { orderId: string; status: string }, res: Response) => {
  if (payload.status === 'success') {
    const order = await Order.findByIdAndUpdate(payload.orderId, { paymentStatus: PaymentStatus.PAID });
    if (order?.orderId) {
       sendEmailToCustomer(order.orderId);
    }

    if (order) {
      RoyalMailOrderService.createOrder(order);
      res.redirect(`${config.client_url}/order-success`);
    }
  }
};

const cancelOrder = async (payload: { orderId: string; status: string }, res: Response) => {
  if (payload.status === 'cancel') {
    const order = await Order.findByIdAndDelete(payload.orderId);
    //  await RoyalMailOrderService.deleteOrder(order?.orderIdentifier ?? 0)
    if (order) {
      res.redirect(`${config.client_url}/order-cancel`);
    }
  }
};

export const OrderCardService = {
  createOrder,
  confirmOrder,
  cancelOrder,
};

// const stripe = require('stripe')(config.stripe_secret_key);
