/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { orderSearchableFields } from './order.constant';
import { CreateOrderPayload } from './order.interface';
import { OrderCardService } from './order.card.service';
import { OrderCodService } from './order.cod.service';
import { Order } from './order.model';
import { buildOrderItems, generateOrderId, getRoyalMailStatusByDates, sendEmailToCustomer } from './order.util';
import { RoyalMailOrderService } from './royalmail/order.roymail.service';


const createOrder = async (userId: mongoose.Types.ObjectId, payload: CreateOrderPayload, origin: string) => {

  const { items, paymentMethod, couponCode } = payload;

  if (!items || items.length === 0)  throw new Error('Order must contain at least one item');

  const orderItems = await buildOrderItems(items);
  const orderId = await generateOrderId();

  if (paymentMethod === 'cash') {
    const order = await OrderCodService.createOrder({
      orderId,
      customer: userId,
      items: orderItems  ,
      paymentMethod,
      couponCode,
    });
     sendEmailToCustomer(order.orderId)
     RoyalMailOrderService.createOrder(order);
    return {
      subTotal: order?.subTotal,
      taxAmount: order?.taxAmount,
      totalAmount: order?.totalAmount,
    };
  }

  if (paymentMethod === 'card') {
    const order = await OrderCardService.createOrder({
      orderId,
      customer: userId,
      items: orderItems,
      paymentMethod,
      couponCode,
    },origin);
    return order;
  }
};

// export const getAllOrder = async (query = {}) => {
//   const orderQuery = new QueryBuilder(Order.find(), query).search(orderSearchableFields);

//   const [orders, total] = await Promise.all([
//     orderQuery.modelQuery.populate("items.product", "name"),
//     orderQuery.countTotal(),
//   ]);

//   const result = orders.map((order) => {
//     const plainOrder = order.toObject();
//     return {
//       ...plainOrder,
//       items: plainOrder.items.map((item) =>
//         typeof item === "object" && item !== null && typeof (item as any).toObject === "function"
//           ? (item as any).toObject()
//           : item
//       ),
//     };
//   });

//   return {
//     meta: total,
//     result,
//   };
// };




export const getAllOrder = async ({
  query = {},
  userId,
  role,
}: {
  query?: Record<string, unknown>;
  userId: string;
  role: string;
}) => {
  let queryFilter = {};

  if (role === 'customer') {
    queryFilter = { customer: userId };
  }

  const orderQuery = new QueryBuilder(Order.find(queryFilter).populate("customer"), query)
    .search(orderSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [orders, meta] = await Promise.all([
    orderQuery.modelQuery.populate("items.product", "imageUrls"),
    orderQuery.countTotal(),
  ]);

  const orderIdentifiers = orders
    .map((order) => order.orderIdentifier)
    .filter((id): id is number => typeof id === "number");

  const royalMailStatuses: Record<number, string> = {};

  await Promise.all(
    orderIdentifiers.map(async (identifier) => {
      try {
        const order = await RoyalMailOrderService.getOrderByIdentifier(identifier);
        if (order) {
          const status = getRoyalMailStatusByDates(order);
          royalMailStatuses[identifier] = status;
        }
      } catch  {
        console.warn(`⚠️ Failed to fetch Royal Mail status for order ${identifier}`);
      }
    })
  );

  const result = orders.map((order) => {
    const plainOrder = order.toObject();
    const orderId = plainOrder.orderIdentifier;

    return {
      ...plainOrder,
      royalMailStatus:
        typeof orderId === "number" && royalMailStatuses[orderId]
          ? royalMailStatuses[orderId]
          : plainOrder.royalMailStatus,
      items: plainOrder.items?.map((item: any) =>
        typeof item?.toObject === "function" ? item.toObject() : item
      ),
    };
  });

  return {
    meta,
    result,
  };
};


export const getSingleOrder = async ({
  customerOrderId,
  userId,
  role,
}: {
  customerOrderId: string;
  userId: string;
  role: string;
}) => {
  const queryFilter: Record<string, unknown> = { orderId:customerOrderId };

  if (role === "customer") {
    queryFilter.customer = userId;
  }

  const order = await Order.findOne(queryFilter).populate("items.product", "imageUrls");

  if (!order) {
    throw new Error("Order not found");
  }

  const plainOrder = order.toObject();
  const orderId = plainOrder.orderIdentifier;

  let royalMailStatus = plainOrder.royalMailStatus;

  if (typeof orderId === "number") {
    try {
      const royalMailOrder = await RoyalMailOrderService.getOrderByIdentifier(orderId);
      if (royalMailOrder) {
        royalMailStatus = getRoyalMailStatusByDates(royalMailOrder);
      }
    } catch {
      console.warn(`⚠️ Failed to fetch Royal Mail status for order ${orderId}`);
    }
  }

  return {
    ...plainOrder,
    royalMailStatus,
    items: plainOrder.items?.map((item: any) =>
      typeof item?.toObject === "function" ? item.toObject() : item
    ),
  };
};
export const OrderService = {
  createOrder,
  getAllOrder,
  getSingleOrder
};
