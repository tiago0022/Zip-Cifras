const express = require('express');
const { getDatabase } = require('../db');

const router = express.Router();

const database = getDatabase();
const songsCollection = database.collection('songs');

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


module.exports = router;
