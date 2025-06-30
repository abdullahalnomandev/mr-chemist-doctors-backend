import express from 'express';
import { PracticeController } from './practice.controller';

const router = express.Router();

router.post(
  '/create-practice',
  PracticeController.createPractice,
);

router.get('/', PracticeController.getAllPractices);

router.get('/:id', PracticeController.getSinglePractice);

router.patch('/:id', PracticeController.updatePractice);

router.delete('/:id', PracticeController.deletePractice);

export const PracticeRoutes = router;