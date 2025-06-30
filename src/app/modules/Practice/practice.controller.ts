import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PracticeService } from './practice.service';

const createPractice = catchAsync(async (req: Request, res: Response) => {
  const result = await PracticeService.createPractice(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Practice created successfully',
    data: result,
  });
});

const getAllPractices = catchAsync(async (req: Request, res: Response) => {
  const result = await PracticeService.getAllPractices(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Practices retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getSinglePractice = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PracticeService.getSinglePractice(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Practice retrieved successfully',
    data: result,
  });
});

const updatePractice = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PracticeService.updatePractice(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Practice updated successfully',
    data: result,
  });
});

const deletePractice = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PracticeService.deletePractice(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Practice deleted successfully',
    data: result,
  });
});

export const PracticeController = {
  createPractice,
  getAllPractices,
  getSinglePractice,
  updatePractice,
  deletePractice,
};