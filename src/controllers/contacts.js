import { getContacts, getContactByIdService, createContactService, updateContactService, deleteContactService } from '../services/contactsService.js';
import createError from 'http-errors';
import mongoose from 'mongoose';

export const getAllContacts = async (req, res) => {
    try {
        const contacts = await getContacts();
        res.status(200).json({
            status: 200,
            message: "Successfully found contacts!",
            data: contacts
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Error retrieving contacts",
            error: error.message
        });
    }
};

export const getContactById = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(error.status || 500).json({
            status: error.status || 500,
            message: error.message || "Error retrieving contact",
            error: error.message
        });
    }
};

export const createContact = async (req, res) => {
    const contactData = req.body;
    const newContact = await createContactService(contactData);
    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data: newContact,
    });
};

export const updateContact = async (req, res) => {
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
};

export const deleteContact = async (req, res) => {
    const { contactId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
        return res.status(404).json({ status: 404, message: "Contact not found" });
    }

    const deletedContact = await deleteContactService(contactId);
    
    if (!deletedContact) {
        return res.status(404).json({ status: 404, message: "Contact not found" });
    }
    
    res.status(204).send();
};
