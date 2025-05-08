const fs = require('fs');
const path = require('path');

const generateContactAPI = () => {
    const backendPath = path.join(__dirname, '../backend');

    // Create app.js
    const appContent = `
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./models');
const contactRoutes = require('./routes/contacts');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/contacts', contactRoutes);

// Sync the database
sequelize.sync().then(() => {
    console.log('Database synced');
}).catch((err) => {
    console.error('Database sync error:', err);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(\`Server is running on port \${PORT}\`);
});
`;
    fs.writeFileSync(path.join(backendPath, 'app.js'), appContent);

    // Create models/Contact.js
    const modelContent = `
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Contact extends Model {}

Contact.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Contact'
});

module.exports = Contact;
`;
    fs.writeFileSync(path.join(backendPath, 'models', 'Contact.js'), modelContent);

    // Create routes/contacts.js
    const routesContent = `
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactsController');

router.get('/', contactController.getAllContacts);
router.post('/', contactController.createContact);
router.get('/:id', contactController.getContactById);
router.put('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

module.exports = router;
`;
    fs.writeFileSync(path.join(backendPath, 'routes', 'contacts.js'), routesContent);

    // Create controllers/contactsController.js
    const controllerContent = `
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
`;
    fs.writeFileSync(path.join(backendPath, 'controllers', 'contactsController.js'), controllerContent);

    // Create config/database.js
    const configContent = `
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:', {
    logging: false
});

module.exports = sequelize;
`;
    fs.writeFileSync(path.join(backendPath, 'config', 'database.js'), configContent);

    console.log('Contact API generated successfully');
};

module.exports = generateContactAPI;