import express from 'express';
import { ReviewController } from './review.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post('/',auth(USER_ROLE.customer,USER_ROLE.admin,USER_ROLE.superAdmin), ReviewController.createReview);
router.get('/:productId',auth(USER_ROLE.customer,USER_ROLE.admin,USER_ROLE.superAdmin), ReviewController.getSingleReview);
router.get('/reviews/:productId',auth(USER_ROLE.customer,USER_ROLE.admin,USER_ROLE.superAdmin), ReviewController.getReviewsByProduct);
router.get('/', ReviewController.getAllReviews);
router.patch('/',
    auth(USER_ROLE.customer,USER_ROLE.admin,USER_ROLE.superAdmin), ReviewController.updateReview);

export const ReviewRoutes = router;