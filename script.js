// script.js

const sentenceToGuess = ["HELLO", "WORLD", "HOW", "ARE", "YOU"];
let currentWordIndex = 0;
let currentGuessRow;
let gameOver = false;

// Function to display placeholders for each word
function displaySentencePlaceholders() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = ''; // Clear previous content

    sentenceToGuess.forEach((word) => {
        const wordContainer = document.createElement('div');
        wordContainer.classList.add('word-container');

        const wordPlaceholder = document.createElement('div');
        wordPlaceholder.classList.add('word-placeholder');

        // Generate the placeholder text
        const middlePart = '_'.repeat(word.length - 2);
        const placeholderText = word[0] + middlePart + word[word.length - 1];
        wordPlaceholder.textContent = placeholderText;

        wordContainer.appendChild(wordPlaceholder);

        // Append to the game container
        gameContainer.appendChild(wordContainer);
    });
}

// Function to create a new guess row for the current word
function createGuessRow(wordIndex) {
    const gameContainer = document.getElementById('game-container');
    const wordContainer = gameContainer.children[wordIndex];

    // Create a new guess row inside this word container
    const guessRow = document.createElement('div');
    guessRow.classList.add('guess-row');

    const word = sentenceToGuess[wordIndex];

    for (let i = 0; i < word.length; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.classList.add('letter-input');

        // Input event listener
        input.addEventListener('input', function () {
            this.value = this.value.toUpperCase();

            // Ensure only letters are entered
            if (!/^[A-Z]$/.test(this.value)) {
                this.value = '';
                return;
            }

            // Move focus to the next input
            if (this.value && this.nextElementSibling) {
                this.nextElementSibling.focus();
            }
        });

        // Enter key event listener
        input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                // Check if all inputs are filled
                const inputs = currentGuessRow.querySelectorAll('.letter-input');
                const allFilled = Array.from(inputs).every((input) => input.value !== '');
                if (allFilled) {
                    checkGuess();
                } else {
                    alert('Please fill in all the letters.');
                }
            }
            if (event.key === 'Backspace') {
                if (this.value) {
                    this.value = '';
                } else if (this.previousElementSibling) {
                    event.preventDefault();
                    this.previousElementSibling.focus();
                }
            }
        });

        guessRow.appendChild(input);
    }

    // Insert the guess row before the word placeholder
    wordContainer.insertBefore(guessRow, wordContainer.children[wordContainer.children.length - 1]);

    currentGuessRow = guessRow;

    // Focus on the first input
    const inputs = currentGuessRow.querySelectorAll('.letter-input');
    inputs[0].value = word[0];
    inputs[inputs.length - 1].value = word[word.length - 1];
    inputs[1].focus();

}

// Function to check the user's guess for the current word
function checkGuess() {
    if (gameOver) return;

    const inputs = currentGuessRow.querySelectorAll('.letter-input');
    const userGuess = [];
    let wordArray = sentenceToGuess[currentWordIndex].split('');
    let guessArray = [];

    // Collect user input
    inputs.forEach((input) => {
        userGuess.push(input.value.toUpperCase());
        guessArray.push(input.value.toUpperCase());
    });

    // Check for incomplete inputs
    if (userGuess.includes('')) {
        alert('Please fill in all the letters.');
        return;
    }

    // Evaluate the guess
    // First pass: Correct letters in correct positions
    inputs.forEach((input, index) => {
        if (userGuess[index] === wordArray[index]) {
            input.style.backgroundColor = 'green';
            wordArray[index] = null;
            guessArray[index] = null;
        }
    });

    // Second pass: Correct letters in wrong positions
    inputs.forEach((input, index) => {
        if (guessArray[index] && wordArray.includes(guessArray[index])) {
            input.style.backgroundColor = 'yellow';
            wordArray[wordArray.indexOf(guessArray[index])] = null;
            guessArray[index] = null;
        } else if (input.style.backgroundColor !== 'green') {
            input.style.backgroundColor = 'red';
        }

        // Disable the input
        input.disabled = true;
    });

    // Check if the word was guessed correctly
    if (userGuess.join('') === sentenceToGuess[currentWordIndex]) {
        // Update the word placeholder to show the full word
        const wordContainer = document.getElementById('game-container').children[currentWordIndex];
        const wordPlaceholder = wordContainer.querySelector('.word-placeholder');
        wordPlaceholder.textContent = sentenceToGuess[currentWordIndex];

        // Move to the next word
        currentWordIndex++;

        if (currentWordIndex < sentenceToGuess.length) {
            // Create a guess row for the next word
            createGuessRow(currentWordIndex);
        } else {
            // All words guessed
            alert('Congratulations! You guessed the entire sentence!');
            gameOver = true;
        }
    } else {
        // Allow the user to try again on the same word
        createGuessRow(currentWordIndex);
    }
}

// Function to start the game
function startGame() {
    currentWordIndex = 0;
    gameOver = false;

    displaySentencePlaceholders();
    createGuessRow(currentWordIndex);
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
