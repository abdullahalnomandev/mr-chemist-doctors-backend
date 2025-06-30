/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { createAdminValidationSchema } from '../Admin/admin.validation';
import { USER_ROLE } from './user.constant';
import { UserControllers } from './user.controller';
import { UserValidation } from './user.validation';

const router = express.Router();

router.post(
  '/create-user',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.createUser,
);

router.get('/get-by-id/:id', auth(USER_ROLE.superAdmin, USER_ROLE.admin), UserControllers.getUserById);

router.get(
  '/get/non-customers',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  UserControllers.getNonCustomerUsers,
);

router.post(
  '/create-admin',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(createAdminValidationSchema),
  UserControllers.createAdmin,
);

router.post('/create-customer', 
  // validateRequest(UserValidation.createUserValidationSchema), 
  UserControllers.createCustomer);

router.post(
  '/change-status/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(UserValidation.changeStatusValidationSchema),
  UserControllers.changeStatus,
);

router.get('/me', auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.customer), UserControllers.getMe);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(UserValidation.updateUserValidationSchema),
  UserControllers.updateUser,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  UserControllers.deleteUser,
);

export const UserRoutes = router;
