import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ConsultationResponseService } from './consultation-response.service';

const createConsultationResponse = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await ConsultationResponseService.createConsultationResponse(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Consultation response created successfully',
    data: result,
  });
});

const getAllConsultationResponses = catchAsync(async (req, res) => {
  const userId = req.user.role === 'user' ? req.user.id : undefined;
  const result = await ConsultationResponseService.getAllConsultationResponses(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Consultation responses retrieved successfully',
    data: result,
  });
});

const getConsultationResponseById = catchAsync(async (req, res) => {
  const result = await ConsultationResponseService.getConsultationResponseById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Consultation response retrieved successfully',
    data: result,
  });
});

const updateConsultationResponse = catchAsync(async (req, res) => {
  const reviewerId = req.user.id;
  const result = await ConsultationResponseService.updateConsultationResponse(req.params.id, reviewerId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Consultation response updated successfully',
    data: result,
  });
});

const getMyConsultationResponseByTreatmentType = catchAsync(async (req, res) => {

  const userId = req.user._id;
  const treatmentType = req.params.treatmentType;
  const result = await ConsultationResponseService.getMyConsultationResponseByTreatmentType(userId, treatmentType);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Consultation response retrieved successfully',
    data: result,
  });
});

export const ConsultationResponseController = {
  createConsultationResponse,
  getAllConsultationResponses,
  getConsultationResponseById,
  updateConsultationResponse,
  getMyConsultationResponseByTreatmentType, // <-- add this line
};
