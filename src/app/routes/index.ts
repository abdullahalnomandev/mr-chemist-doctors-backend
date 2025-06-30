import { Router } from 'express';
import { AdminRoutes } from '../modules/Admin/admin.route';
import { AuthRoutes } from '../modules/Auth/auth.route';

import { ConsultationRoutes } from '../modules/Consultation/consultation.route';
import { ConsultationResponseRoutes } from '../modules/ConsultationResponse/consultation-response.route';
import { CustomerRoutes } from '../modules/Customer/customer.route';
import { ProductRoutes } from '../modules/Product/product.route';
import { TreatmentRoutes } from '../modules/Treatment/treatment.route';
import { UserRoutes } from '../modules/User/user.route';
import { OrderRoutes } from '../modules/Order/order.route';
import { CouponRoutes } from '../modules/coupon/copon.route';
import { BlogRoutes } from '../modules/Blog/blog.route';
import { PracticeRoutes } from '../modules/Practice/practice.route';
import { ContactRoutes } from '../modules/Contact/contact.route';
import { ReviewRoutes } from '../modules/Review/review.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/admins',
    route: AdminRoutes,
  },
  {
    path: '/customers',
    route: CustomerRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/treatments',
    route: TreatmentRoutes,
  },
  {
    path: '/products',
    route: ProductRoutes,
  },
  {
    path: '/blogs',
    route: BlogRoutes,
  },
  {
    path: '/consultations',
    route: ConsultationRoutes,
  },
  {
    path: '/consultation-responses',
    route: ConsultationResponseRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
  {
    path: '/coupon',
    route: CouponRoutes,
  },
  {
    path: '/practices',
    route: PracticeRoutes,
  },
  {
    path: '/contacts',
    route: ContactRoutes,
  },
  {
    path: '/reviews',
    route: ReviewRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
