import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OrderService } from './order.service';
import { OrderCardService } from './order.card.service';

const createCustomerOrder = catchAsync(async (req, res) => {
  const userId = req.user?._id;
  const customerOrderData = req.body;

  const origin = `${req.protocol}://${req.get('host')}`;

  const result = await OrderService.createOrder(userId, customerOrderData, origin);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer order created successfully',
    data: result,
  });
});

const getAllCustomerOrder = catchAsync(async (req, res) => {
  const userId = req.user?._id;
  const role = req.user?.role;

  const query = req.query;
  const result = await OrderService.getAllOrder({query, userId, role});
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer order fetched successfully',
    data: result,
  });
});

const getSingleCUstomerOrder = catchAsync(async (req, res) => {
  const userId = req.user?._id;
  const customerOrderId = req.params?.id;
  const role = req.user?.role;

  // const query = req.query;
  const result = await OrderService.getSingleOrder({customerOrderId, userId, role});
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer order fetched successfully',
    data: result,
  });
});

const orderSuccess = catchAsync(async (req, res) => {
  const order = req.query as { orderId: string; status: string };
  await OrderCardService.confirmOrder(order, res);
});

const orderCancel = catchAsync(async (req, res) => {
  const order = req.query as { orderId: string; status: string };
  await OrderCardService.cancelOrder(order, res);
});

export const CustomerOrderControllers = {
  createCustomerOrder,
  orderSuccess,
  orderCancel,
  getAllCustomerOrder,
  getSingleCUstomerOrder
};
