// script.js

const wordList = ["APPLE", "BANJO", "CHIME", "DRIVE", "EAGLE"];
let wordToGuess;
let currentGuessRow;
let attemptCount = 0;
const maxAttempts = 6;

// Function to start a new game
function startGame() {
    wordToGuess = wordList[Math.floor(Math.random() * wordList.length)];
    attemptCount = 0;
    document.getElementById('check-button').disabled = false;
    updateAttemptsRemaining();

    // Clear previous game data
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '';

    // Create the first guess row
    createGuessRow();
}

// Function to create a new guess row
function createGuessRow() {
    const gameContainer = document.getElementById('game-container');

    const guessRow = document.createElement('div');
    guessRow.classList.add('guess-row');

    for (let i = 0; i < wordToGuess.length; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.classList.add('letter-input');

        input.addEventListener('input', function () {
            this.value = this.value.toUpperCase();
            if (!/^[A-Z]$/.test(this.value)) {
                this.value = '';
                return;
            }
            if (this.value && this.nextElementSibling) {
                this.nextElementSibling.focus();
            }
        });
        // Add event listeners for keydown events
        input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                checkGuess();
            } else if (event.key === 'Backspace') {
                this.value = '';
                if (this.previousElementSibling) {
                    this.previousElementSibling.focus();
                }
            }
        });

        guessRow.appendChild(input);
    }

    gameContainer.appendChild(guessRow);

    currentGuessRow = guessRow;

    const inputs = currentGuessRow.querySelectorAll('.letter-input');
    inputs[1].focus();
    inputs[0].value = wordToGuess.charAt(0);
    inputs[inputs.length - 1].value = wordToGuess.charAt(wordToGuess.length - 1);
}

// Function to update the attempts remaining display
function updateAttemptsRemaining() {
    const attemptsRemaining = maxAttempts - attemptCount;
    document.getElementById('attempts-remaining').textContent = `Attempts Remaining: ${attemptsRemaining}`;
}

// Function to check the user's guess
function checkGuess() {
    const inputs = currentGuessRow.querySelectorAll('.letter-input');
    const userGuess = [];
    let wordArray = wordToGuess.split('');

    inputs.forEach(input => {
        userGuess.push(input.value.toUpperCase());
    });

    if (userGuess.includes('')) {
        alert('Please fill in all the letters.');
        return;
    }

    inputs.forEach((input, index) => {
        const letter = userGuess[index];

        if (letter === wordToGuess[index]) {
            input.style.backgroundColor = 'green';
            wordArray[index] = null;
        } else if (wordArray.includes(letter)) {
            input.style.backgroundColor = 'yellow';
            wordArray[wordArray.indexOf(letter)] = null;
        } else {
            input.style.backgroundColor = 'red';
        }

        input.disabled = true;
    });

    attemptCount++;
    updateAttemptsRemaining();

    if (userGuess.join('') === wordToGuess) {
        alert(`Congratulations! You guessed the word "${wordToGuess}"!`);
        document.getElementById('check-button').disabled = true;
    } else if (attemptCount >= maxAttempts) {
        alert(`Game Over! The word was "${wordToGuess}".`);
        document.getElementById('check-button').disabled = true;
    } else {
        createGuessRow();
    }
}

// Function to reset the game
function resetGame() {
    startGame();
}

// Initialize the game on page load
window.onload = startGame;

// Event listeners
document.getElementById('check-button').addEventListener('click', checkGuess);
document.getElementById('reset-button').addEventListener('click', resetGame);
