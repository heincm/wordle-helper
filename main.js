const axios = require('axios')
const prompt = require('prompt-sync')({sigint: true});
const baseUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en'

let userInput = prompt('Type a 5 letter word: ').toLowerCase()
let lettersToEliminate = prompt('Type all letters not used in the word: ').toLowerCase()

let alphabet = [...'abcdefghijklmnopqrstuvwxyz'];

let params = userInput
let url = `${baseUrl}/${params}`

function eliminateLetters(prompt) {
    for (let alpha of prompt) {
        alphabet = alphabet.filter(letter => filterLetters(letter, alpha))
    }
}

function filterLetters(letter, notLetter) {
    if (letter != notLetter){
        return letter
    }
}

eliminateLetters(lettersToEliminate)
console.log(alphabet)

/*
Loop for getting known letters and locations
*/

let knownLetters = prompt('Type all known letters of the word: ').toLowerCase()

/* 
End loop for getting known letters and location
*/

callDictinonaryApi()

async function callDictinonaryApi(){
    const res = await Promise.all([axios.get(url)
    .then(response => console.log(responseOrNull(response)))
    .catch(err => console.log(`ERROR!: ${err}`)), 
    axios.get(`${url}es`).then(response => console.log(responseOrNull(response)))
    .catch(err => console.log(`ERROR!: ${err}`))])

    return res
}


function responseOrNull(response){
    if (response.status === 200 && response.data) {
        return `${response.data[0].word} is in the dictionary!`
    }
    return "Something isn't right"
}


let Letter = function(myString, location) {
    this.myString = myString;
    this.isLetterInTheWord = false;
    this.location = location;
}

let Word = function(guessWord) {
    this.guessWord = guessWord;
    this.wordsArray = [];
    for (let letter of this.guessWord) {
        this.wordsArray.push(letter.replace(/[^A-Z]/ig, 'a'))
    }
    this.logIt = () => console.log(this.wordsArray)
}

let myWord = new Word(userInput)

myWord.logIt()

// alphabet = alphabet.filter(letter => filterLetters(letter, 'z'))


// console.log(alphabet)

/*
Pseudocode 
1. Ask for letters not in the word to help cut down on alphabet and letters needed there
    Will need a while loop to run until user says they are done
2. Ask for any known letters
    another while loop until user is done
3. For each known letter, ask for it's position in the word
    E.g. known letters are A, C, E. User will say A = 1, C = 3, E = 5
4. If a user does not know the location of a known letter, will need to ensure that letter is included at least once in the generated word(s)
5. Find a way to cycle through all word permutations with every remaining letter of the alphabet
 */