const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const dataFilePath = path.join(__dirname, 'data', 'data_10kb.json');

app.get('/get_cart', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const jsonData = JSON.parse(data);
        return res.json(jsonData);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});