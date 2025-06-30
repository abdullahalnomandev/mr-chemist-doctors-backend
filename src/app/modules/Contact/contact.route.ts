import express from 'express';
import { ContactControllers } from './contact.controller';

const router = express.Router();

router.post('/', ContactControllers.createContact);
router.get('/', ContactControllers.getAllContacts);

export const ContactRoutes = router;