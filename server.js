const express = require('express');
const jsPDF = require('jspdf');

const app = express();
const PORT = 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define the directory where the views are located
app.set('views', 'views'); // Optional, as 'views' is the default directory

// Basic routing
app.get('/', (req, res) => {
    res.render('index'); // No need to specify 'views/' here
});

// Start the server
app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}, You better go catch it!`);
});