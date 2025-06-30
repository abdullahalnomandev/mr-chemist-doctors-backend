import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IConsultationResponse } from './consultation-response.interface';
import { ConsultationResponse } from './consultation-response.model';
import { Types } from 'mongoose';
import { Treatment } from '../Treatment/treatment.model';

const createConsultationResponse = async (userId: string, payload: Partial<IConsultationResponse>) => {
  const existingResponse = await ConsultationResponse.findOne({
    user: userId,
    treatment: payload.treatment,
  });

  if (existingResponse) {
    throw new AppError(httpStatus.CONFLICT, 'Consultation response already exists for this treatment');
  }

  const result = await ConsultationResponse.create({
    ...payload,
    user: userId,
  });

  return result;
};

const getAllConsultationResponses = async (userId?: string) => {
  const query = userId ? { user: userId } : {};
  const result = await ConsultationResponse.find(query)
    .populate('user', 'name email')
    .populate('treatment', 'name code')
    .populate('consultation', 'title')
    .populate('product', 'name')
    .populate('reviewedBy', 'name');
  return result;
};

const getConsultationResponseById = async (id: string) => {
  const result = await ConsultationResponse.findById(id)
    .populate('user', 'name email')
    .populate('treatment', 'name code')
    .populate('consultation', 'title')
    .populate('product', 'name')
    .populate('reviewedBy', 'name');

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Consultation response not found');
  }
  return result;
};

const updateConsultationResponse = async (id: string, reviewerId: string, payload: Partial<IConsultationResponse>) => {
  const response = await ConsultationResponse.findById(id);
  if (!response) {
    throw new AppError(httpStatus.NOT_FOUND, 'Consultation response not found');
  }

  if (payload.status) {
    if (payload.status === 'completed') {
      payload.completedAt = new Date();
    }
    if (['approved', 'rejected'].includes(payload.status)) {
      payload.reviewedBy = reviewerId as unknown as Types.ObjectId;
      payload.reviewedAt = new Date();
    }
  }

  const result = await ConsultationResponse.findByIdAndUpdate(id, payload, {
    new: true,
  })
    .populate('user', 'name email')
    .populate('treatment', 'name code')
    .populate('consultation', 'title')
    .populate('product', 'name')
    .populate('reviewedBy', 'name');

  return result;
};

const getMyConsultationResponseByTreatmentType = async (userId: string, treatmentCode: string) => {
  // Find the treatment by code
  const treatment = await Treatment.findOne({ code: treatmentCode });
  if (!treatment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Treatment not found with this code');
  }

  // Find the consultation response for this user and treatment
  const result = await ConsultationResponse.findOne({
    user: userId,
    treatment: treatment._id,
  })
    .populate('user', 'name email')
    .populate('treatment', 'name code')
    .populate('consultation', 'title')
    .populate('product', 'name')
    .populate('reviewedBy', 'name');

  return result;
};

export const ConsultationResponseService = {
  createConsultationResponse,
  getAllConsultationResponses,
  getConsultationResponseById,
  updateConsultationResponse,
  getMyConsultationResponseByTreatmentType, // <-- add this line
};
