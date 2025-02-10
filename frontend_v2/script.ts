import { FilterInitialWord } from './gameUtils.js';
import { createInput, createRow, setRowText } from './Rows.js';

function setImage() {
    imageDisplay.src = imageInput.value;
}




function getCurrentWord(): string {
    return words[currentWordIndex];
}

function increaseCurrentWordIndex() {
    currentWordIndex++;
}

function getCurrentWordIndex(): number {
    return currentWordIndex;
}




function createDivsFromWords(words: string[]) {
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

}

const imageInput = document.getElementById('image-url-input')! as HTMLInputElement;
const imageDisplay = document.getElementById('image-large')! as HTMLImageElement;
const startButton = document.getElementById('start-button')! as HTMLButtonElement;
const gameContainer = document.getElementById('game-container')! as HTMLDivElement;

let currentWordIndex = 0;
const words = ["TREBUCHET", "ALCHEMY"];

startButton.addEventListener('click', setImage);