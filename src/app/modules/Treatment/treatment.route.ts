import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import { TreatmentController } from './treatment.controller';
import { TreatmentValidation } from './treatment.validation';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(TreatmentValidation.createTreatmentValidationSchema),
  TreatmentController.createTreatment,
);

router.get('/', TreatmentController.getAllTreatments);

router.get('/featured', TreatmentController.getFeaturedTreatments);

router.get('/:slug', TreatmentController.getTreatmentBySlug);

router.get('/id/:id', TreatmentController.getTreatmentById);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(TreatmentValidation.updateTreatmentValidationSchema),
  TreatmentController.updateTreatment,
);

router.delete(
  '/:id',
  // auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  TreatmentController.deleteTreatment,
);

router.post(
  '/batch-delete',
  // auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  TreatmentController.deleteTreatments,
);

export const TreatmentRoutes = router;
