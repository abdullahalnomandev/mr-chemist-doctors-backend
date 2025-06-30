import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TreatmentService } from './treatment.service';

const createTreatment = catchAsync(async (req, res) => {
  const result = await TreatmentService.createTreatment(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Treatment created successfully',
    data: result,
  });
});

const getAllTreatments = catchAsync(async (req, res) => {
  const result = await TreatmentService.getAllTreatments(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Treatments are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getFeaturedTreatments = catchAsync(async (req, res) => {
  const treatments = await TreatmentService.getFeaturedTreatments(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Featured treatments are retrieved successfully',
    data: treatments,
  });
});

const getTreatmentBySlug = catchAsync(async (req, res) => {
  const treatments = await TreatmentService.getTreatmentBySlug(req.params);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Treatments by slug are retrieved successfully',
    data: treatments,
  });
});

const getTreatmentById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TreatmentService.getTreatmentById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Treatment retrieved successfully',
    data: result,
  });
});

const updateTreatment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TreatmentService.updateTreatment(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Treatment updated successfully',
    data: result,
  });
});

const deleteTreatment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TreatmentService.deleteTreatment(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Treatment deleted successfully',
    data: result,
  });
});

const deleteTreatments = catchAsync(async (req, res) => {
  const ids = req.body.ids;
  const result = await TreatmentService.deleteTreatments(ids);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Treatments deleted successfully',
    data: result,
  });
});

export const TreatmentController = {
  createTreatment,
  getAllTreatments,
  getFeaturedTreatments,
  getTreatmentBySlug,
  getTreatmentById,
  updateTreatment,
  deleteTreatment,
  deleteTreatments,
};
