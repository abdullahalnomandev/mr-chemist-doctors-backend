import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ConsultationService } from './consultation.service';

const createConsultation = catchAsync(async (req, res) => {
  const result = await ConsultationService.createConsultation(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Consultation form created successfully',
    data: result,
  });
});

const getAllConsultations = catchAsync(async (req, res) => {
  const result = await ConsultationService.getAllConsultations(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Consultations are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getConsultationById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ConsultationService.getConsultationById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Consultation retrieved successfully',
    data: result,
  });
});

const getConsultationsByTreatment = catchAsync(async (req, res) => {
  const { treatmentSlug } = req.params;
  const result =
    await ConsultationService.getConsultationsByTreatment(treatmentSlug);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Treatment consultations retrieved successfully',
    data: result,
  });
});

const updateConsultation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ConsultationService.updateConsultation(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Consultation updated successfully',
    data: result,
  });
});

const deleteConsultation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ConsultationService.deleteConsultation(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Consultation deleted successfully',
    data: result,
  });
});

export const ConsultationController = {
  createConsultation,
  getAllConsultations,
  getConsultationById,
  getConsultationsByTreatment,
  updateConsultation,
  deleteConsultation,
};
