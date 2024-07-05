const express = require('express');
const { getDatabase } = require('../db');
const bodyParser = require('body-parser');

const router = express.Router();
const jsonParser = bodyParser.json()

const database = getDatabase();
const songsCollection = database.collection('songs');

const { processSongString } = require('../services/songService');

router.get('/:songName', async (req, res) => {
    try {
        const songName = req.params.songName;
        const songData = await songsCollection.findOne({ name: songName });
        if (songData) {
            res.json(songData);
        } else {
            res.status(404).json({ message: "Song not found" });
        }
    } catch (err) {
        console.error("Error retrieving song data", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/as-text', jsonParser, async (req, res) => {
    try {

        const songString = req.body.song;
        if (!songString) {
            return res.status(400).send('Song string is required');
        }

        // Use the service to process the song string
        const structuredData = await processSongString(songString);

        res.status(200).json(structuredData);
    } catch (err) {
        console.error('Error processing song string:', err);
        res.status(500).send('Internal Server Error');
    }

});


module.exports = router;
