import { compareWords, CreateGuessStarter, FilterInitialWord, LetterState } from './gameUtils.js';
function setImage() {
    imageDisplay.src = imageInput.value;
}
function getCurrentRow() {
    const currentRowContainer = getCurrentRowContainer();
    const currentRow = currentRowContainer.firstElementChild;
    return currentRow;
}
function getCurrentRowContainer() {
    return gameContainer.children[currentWordIndex];
}
function getCurrentWord() {
    return words[currentWordIndex];
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
            const currentWord = getCurrentWord();
            const currentRow = getCurrentRow();
            const values = Array.from(currentRow.children).map(input => input.value);
            const text = values.join('');
            if (text.length !== currentWord.length) {
                return;
            }
            console.log(text);
            const result = compareWords(text, currentWord);
            console.log(result);
            let guessCorrect = true;
            for (let i = 0; i < result.length; i++) {
                const child = currentRow.children[i];
                if (result[i] === LetterState.Correct) {
                    child.classList.add('correct');
                }
                else if (result[i] === LetterState.Present) {
                    guessCorrect = false;
                    child.classList.add('present');
                }
                else {
                    guessCorrect = false;
                    child.classList.add('absent');
                }
            }
            if (guessCorrect) {
                if (currentWordIndex === words.length - 1) {
                    alert('You win!');
                }
                currentWordIndex++;
                const currentRow = getCurrentRow();
                setFocusToFirstEmtpyInput(currentRow);
                return;
            }
            const newRow = createRow(currentWord.length);
            const GuessStarter = CreateGuessStarter(text, currentWord);
            setRowText(newRow, GuessStarter);
            const currentRowContainer = getCurrentRowContainer();
            currentRowContainer.insertBefore(newRow, currentRowContainer.firstChild);
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
    return rowDiv;
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
        console.log("Input value: " + child.value);
        if (!child.value) {
            child.focus();
            break;
        }
    }
}
function createDivsFromWords(words) {
    words.forEach(word => {
        const wordDiv = document.createElement('div');
        wordDiv.classList.add('wordGuessContainer');
        const newRow = createRow(word.length);
        setRowText(newRow, FilterInitialWord(word));
        wordDiv.appendChild(newRow);
        gameContainer.appendChild(wordDiv);
    });
}
window.onload = function () {
    createDivsFromWords(words);
    // createRow(testWord.length);
    // const currentRow = getCurrentRow();
    // const filteredWord = FilterInitialWord(testWord);
    // setRowText(currentRow, filteredWord);
    // setFocusToFirstEmtpyInput(currentRow);
};
const imageInput = document.getElementById('image-url-input');
const imageDisplay = document.getElementById('image-large');
const startButton = document.getElementById('start-button');
const gameContainer = document.getElementById('game-container');
let currentWordIndex = 0;
const words = ["TREBUCHET", "ALCHEMY"];
startButton.addEventListener('click', setImage);
