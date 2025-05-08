const Contact = require('../models/Contact');

exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.findAll();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
};

exports.createContact = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const newContact = await Contact.create({ name, email, phone });
        res.status(201).json(newContact);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create contact' });
    }
};

exports.getContactById = async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.json(contact);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch contact' });
    }
};

exports.updateContact = async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        await contact.update(req.body);
        res.json(contact);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update contact' });
    }
};

exports.deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        await contact.destroy();
        res.json({ message: 'Contact deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete contact' });
    }
};