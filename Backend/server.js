const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS package
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

const DATA_FILE_PATH = path.join(__dirname, 'data.json');

// Load JSON data from the file
const loadData = () => {
    if (!fs.existsSync(DATA_FILE_PATH)) {
        fs.writeFileSync(DATA_FILE_PATH, '[]');
    }
    return JSON.parse(fs.readFileSync(DATA_FILE_PATH, 'utf8'));
};

// Save JSON data to the file
const saveData = (data) => {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
};

// API to save name and hash
app.post('/api/save', (req, res) => {
    const { name, hash } = req.body;
    const data = loadData();
    data.push({ name, hash });
    saveData(data);
    res.json({ message: 'Saved successfully!' });
});

// API to check name or hash
app.post('/api/check', (req, res) => {
    const { input } = req.body;
    const data = loadData();
    const match = data.find(item => item.name === input || item.hash === input);
    if (match) {
        res.json({ message: `Match found: Name = ${match.name}, Hash = ${match.hash}` });
    } else {
        res.json({ message: 'No match found.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
