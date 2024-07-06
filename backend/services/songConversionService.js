const { getDatabase } = require('../db');

const database = getDatabase();
const notesCollection = database.collection('base_note');

const notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

const openingCipherTokenChars = ['(', '[', ...notes];
const closingCipherTokenChars = [')', ']', '|', '~'];
const cipherDecorators = ['/', ...openingCipherTokenChars, closingCipherTokenChars];

const sharpChar = '#';
const flatChar = 'b';
const accidentChars = [sharpChar, flatChar];

async function convertStringToSongData(songString) {

    // TODO: validations and error handling

    console.log("Converting the following song string to structured data...");
    console.log(songString);

    const { songName, remaining } = extractAndConsumeSongName(songString);

    const lines = remaining.split('\n').map(line => line.trim()); // TODO count tabs to make song-text conversion easier?
    const sections = [];
    let accidentIsSharp;

    for (let line of lines) {
        let { section, lineAccidentIsSharp } = await convertLineStringToSectionData(line);
        if (lineAccidentIsSharp != null) {
            accidentIsSharp = lineAccidentIsSharp;
        }
        sections.push(section);
    }

    const structuredData = {
        name: songName,
        accidentIsSharp,
        sections
    };

    return structuredData;
}

function extractAndConsumeSongName(inputString) {

    const regex = /^(.*)\s-\s/;
    const match = regex.exec(inputString);

    if (match?.length) {
        const songName = match[1];
        const remaining = inputString.replace(regex, '');
        return { songName, remaining };
    } else {
        throw new Error('Failed to extract song name');
    }
}

async function convertLineStringToSectionData(line) {

    let remaining = line;

    let lineAccidentIsSharp;
    let sectionName;
    const cipherTokens = [];

    if (!openingCipherTokenChars.includes(line[0])) {
        ({ sectionName, remaining } = extractAndConsumeSectionName(line));
    }

    while (remaining.length) {
        let cipherToken;
        let cipherTokenIsSharp;
        ({ cipherToken, remaining, cipherTokenIsSharp } = await extractAndConsumeCipherToken(remaining));
        cipherTokens.push(cipherToken);
        if (cipherTokenIsSharp != null) {
            lineAccidentIsSharp = cipherTokenIsSharp;
        }
    }

    section = {
        sectionName,
        cipherTokens
    }

    return { section, lineAccidentIsSharp };
}

function extractAndConsumeSectionName(inputString) {

    const regex = /^(.*):\s/;
    const match = regex.exec(inputString);

    if (match?.length) {
        const sectionName = match[1];
        const remaining = inputString.replace(regex, '');
        return { sectionName, remaining };
    } else {
        throw new Error('Failed to extract section name');
    }
}

async function extractAndConsumeCipherToken(inputString) {

    let tokenData;

    if (notes.includes(inputString[0])) {
        tokenData = await extractAndConsumeChord(inputString);
    } else if (cipherDecorators.includes(inputString[0])) {
        tokenData = extractAndConsumeCipherDecorator(inputString);
    } else {
        tokenData = extractAndConsumeGenericCipherDecorator(inputString);
    }

    // console.log(tokenData)

    return tokenData;
}

async function extractAndConsumeChord(inputString) {

    // TODO: find the associated chord entry if it is in the DB

    let { baseNote, baseNoteId, remaining, cipherTokenIsSharp } = await extractAndConsumeBaseNote(inputString);

    let chordDecorator;
    ({ chordDecorator, remaining } = extractAndConsumeChordDecorator(remaining));

    const cipherToken = {
        content: baseNote.concat(chordDecorator),
        baseNoteId,
        chordDecorator: chordDecorator || undefined
    }

    return { cipherToken, remaining, cipherTokenIsSharp }

}

async function extractAndConsumeBaseNote(inputString) {

    let baseNote = inputString[0];
    let remaining = inputString.substring(1);
    let cipherTokenIsSharp;

    if (accidentChars.includes(remaining[0])) {

        const accidentChar = remaining[0];
        cipherTokenIsSharp = (accidentChar == sharpChar);

        baseNote = baseNote.concat(accidentChar);
        remaining = remaining.substring(1);
    }

    const baseNoteEntity = await notesCollection.findOne({
        $or: [
            { symbolSharp: baseNote },
            { symbolFlat: baseNote }
        ]
    });

    return { baseNote, baseNoteId: baseNoteEntity._id, remaining, cipherTokenIsSharp };
}

function extractAndConsumeCipherDecorator(inputString) {
    // TODO: this function will associate the known decorator with its entry on the DB.
    return extractAndConsumeGenericCipherDecorator(inputString);
}

function extractAndConsumeGenericCipherDecorator(inputString) {
    let cipherDecorator = '';
    while (inputString?.length) {

        if (notes.includes(inputString[0])) {
            break;
        }

        if (inputString[0] == ' ') {
            inputString = inputString.substring(1);
            break;
        }

        cipherDecorator = cipherDecorator.concat(inputString[0]);
        inputString = inputString.substring(1);

    }

    const cipherToken = {
        content: cipherDecorator,
    }

    return { cipherToken, remaining: inputString }
}

function extractAndConsumeChordDecorator(inputString) {
    let chordDecorator = '';
    while (inputString?.length) {

        if (closingCipherTokenChars.includes(inputString[0])) {
            break;
        }

        if (inputString[0] == ' ') {
            inputString = inputString.substring(1);
            break;
        }

        chordDecorator = chordDecorator.concat(inputString[0]);
        inputString = inputString.substring(1);

    }
    return { chordDecorator, remaining: inputString };
}

module.exports = {
    convertStringToSongData: convertStringToSongData
};