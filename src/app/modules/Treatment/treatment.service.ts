import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { ITreatment } from './treatment.interface';
import { Treatment } from './treatment.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { TreatmentSearchableFields } from './treatment.constant';

const createTreatment = async (payload: ITreatment) => {
  const result = await Treatment.create(payload);
  return result;
};

const getAllTreatments = async (query: Record<string, unknown>) => {
  // const treatmentQuery = new QueryBuilder(Treatment.find().populate('consultations'), query)
  const treatmentQuery = new QueryBuilder(Treatment.find(), query).search(TreatmentSearchableFields).filter().sort().paginate().fields();

  const result = await treatmentQuery.modelQuery;
  const meta = await treatmentQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getFeaturedTreatments = async (query: Record<string, unknown>) => {
  const limit = Number(query.limit);
  const productLimit = Number(query.product_limit) || 4;

  const treatments = await Treatment.aggregate([
    {
      $lookup: {
        from: 'products',
        let: { treatmentId: '$_id' },
        pipeline: [
          // whole query is responsible to get at max 4 products assigned with the treatment, and only take name and code field from the product collection
          { $match: { $expr: { $eq: ['$treatment', '$$treatmentId'] } } },
          { $project: { _id: 0, name: 1, slug: 1 } },
          { $limit: productLimit },
        ],
        as: 'products',
      },
    },
    // if limit is passed only then apply limit
    ...(limit ? [{ $limit: limit }] : []),
    { $project: { _id: 0, name: 1, slug: 1, products: 1, logoUrl: 1 } },
  ]);

  return treatments;
};

const getTreatmentBySlug = async (query: Record<string, unknown>) => {
  // Find treatment by code instead of slug
  const result = await Treatment.findOne({ slug: query.slug });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Treatment not found');
  }
  
  // Lookup all products related to this treatment
  const treatmentWithProducts = await Treatment.aggregate([
    { $match: { _id: result._id } },
    {
      $lookup: {
        from: 'products',
        let: { treatmentId: '$_id' },
        pipeline: [
          { $match: { 
            $expr: { $eq: ['$treatment', '$$treatmentId'] },
            isActive: true 
          }},
          { $project: { 
            name: 1, 
            slug: 1, 
            description: 1, 
            basePrice: 1, 
            sizeVariants: 1,
            imageUrl: 1,
            needConsultation: 1,
            keyPoints: 1
          }}
        ],
        as: 'products',
      },
    },
    {
      $lookup: {
        from: 'consultations',
        let: { treatmentId: '$_id' },
        pipeline: [
          { $match: { 
            $expr: { $eq: ['$treatment', '$$treatmentId'] },
            isActive: true 
          }},
          { $project: { title: 1, subtitle: 1 }}
        ],
        as: 'consultation',
      },
    },
    { $project: { __v: 0 } }
  ]);
  
  return treatmentWithProducts[0] || result;
};

const getTreatmentById = async (id: string) => {
  const result = await Treatment.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Treatment not found');
  }
  return result;
};

const updateTreatment = async (id: string, payload: Partial<ITreatment>) => {
  const result = await Treatment.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Treatment not found');
  }
  return result;
};

const deleteTreatment = async (id: string) => {
  const result = await Treatment.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Treatment not found');
  }
  return result;
};

const deleteTreatments = async (ids: string[]) => {
  const result = await Treatment.deleteMany({ _id: { $in: ids } });

  if (result.deletedCount === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'Treatments not found');
  }
  return result;
};

export const TreatmentService = {
  createTreatment,
  getAllTreatments,
  getFeaturedTreatments,
  getTreatmentById,
  getTreatmentBySlug,
  updateTreatment,
  deleteTreatment,
  deleteTreatments,
};
