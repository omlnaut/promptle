"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gameUtils_1 = require("./gameUtils");
function setImage() {
    imageDisplay.src = imageInput.value;
}
function getCurrentRow() {
    var currentRow = gameContainer.lastElementChild;
    return currentRow;
}
function createInput() {
    var input = document.createElement('input');
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
        console.log('why');
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
            console.log('Enter key pressed');
            var currentRow = getCurrentRow();
            var values = Array.from(currentRow.children).map(function (input) { return input.value; });
            var text = values.join('');
            var result = (0, gameUtils_1.compareWords)(text, testWord);
            console.log(result);
        }
    });
    return input;
}
function createRow(length) {
    var rowDiv = document.createElement('div');
    for (var i = 0; i < length; i++) {
        rowDiv.appendChild(createInput());
    }
    gameContainer.appendChild(rowDiv);
    ;
}
function setRowText(row, text) {
    for (var i = 0; i < row.children.length; i++) {
        var child = row.children[i];
        var testWordLetter = text[i] === ' ' ? '' : text[i];
        child.value = testWordLetter;
    }
}
window.onload = function () {
    createRow(testWord.length);
    var currentRow = gameContainer.children[gameContainer.children.length - 1];
    setRowText(currentRow, testWord);
};
var imageInput = document.getElementById('image-url-input');
var imageDisplay = document.getElementById('image-large');
var startButton = document.getElementById('start-button');
var gameContainer = document.getElementById('game-container');
var testWord = "TRE   HET";
startButton.addEventListener('click', setImage);
