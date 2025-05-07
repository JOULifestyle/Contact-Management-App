const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Database connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'sqlite',
    storage: './database.sqlite',
});

// Models
const Contact = require('./models/Contact')(sequelize);

// Routes
const contactRoutes = require('./routes/contacts');
app.use('/api/contacts', contactRoutes);

// Sync the database
sequelize.sync().then(() => {
    console.log('Database synced');
}).catch((err) => {
    console.error('Database sync error:', err);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});