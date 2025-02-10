import { FilterInitialWord } from './gameUtils.js';
import { createInput, createRow, setRowText } from './Rows.js';
function setImage() {
    imageDisplay.src = imageInput.value;
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
    createDivsFromWords(words);
};
const imageInput = document.getElementById('image-url-input');
const imageDisplay = document.getElementById('image-large');
const startButton = document.getElementById('start-button');
const gameContainer = document.getElementById('game-container');
let currentWordIndex = 0;
const words = ["TREBUCHET", "ALCHEMY"];
startButton.addEventListener('click', setImage);
