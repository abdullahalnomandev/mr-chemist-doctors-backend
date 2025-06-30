import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { Treatment } from '../Treatment/treatment.model';
import { IConsultation } from './consultation.interface';
import { Consultation } from './consultation.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { ConsultationSearchableFields } from './consultation.constant';

const createConsultation = async (payload: IConsultation) => {
  const treatment = await Treatment.findById(payload.treatment);
  if (!treatment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Treatment not found with this id');
  }

  const result = await Consultation.create(payload);
  return result;
};

const getAllConsultations = async (query: Record<string, unknown>) => {
  const consultationQuery = new QueryBuilder(Consultation.find(), query)
    .search(ConsultationSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await consultationQuery.modelQuery;
  const meta = await consultationQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getConsultationById = async (id: string) => {
  const result = await Consultation.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Consultation not found');
  }
  return result;
};

const getConsultationsByTreatment = async (treatmentSlug: string) => {
  const result = await Consultation.aggregate([
    {
      $lookup: {
        from: 'treatments',
        localField: 'treatment',
        foreignField: '_id',
        as: 'treatmentInfo',
      },
    },
    { $unwind: '$treatmentInfo' },
    { $match: { 'treatmentInfo.slug': treatmentSlug, isActive: true } },
    // Optionally, remove treatmentInfo from result or project fields as needed
  ]);
  // If you want to return a single consultation (like before):
  return result[0] || null;
};

const updateConsultation = async (id: string, payload: Partial<IConsultation>) => {
  const result = await Consultation.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Consultation not found');
  }

  return result;
};

const deleteConsultation = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const result = await Consultation.findByIdAndUpdate(
      id,
      { isActive: false },
      {
        new: true,
        session,
      },
    );

    if (!result) {
      throw new AppError(httpStatus.NOT_FOUND, 'Consultation not found');
    }

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};

export const ConsultationService = {
  createConsultation,
  getAllConsultations,
  getConsultationById,
  getConsultationsByTreatment,
  updateConsultation,
  deleteConsultation,
};
