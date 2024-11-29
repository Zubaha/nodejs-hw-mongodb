import { getContacts, getContactByIdService, createContactService, updateContactService, deleteContactService } from '../services/contactsService.js';
import createError from 'http-errors';
import mongoose from 'mongoose';
import ctrlWrapper from '../utils/ctrlWrapper.js';

export const getAllContacts = ctrlWrapper(async (req, res) => {
    const contacts = await getContacts();
    res.status(200).json({
        status: 200,
        message: "Successfully found contacts!",
        data: contacts
    });
});

export const getContactById = ctrlWrapper(async (req, res) => {
    const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
        throw createError(404, "Contact not found");
    }

    const contact = await getContactByIdService(contactId);
    
    if (!contact) {
        throw createError(404, "Contact not found");
    }

    res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact
    });
});

export const createContact = ctrlWrapper(async (req, res) => {
    const contactData = req.body;
    const newContact = await createContactService(contactData);
    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data: newContact,
    });
});

export const updateContact = ctrlWrapper(async (req, res) => {
    const { contactId } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
        throw createError(404, "Contact not found"); 
    }

    const updatedContact = await updateContactService(contactId, updateData);
    
    if (!updatedContact) {
        throw createError(404, "Contact not found");
    }
    
    res.status(200).json({
        status: 200,
        message: "Successfully patched a contact!",
        data: updatedContact,
    });
});

export const deleteContact = ctrlWrapper(async (req, res) => {
    const { contactId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
        return res.status(404).json({ status: 404, message: "Contact not found" });
    }

    const deletedContact = await deleteContactService(contactId);
    
    if (!deletedContact) {
        throw createError(404, "Contact not found"); 
    }
    
    res.status(204).send();
});
