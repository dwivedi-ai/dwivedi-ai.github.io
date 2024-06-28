const express = require('express');
const fs = require('fs');
const path = require('path');
const jsyaml = require('js-yaml');

const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Endpoint to fetch blog info
app.get('/blogsInfo', (req, res) => {
    const filePath = path.join(__dirname, '_blogs/blogInformation/blogsInfo.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Failed to load blogs info');
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint to fetch individual blog markdown files
app.get('/blogs/:filename', (req, res) => {
    const filePath = path.join(__dirname, '_blogs', req.params.filename);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(404).send('Blog not found');
            return;
        }
        res.send(data);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
