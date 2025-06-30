import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import { ProductController } from './product.controller';
import { ProductValidation } from './product.validation';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  // upload.single('file') as unknown as RequestHandler,
  validateRequest(ProductValidation.createProductValidationSchema),
  ProductController.createProduct,
);

router.get('/', ProductController.getAllProducts);
router.get('/products-by-treatment/:id', ProductController.getProductsByTreatment);
router.get('/products-by-order', auth(USER_ROLE.superAdmin,USER_ROLE.customer, USER_ROLE.admin), ProductController.getProductsByOrder);

router.get('/id/:id', ProductController.getSingleProduct);

router.get('/:slug', ProductController.getProductBySlug);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(ProductValidation.updateProductValidationSchema),
  ProductController.updateProduct,
);

router.delete('/:id', auth(USER_ROLE.superAdmin, USER_ROLE.admin), ProductController.deleteProduct);

export const ProductRoutes = router;
