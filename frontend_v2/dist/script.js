import { compareWords, CreateGuessStarter, FilterInitialWord, LetterState } from './gameUtils.js';
function setImage() {
    imageDisplay.src = imageInput.value;
}
function getCurrentRow() {
    const currentRow = gameContainer.firstElementChild;
    return currentRow;
}
function createInput() {
    const input = document.createElement('input');
    input.classList.add('letter-input');
    input.maxLength = 1;
    // Event listener
    input.addEventListener('input', function () {
        this.value = this.value.toUpperCase();
        // Move focus to the next input
        if (this.value && this.nextElementSibling instanceof HTMLInputElement) {
            this.nextElementSibling.focus();
        }
    });
    input.addEventListener('keydown', function (event) {
        if (event.key === 'Backspace') {
            if (this.value) {
                this.value = '';
            }
            else if (this.previousElementSibling instanceof HTMLInputElement) {
                event.preventDefault();
                this.previousElementSibling.focus();
            }
        }
        else if (event.key === 'Enter') {
            const currentRow = getCurrentRow();
            const values = Array.from(currentRow.children).map(input => input.value);
            const text = values.join('');
            if (text.length !== testWord.length) {
                return;
            }
            console.log(text);
            const result = compareWords(text, testWord);
            console.log(result);
            for (let i = 0; i < result.length; i++) {
                const child = currentRow.children[i];
                if (result[i] === LetterState.Correct) {
                    child.classList.add('correct');
                }
                else if (result[i] === LetterState.Present) {
                    child.classList.add('present');
                }
                else {
                    child.classList.add('absent');
                }
            }
            createRow(testWord.length);
            const GuessStarter = CreateGuessStarter(text, testWord);
            const newRow = getCurrentRow();
            setRowText(newRow, GuessStarter);
            setFocusToFirstEmtpyInput(newRow);
        }
    });
    return input;
}
function createRow(length) {
    const rowDiv = document.createElement('div');
    for (let i = 0; i < length; i++) {
        rowDiv.appendChild(createInput());
    }
    gameContainer.insertBefore(rowDiv, gameContainer.firstChild);
    ;
}
function setRowText(row, text) {
    for (let i = 0; i < row.children.length; i++) {
        const child = row.children[i];
        const testWordLetter = text[i] === ' ' ? '' : text[i];
        child.value = testWordLetter;
    }
}
function setFocusToFirstEmtpyInput(row) {
    for (let i = 0; i < row.children.length; i++) {
        const child = row.children[i];
        console.log(child.value);
        if (!child.value) {
            child.focus();
            break;
        }
    }
}
window.onload = function () {
    createRow(testWord.length);
    const currentRow = getCurrentRow();
    const filteredWord = FilterInitialWord(testWord);
    setRowText(currentRow, filteredWord);
    setFocusToFirstEmtpyInput(currentRow);
};
const imageInput = document.getElementById('image-url-input');
const imageDisplay = document.getElementById('image-large');
const startButton = document.getElementById('start-button');
const gameContainer = document.getElementById('game-container');
const testWord = "TREBUCHET";
startButton.addEventListener('click', setImage);
