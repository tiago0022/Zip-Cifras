const express = require('express');
const { run, client } = require('./db');
const songsRouter = require('./routes/songs'); // Import the songs router

const app = express();
const port = 3000;

app.use('/songs', songsRouter);

run().then(() => {

    app.get('/', (req, res) => {
        console.log(req)
        res.send('Succesfully connected to backend\n');
    });

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });

}).catch(err => {
    console.error('Failed to connect to the database', err);
});

