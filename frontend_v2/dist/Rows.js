import { compareWords, CreateGuessStarter, LetterState } from "./gameUtils.js";
export function getCurrentRow(gameContainer, currentWordIndex) {
    const currentRowContainer = getCurrentRowContainer(gameContainer, currentWordIndex);
    const currentRow = currentRowContainer.firstElementChild;
    return currentRow;
}
export function getCurrentRowContainer(gameContainer, currentWordIndex) {
    return gameContainer.children[currentWordIndex];
}
export function setRowText(row, text) {
    for (let i = 0; i < row.children.length; i++) {
        const child = row.children[i];
        const testWordLetter = text[i] === ' ' ? '' : text[i];
        child.value = testWordLetter;
    }
}
export function setFocusToFirstEmtpyInput(row) {
    for (let i = 0; i < row.children.length; i++) {
        const child = row.children[i];
        console.log("Input value: " + child.value);
        if (!child.value) {
            child.focus();
            break;
        }
    }
}
export function createInput(getCurrentWord, increaseCurrentWordIndexCallback, getCurrentWordIndex, gameContainer, maxWords) {
    const input = document.createElement('input');
    input.classList.add('letter-input');
    input.maxLength = 1;
    // Event listener
    input.addEventListener('input', handleInput);
    input.addEventListener('keydown', function (event) {
        handleKeydown.call(this, event, getCurrentWordIndex, getCurrentWord, increaseCurrentWordIndexCallback, gameContainer, maxWords);
    });
    return input;
}
function handleInput() {
    this.value = this.value.toUpperCase();
    // Move focus to the next input
    if (this.value && this.nextElementSibling instanceof HTMLInputElement) {
        this.nextElementSibling.focus();
    }
}
function handleKeydown(event, getCurrentWordIndex, getCurrentWord, increaseCurrentWordIndexCallback, gameContainer, maxWords) {
    if (event.key === 'Backspace') {
        handleBackspace.call(this, event);
    }
    else if (event.key === 'Enter') {
        handleEnter.call(this, getCurrentWordIndex, getCurrentWord, increaseCurrentWordIndexCallback, gameContainer, maxWords);
    }
}
function handleEnter(getCurrentWordIndex, getCurrentWord, increaseCurrentWordIndexCallback, gameContainer, maxWords) {
    const currentWord = getCurrentWord();
    const currentRow = getCurrentRow(gameContainer, getCurrentWordIndex());
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
        if (getCurrentWordIndex() === maxWords - 1) {
            alert('You win!');
        }
        increaseCurrentWordIndexCallback();
        const currentRow = getCurrentRow(gameContainer, getCurrentWordIndex());
        setFocusToFirstEmtpyInput(currentRow);
        return;
    }
    const newInputs = Array.from({ length: currentWord.length }, () => createInput(getCurrentWord, increaseCurrentWordIndexCallback, getCurrentWordIndex, gameContainer, maxWords));
    const newRow = createRow(newInputs);
    const GuessStarter = CreateGuessStarter(text, currentWord);
    setRowText(newRow, GuessStarter);
    const currentRowContainer = getCurrentRowContainer(gameContainer, getCurrentWordIndex());
    currentRowContainer.insertBefore(newRow, currentRowContainer.firstChild);
    setFocusToFirstEmtpyInput(newRow);
}
function handleBackspace(event) {
    if (this.value) {
        this.value = '';
    }
    else if (this.previousElementSibling instanceof HTMLInputElement) {
        event.preventDefault();
        this.previousElementSibling.focus();
    }
}
export function createRow(inputs) {
    const rowDiv = document.createElement('div');
    for (let i = 0; i < inputs.length; i++) {
        rowDiv.appendChild(inputs[i]);
    }
    return rowDiv;
}
