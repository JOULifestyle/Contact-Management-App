const express = require('express');
const app = express();

// Root route to ensure server is handling routes correctly
app.get('/', (req, res) => {
    res.send('Basic route is working!');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});