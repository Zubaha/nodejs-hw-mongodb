import Contact from '../models/contacts.js';

export const getContacts = async () => {
        return await Contact.find();
};

export const getContactByIdService = async (contactId) => {
        return await Contact.findById(contactId);
};

export const createContactService = async (contactData) => {
    const newContact = new Contact(contactData);
    return await newContact.save();
};

export const updateContactService = async (contactId, updateData) => {
    const updatedContact = await Contact.findByIdAndUpdate(contactId, updateData, { new: true });
    return updatedContact;
};

export const deleteContactService = async (contactId) => {
    const deletedContact = await Contact.findOneAndDelete({
        _id: contactId,
    });
    return deletedContact;
};
