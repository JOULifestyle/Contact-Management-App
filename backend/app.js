const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Contact = require('./models/Contact');
const contactRoutes = require('./routes/contacts');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/contacts', contactRoutes);

// Define a root route
app.get('/', (req, res) => {
    res.send('Welcome to the Contact Management System API');
});

// Sync the database
Contact.sync().then(() => {
    console.log('Database synced');
}).catch((err) => {
    console.error('Database sync error:', err);
});

// Start the server
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});