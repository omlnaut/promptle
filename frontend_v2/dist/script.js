"use strict";
function setImage() {
    imageDisplay.src = imageInput.value;
}
function createInput() {
    const input = document.createElement('input');
    input.maxLength = 1;
    // Input event listener
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
    });
    return input;
}
function createRow(length) {
    const rowDiv = document.createElement('div');
    for (let i = 0; i < length; i++) {
        rowDiv.appendChild(createInput());
    }
    gameContainer.appendChild(rowDiv);
    ;
}
function setRowText(row, text) {
    for (let i = 0; i < row.children.length; i++) {
        const child = row.children[i];
        const testWordLetter = text[i] === ' ' ? '' : text[i];
        child.value = testWordLetter;
    }
}
window.onload = function () {
    createRow(testWord.length);
    const currentRow = gameContainer.children[gameContainer.children.length - 1];
    setRowText(currentRow, testWord);
};
const imageInput = document.getElementById('image-url-input');
const imageDisplay = document.getElementById('image-large');
const startButton = document.getElementById('start-button');
const gameContainer = document.getElementById('game-container');
const testWord = "TRE   HET";
startButton.addEventListener('click', setImage);
