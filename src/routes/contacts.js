import express from 'express';
import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from '../controllers/contacts.js';
import { isValidID } from '../middlewares/isValidID.js';
import { validateBody } from '../middlewares/validateBody.js';
import { contactPatchSchema, contactSchema } from '../validation/contacts.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';

const contactsRoutes = express.Router();


contactsRoutes.use(authenticate);

contactsRoutes.get('/', getAllContacts);
contactsRoutes.get('/:contactId', isValidID, getContactById);
contactsRoutes.post('/', upload.single('photo'), validateBody(contactSchema), createContact);
contactsRoutes.patch('/:contactId', isValidID, upload.single('photo'), validateBody(contactPatchSchema), updateContact);
contactsRoutes.delete('/:contactId', isValidID, deleteContact);

export default contactsRoutes;
