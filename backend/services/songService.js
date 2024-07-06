
const { getDatabase } = require('../db');
const database = getDatabase();
const songsCollection = database.collection('songs');

const { convertStringToSongData } = require('./songConversionService');

async function processSongString(songString) {

    const structuredData = await convertStringToSongData(songString);

    try {

        const existingSong = await songsCollection.findOne({ name: structuredData.name });

        if (existingSong) {
            await songsCollection.updateOne({ name: structuredData.name }, { $set: structuredData }); // TODO: make case insensitive
            console.log(`Updated song: ${structuredData.name}`);
        } else {
            await songsCollection.insertOne(structuredData);
            console.log(`Inserted new song: ${structuredData.name}`);
        }
    } catch (err) {
        console.error('Error saving or updating song:', err);
        throw new Error('Database operation failed');
    }

    return structuredData;
}

module.exports = {
    processSongString
};