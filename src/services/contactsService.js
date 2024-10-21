import Contact from '../models/contacts.js';
import createError from 'http-errors';

export const getContacts = async () => {
    try {
        return await Contact.find();
    } catch (error) {
        throw new Error(`Error fetching contacts from database: ${error.message}`);
    }
};

export const getContactByIdService = async (contactId) => {
    try {
        return await Contact.findById(contactId);
    } catch (error) {
        throw new Error(`Error fetching contact from database: ${error.message}`);
    }
};

export const createContactService = async (contactData) => {
    const newContact = new Contact(contactData);
    return await newContact.save();
};

export const updateContactService = async (contactId, updateData) => {
    const updatedContact = await Contact.findByIdAndUpdate(contactId, updateData, { new: true });
    if (!updatedContact) {
        throw createError(404, "Contact not found");
    }
    return updatedContact;
};

export const deleteContactService = async (contactId) => {
    const deletedContact = await Contact.findOneAndDelete({
        _id: contactId,
    });
    if (!deletedContact) {
        throw createError(404, "Contact not found");
    }
    return deletedContact;
};
