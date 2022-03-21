const prompt = require('prompt-sync')({ sigint: true });
const fs = require('fs');

let lettersToEliminate = prompt('Type all letters not used in the word: ').toLowerCase()
let knownLetters = prompt('Type all known letters of the word: ').toLowerCase()

let validLetterList = []
let badLetterList = []

const readFileLines = filename =>
    fs.readFileSync(filename)
        .toString('UTF8')
        .split('\n');

let masterWordList = readFileLines('./fiveLetterWords.txt');

function populateValidLetterArray(prompt) {
    for (let letter of prompt) {
        validLetterList.push(letter)
    }
}

function populateBadLetterArray(prompt) {
    for (let letter of prompt) {
        badLetterList.push(letter)
    }
}

populateBadLetterArray(lettersToEliminate)
populateValidLetterArray(knownLetters)

for (let letter of badLetterList) {
    masterWordList = masterWordList.filter(word => !word.includes(letter))
}

for (let letter of validLetterList) {
    masterWordList = masterWordList.filter(word => word.includes(letter))
}

console.log(masterWordList)

/*
Loop for getting known letters and locations
*/


/* 
End loop for getting known letters and location
*/

let Letter = function (myString, location) {
    this.myString = myString;
    this.isLetterInTheWord = false;
    this.location = location;
}

let Word = function (guessWord) {
    this.guessWord = guessWord;
    this.wordsArray = [];
    for (let letter of this.guessWord) {
        this.wordsArray.push(letter.replace(/[^A-Z]/ig, 'a'))
    }
    this.logIt = () => console.log(this.wordsArray)
}

/*
Pseudocode 
1. Ask for letters not in the word to help cut down on alphabet and letters needed there
    Will need a while loop to run until user says they are done
2. Ask for any known letters
    another while loop until user is done
3. For each known letter, ask for it's position in the word
    E.g. known letters are A, C, E. User will say A = 1, C = 3, E = 5
4. If a user does not know the location of a known letter, will need to ensure that letter is included at least once in the generated word(s)
5. Filter list down to only words containing known letters and letters in known location
 */
