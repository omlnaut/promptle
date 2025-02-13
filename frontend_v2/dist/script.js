import { FilterInitialWord } from './gameUtils.js';
import { createInput, createRow, setRowText } from './Rows.js';
import { describeImage } from './description.js';
async function setImage() {
    // Clear previous game state
    gameContainer.innerHTML = '';
    currentWordIndex = 0;
    words = [];
    // Set image and wait for description
    imageDisplay.src = imageInput.value;
    try {
        const response = await describeImage(imageInput.value);
        console.log('Description received:', response);
        // Extract words array from response object
        const description = response.words;
        if (Array.isArray(description)) {
            setWords(description);
            createDivsFromWords(words);
        }
        else {
            console.error('Invalid response format - words property is not an array:', response);
        }
    }
    catch (error) {
        console.error('Error getting image description:', error);
    }
}
function getCurrentWord() {
    return words[currentWordIndex];
}
function increaseCurrentWordIndex() {
    currentWordIndex++;
}
function getCurrentWordIndex() {
    return currentWordIndex;
}
function setWords(newWords) {
    words = newWords;
}
function createDivsFromWords(words) {
    words.forEach(word => {
        const wordDiv = document.createElement('div');
        wordDiv.classList.add('wordGuessContainer');
        const newInputs = Array.from({ length: word.length }, () => createInput(getCurrentWord, increaseCurrentWordIndex, getCurrentWordIndex, gameContainer, words.length));
        const newRow = createRow(newInputs);
        setRowText(newRow, FilterInitialWord(word));
        wordDiv.appendChild(newRow);
        gameContainer.appendChild(wordDiv);
    });
}
window.onload = function () {
    startButton.addEventListener('click', setImage);
    // createDivsFromWords(words);
};
const imageInput = document.getElementById('image-url-input');
const imageDisplay = document.getElementById('image-large');
const startButton = document.getElementById('start-button');
const gameContainer = document.getElementById('game-container');
let currentWordIndex = 0;
let words = [];
startButton.addEventListener('click', setImage);
