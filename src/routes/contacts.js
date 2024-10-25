import express from 'express';
import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from '../controllers/contacts.js';
import { isValidID } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { contactSchema } from '../validation/contacts.js';

const router = express.Router();

router.get('/', getAllContacts);
router.get('/:contactId',isValidID, getContactById);
router.post('/', validateBody(contactSchema), createContact);
router.patch('/:contactId',isValidID, updateContact);
router.delete('/:contactId',isValidID, deleteContact);

export default router;
