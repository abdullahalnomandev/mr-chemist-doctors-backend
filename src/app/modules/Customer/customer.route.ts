import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { CustomerControllers } from './customer.controller';

const router = express.Router();

router.get('/', CustomerControllers.getAllCustomers);

router.get('/:id', auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.customer), CustomerControllers.getSingleCustomer);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.customer),
  // validateRequest(updateCustomerValidationSchema),
  CustomerControllers.updateCustomer,
);

router.delete('/:CustomerId', auth(USER_ROLE.superAdmin, USER_ROLE.admin), CustomerControllers.deleteCustomer);

export const CustomerRoutes = router;
