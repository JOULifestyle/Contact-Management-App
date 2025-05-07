const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Get all contacts
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.findAll();
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single contact
router.get('/:id', async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);
        if (contact) {
            res.json(contact);
        } else {
            res.status(404).json({ message: 'Contact not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new contact
router.post('/', async (req, res) => {
    try {
        const newContact = await Contact.create(req.body);
        res.status(201).json(newContact);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a contact
router.put('/:id', async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);
        if (contact) {
            await contact.update(req.body);
            res.json(contact);
        } else {
            res.status(404).json({ message: 'Contact not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a contact
router.delete('/:id', async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);
        if (contact) {
            await contact.destroy();
            res.json({ message: 'Contact deleted' });
        } else {
            res.status(404).json({ message: 'Contact not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;