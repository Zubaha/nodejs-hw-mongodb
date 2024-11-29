import Contact from '../models/contacts.js';

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
