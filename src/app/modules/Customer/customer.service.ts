/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { User } from '../User/user.model';
import { CustomerSearchableFields } from './customer.constant';
import { TCustomer } from './customer.interface';
import { Customer } from './customer.model';

const getAllCustomersFromDB = async (query: Record<string, unknown>) => {
  const customerQuery = new QueryBuilder(Customer.find(), query).search(CustomerSearchableFields).filter().sort().paginate().fields();

  const result = await customerQuery.modelQuery;
  const meta = await customerQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleCustomerFromDB = async (id: string) => {
  const result = await Customer.findById(id);
  return result;
};

const updateCustomerIntoDB = async (id: string, payload: Partial<TCustomer>) => {

  const result = await Customer.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteCustomerFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedAdmin = await Customer.findByIdAndUpdate(id, { isDeleted: true }, { new: true, session });

    if (!deletedAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    // get user _id from deletedAdmin
    const userId = deletedAdmin.user;

    const deletedUser = await User.findOneAndUpdate(userId, { isDeleted: true }, { new: true, session });

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const CustomerServices = {
  getAllCustomersFromDB,
  getSingleCustomerFromDB,
  updateCustomerIntoDB,
  deleteCustomerFromDB,
};
