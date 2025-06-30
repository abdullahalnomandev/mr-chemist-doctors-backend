import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { CouponControllers } from './coupon.controller';

const router = express.Router();

// will update role . Only permission will be given to admin
router.post('/', auth(USER_ROLE.superAdmin,USER_ROLE.admin, USER_ROLE.customer),
 CouponControllers.createCoupon);
router.get('/', auth(USER_ROLE.superAdmin,USER_ROLE.admin, USER_ROLE.customer),
 CouponControllers.getAllCoupon);
router.get('/:code', auth(USER_ROLE.superAdmin,USER_ROLE.admin, USER_ROLE.customer),
 CouponControllers.getSingleCoupon);

export const CouponRoutes = router;
