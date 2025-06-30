import QueryBuilder from '../../builder/QueryBuilder';
import { PracticeSearchableFields } from './practice.constant';
import { IPractice } from './practice.interface';
import { Practice } from './practice.model';

const createPractice = async (payload: IPractice): Promise<IPractice> => {
  const result = await Practice.create(payload);
  return result;
};
const getAllPractices = async (query: Record<string, unknown>) => {
  const practiceQuery = new QueryBuilder(Practice.find(), query)
    .search(PracticeSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await practiceQuery.modelQuery;
  const meta = await practiceQuery.countTotal();
  return {
      meta, 
      result,
  };
};

const getSinglePractice = async (id: string): Promise<IPractice | null> => {
  const result = await Practice.findById(id);
  return result;
};

const updatePractice = async (id: string, payload: Partial<IPractice>): Promise<IPractice | null> => {
  const result = await Practice.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deletePractice = async (id: string): Promise<IPractice | null> => {
  const result = await Practice.findByIdAndDelete(id);
  return result;
};

export const PracticeService = {
  createPractice,
  getAllPractices,
  getSinglePractice,
  updatePractice,
  deletePractice,
};