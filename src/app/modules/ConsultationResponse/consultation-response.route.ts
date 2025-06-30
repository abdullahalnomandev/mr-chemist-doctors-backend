import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import { ConsultationResponseController } from './consultation-response.controller';
import { ConsultationResponseValidation } from './consultation-response.validation';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.customer),
  validateRequest(ConsultationResponseValidation.createConsultationResponseValidationSchema),
  ConsultationResponseController.createConsultationResponse,
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.customer),
  ConsultationResponseController.getAllConsultationResponses,
);

router.get(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.customer),
  ConsultationResponseController.getConsultationResponseById,
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.customer),
  validateRequest(ConsultationResponseValidation.updateConsultationResponseValidationSchema),
  ConsultationResponseController.updateConsultationResponse,
);

router.get(
  '/me/treatment/:treatmentType',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.customer),
  ConsultationResponseController.getMyConsultationResponseByTreatmentType,
);

export const ConsultationResponseRoutes = router;
