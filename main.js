const prompt = require('prompt-sync')({ sigint: true });
const fs = require('fs');

let validLetterArray = []
let badLetterSet = new Set()

const readFileLines = filename =>
    fs.readFileSync(filename)
        .toString('UTF8')
        .toUpperCase()
        .split('\n');

let masterWordList = readFileLines('./fiveLetterWords.txt');

function populateValidLetterArray(userInput) {
    for (let letter of userInput) {
        validLetterArray.push(letter)
    }
}

function populateBadLetterSet(userInput) {
    for (let letter of userInput) {
        badLetterSet.add(letter)
    }
}

while (masterWordList.length > 1) {

    if (badLetterSet.length > 0) {
        console.log(`Known bad letters: ${Array.from(badLetterSet).join()}`)
    }

    if (validLetterArray.length > 0) {
        console.log(`Known good letters: ${validLetterArray.join()}`)
    }

    let lettersToEliminate = prompt('Type all letters not used in the word: ').toUpperCase()
    let knownLetters = prompt('Type all known letters of the word: ').toUpperCase()

    populateBadLetterSet(lettersToEliminate)
    populateValidLetterArray(knownLetters)

    for (let letter of badLetterSet) {
        masterWordList = masterWordList.filter(word => !word.includes(letter))
    }

    // TODO: Ensure no more than 5 letters are entered
    // TODO: Ensure no valid letters match invalid letters
    for (let letter of validLetterArray) {
        masterWordList = masterWordList.filter(word => word.includes(letter))
    }


    for (let letter of validLetterArray) {
        let validLetterLocationPrompt = prompt(`If known, type the location of the letter ${letter}, else leave blank `, 6)
            .toString()
            .split('')
        for (let entry of validLetterLocationPrompt) {
            let validLetterLocation = parseInt(entry) - 1
            if (validLetterLocation <= 4) {
                masterWordList = masterWordList.filter(word => word[validLetterLocation] === letter)
                validLetterArray = validLetterArray.filter(arrayLetter => arrayLetter != letter)
            }
        }
    }

    // TODO: Allow user to enter multiple locations where letter does not belong
    for (let letter of validLetterArray) {
        let validLetterNonLocationPrompt = prompt(`Type the location(s) where ${letter} does not belong, else leave blank `, 6)
            .toString()
            .split('')
        for (let entry of validLetterNonLocationPrompt) {
            let validLetterNonLocation = parseInt(entry) - 1
            if (validLetterNonLocation <= 4) {
                masterWordList = masterWordList.filter(word => word[validLetterNonLocation] != letter)
            }
        }
    }

    if (masterWordList.length === 0) {
        console.log("Looks like that word isn't in this dictionary...yet")
        break
    }

    console.log(masterWordList)

    if (prompt('To start over with a new word, pres "N". Otherwise, press Enter ').toUpperCase() === 'N') {
        masterWordList = readFileLines('./fiveLetterWords.txt')
        validLetterArray = []
        badLetterSet.clear()
    }
}

switch(masterWordList.length) {
    case 0:
        console.log("Exiting program to update the dictionary")
        break
    case 1:
        console.log(`Your word is ${masterWordList[0]}`)
        break
    default:
        console.log(`Your possible words are ${masterWordList}`)
}
