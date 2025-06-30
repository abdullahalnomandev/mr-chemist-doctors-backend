/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../errors/AppError';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

import { TAdmin } from '../Admin/admin.interface';
import { Admin } from '../Admin/admin.model';

import { TUser } from './user.interface';
import { User } from './user.model';
import { generateAdminId, generateCustomerId } from './user.utils';
import { TCustomer } from '../Customer/customer.interface';
import { Customer } from '../Customer/customer.model';
import { USER_ROLE } from './user.constant';
import QueryBuilder from '../../builder/QueryBuilder';

const createAdminIntoDB = async (file: any, password: string, role: string, payload: TAdmin) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set admin role
  userData.role = (role ?? 'admin') as 'superAdmin' | 'admin' | 'editor' | 'customer';
  //set admin email
  userData.email = payload.email;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateAdminId();

    if (file) {
      const imageName = `${userData.id}${payload?.name?.firstName}`;
      const path = file?.path;
      //send image to cloudinary
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    //create a admin
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, `Failed to create ${role}`);
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id as unknown as mongoose.Types.ObjectId; //reference _id

    // create a admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, `Failed to create ${role}`);
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createCustomerIntoDB = async (file: any, password: string, payload: TCustomer) => {
  // Check if user already exists with this email
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, 'User already exists with this email');
  }

  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given, use default password
  userData.password = password || (config.default_password as string);
  userData.needsPasswordChange = password ? false : true;

  //set customer role
  userData.role = 'customer';
  //set customer email
  userData.email = payload.email;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set generated id
    userData.id = await generateCustomerId();

    if (file) {
      const imageName = `${userData.id}${payload?.name?.firstName}`;
      const path = file?.path;
      //send image to cloudinary
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    //create a customer
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create customer');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id as unknown as mongoose.Types.ObjectId; //reference _id

    // create a customer (transaction-2)
    const newCustomer = await Customer.create([payload], { session });

    if (!newCustomer.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create customer');
    }

    await session.commitTransaction();
    await session.endSession();

    return newCustomer;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
const getMe = async (userId: string, role: string) => {
  let result = null;

  if (role === 'customer') {
    result = await Customer.findOne({ id: userId }).populate('user');
  } else {
    result = await User.findOne({ id: userId });
  }

  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const getNonCustomerUsersFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(
    User.find({
      role: {
        $nin: [USER_ROLE.customer, USER_ROLE.superAdmin],
      },
    }),
    query,
  )
    .search(['email', 'role'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery.select('+password');
  const meta = await userQuery.countTotal();

  return {
    result,
    meta,
  };
};

const updateUserInDB = async (id: string, payload: any) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const getUserByIdFromDB = async (id: string) => {
  const result = await User.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  return result;
};

const createUserIntoDB = async (payload: TUser) => {
  const userData: Partial<TUser> = payload;
  userData.id = await generateAdminId();

  const result = await User.create(userData);
  return result;
};

const deleteUserFromDB = async (id: string) => {
  const result = await User.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  return result;
};

// Add to exports
export const UserServices = {
  createAdminIntoDB,
  createCustomerIntoDB,
  getMe,
  changeStatus,
  getNonCustomerUsersFromDB,
  updateUserInDB,
  getUserByIdFromDB,
  createUserIntoDB,
  deleteUserFromDB,
};
