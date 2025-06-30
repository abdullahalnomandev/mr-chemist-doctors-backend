import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { CustomerOrderControllers } from './order.controller';

const router = express.Router();

router.post('/', auth(USER_ROLE.superAdmin, USER_ROLE.customer), CustomerOrderControllers.createCustomerOrder);
router.get('/success', CustomerOrderControllers.orderSuccess);
router.get('/cancel', CustomerOrderControllers.orderCancel);
router.get('/',  CustomerOrderControllers.getAllCustomerOrder);
router.get('/:id',  CustomerOrderControllers.getSingleCUstomerOrder);

export const OrderRoutes = router;
