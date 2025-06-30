import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewService } from './review.service';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const userId= req.user?.userId as string;
  const result = await ReviewService.createReview(userId,req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getAllReviews({});

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reviews retrieved successfully',
    data: result,
  });
});
const getReviewsByProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params?.productId
  const result = await ReviewService.getReviewsByProduct(productId,req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reviews retrieved successfully',
    data: result,
  });
});
const getSingleReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId
  const result = await ReviewService.getSingleReview(userId,req.params.productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reviews retrieved successfully',
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId
  const payload = req.body;
  const result = await ReviewService.updateReview({userId, ...payload});
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review updated successfully',
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getAllReviews,
  updateReview,
  getSingleReview,
  getReviewsByProduct
};