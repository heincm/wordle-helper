const prompt = require('prompt-sync')({ sigint: true });
const fs = require('fs');

let lettersToEliminate = prompt('Type all letters not used in the word: ').toLowerCase()
let knownLetters = prompt('Type all known letters of the word: ').toLowerCase()

let validLetterList = []
let badLetterList = new Set()

const readFileLines = filename =>
    fs.readFileSync(filename)
        .toString('UTF8')
        .split('\n');

let masterWordList = readFileLines('./fiveLetterWords.txt');

function populateValidLetterArray(userInput) {
    for (let letter of userInput) {
        validLetterList.push(letter)
    }
}

function populateBadLetterArray(userInput) {
    for (let letter of userInput) {
        badLetterList.add(letter)
    }
}

populateBadLetterArray(lettersToEliminate)
populateValidLetterArray(knownLetters)

for (let letter of badLetterList) {
    masterWordList = masterWordList.filter(word => !word.includes(letter))
}

// TODO: Ensure no more than 5 letters are entered
// TODO: Ensure no valid letters match invalid letters
for (let letter of validLetterList) {
    masterWordList = masterWordList.filter(word => word.includes(letter))
}

// TODO: Account for duplicate letters
//  - Arguably, a user can submit the same letter twice above. Need to think on best implementation
for (let letter of validLetterList) {
    let validLetterLocationPrompt = [prompt(`If known, type the location of the letter ${letter}, else leave blank `, 6)]
    let validLetterLocation = parseInt(validLetterLocationPrompt) - 1
    if (validLetterLocation <= 4) {
        masterWordList = masterWordList.filter(word => word[validLetterLocation] === letter)
        validLetterList = validLetterList.filter(arrayLetter => arrayLetter != letter)
    }
}

// TODO: Allow user to enter multiple locations where letter does not belong
for (let letter of validLetterList) {
    let validLetterNonLocationPrompt = [prompt(`Type the location where ${letter} does not belong, else leave blank `, 6)]
    for (let entry of validLetterNonLocationPrompt) {
        let validLetterNonLocation = parseInt(entry) - 1
        if (validLetterNonLocation <= 4) {
            masterWordList = masterWordList.filter(word => word[validLetterNonLocation] != letter)
        }
    }
}

console.log(masterWordList)
