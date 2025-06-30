import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CouponCodService } from "./coupon.service";

const createCoupon = catchAsync(async (req, res) => {

    const payload = req.body;
    const result = await CouponCodService.createCouponCode(payload);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Coupon is created successfully',
        data: result
    });
  });

  const getAllCoupon = catchAsync(async (req, res) => {
    const result = await CouponCodService.getAllCouponCodes();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Coupon is retrieved successfully',
        data: result,
      });
  });

  const getSingleCoupon = catchAsync(async (req, res) => {
    const { code } = req.params;
    const result = await CouponCodService.getSingleCouponCode(code);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Coupon is retrieved successfully',
        data: result,
      });
    })
  
  export const CouponControllers = {
    createCoupon,
    getAllCoupon,
    getSingleCoupon,
  };