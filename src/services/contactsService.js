import Contact from '../models/contacts.js';

export const getContacts = async (page = 1, perPage = 10, sortBy = '_id', sortOrder = 'asc', filter = {}) => {
    const totalItems = await Contact.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / perPage);
    const hasPreviousPage = page > 1;
    const hasNextPage = page < totalPages;

    const contacts = await Contact.find(filter)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

    return {
        data: contacts,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage,
        hasNextPage,
    };
};

export const getContactByIdService = async (contactId, userId) => {
    return await Contact.findOne({ _id: contactId, userId });
};

export const createContactService = async (contactData) => {
    const newContact = new Contact(contactData);
    await newContact.save();
    return newContact.toObject({ versionKey: false });
};

export const updateContactService = async (contactId, updateData, userId) => {
    return await Contact.findOneAndUpdate({ _id: contactId, userId }, updateData, { new: true });
};

export const deleteContactService = async (contactId) => {
    const deletedContact = await Contact.findOneAndDelete({
        _id: contactId,
    });
    return deletedContact;
};
