const express = require('express');
const app = express();

app.use(express.json());

// Test route to ensure server is handling routes correctly
app.get('/test', (req, res) => {
    res.send('Test route is working!');
});

// Root route to ensure server is handling routes correctly
app.get('/', (req, res) => {
    res.send('Root route is working!');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});