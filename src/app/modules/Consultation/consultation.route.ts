import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import { ConsultationController } from './consultation.controller';
import { ConsultationValidation } from './consultation.validation';

const router = express.Router();

router.post(
  '/create',
  //   auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(ConsultationValidation.createConsultationValidationSchema),
  ConsultationController.createConsultation,
);

router.get('/', ConsultationController.getAllConsultations);

router.get('/:id', auth(USER_ROLE.superAdmin, USER_ROLE.admin), ConsultationController.getConsultationById);

router.get(
  '/treatment/:treatmentSlug',
  // auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  ConsultationController.getConsultationsByTreatment,
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(ConsultationValidation.updateConsultationValidationSchema),
  ConsultationController.updateConsultation,
);

router.delete('/:id', auth(USER_ROLE.superAdmin, USER_ROLE.admin), ConsultationController.deleteConsultation);

export const ConsultationRoutes = router;
