import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const createAdmin = catchAsync(async (req, res) => {
  const { password, role, admin: adminData } = req.body;

  const result = await UserServices.createAdminIntoDB(req.file, password, role, adminData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is created successfully',
    data: result,
  });
});

const createCustomer = catchAsync(async (req, res) => {
  const {password,customer:customerData} = req.body;

  const result = await UserServices.createCustomerIntoDB(req.file, password, customerData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer is created successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {

  const { userId, role } = req.user;
  const result = await UserServices.getMe(userId, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved successfully',
    data: result,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await UserServices.changeStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Status is updated successfully',
    data: result,
  });
});

// Add this to your existing UserControllers
const getNonCustomerUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getNonCustomerUsersFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Non-customer users retrieved successfully',
    data: result.result,
    meta: result.meta,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await UserServices.updateUserInDB(id, payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.getUserByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

const createUser = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await UserServices.createUserIntoDB(payload);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.deleteUserFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

// Add to exports
export const UserControllers = {
  createAdmin,
  createCustomer,
  getMe,
  changeStatus,
  getNonCustomerUsers,
  updateUser,
  getUserById,
  createUser,
  deleteUser,
};
