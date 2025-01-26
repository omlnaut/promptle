// Import configuration
import config from './config.js';

// script.js
// Test mode sentence
const testSentence = ["BLUE", "FLUFFY", "CAT", "SLEEPING", "PEACEFULLY"];

// Current sentence to guess
let sentenceToGuess = [];
let currentWordIndex = 0;
let currentGuessRow;
let gameOver = false;
let isTestMode = false;
let guessHistory = [];  // Array to store guess results for each word

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
                    const errorMessage = document.getElementById('guess-error');
                    errorMessage.textContent = 'Please fill in all the letters.';
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

    inputs[inputs.length - 1].value = word[word.length - 1];

    const firstLetter = word[0];
    for (let i = 0; i < inputs.length - 1; i++) {
        if (word[i] === firstLetter) {
            inputs[i].value = firstLetter;
        }
    }

    const lastLetter = word[word.length - 1];
    for (let i = 1; i < inputs.length - 1; i++) {
        if (word[i] === lastLetter) {
            inputs[i].value = lastLetter;
        }
    }

    inputs[1].focus();
}

// Function to check the user's guess for the current word
function checkGuess() {
    if (gameOver) return;

    const inputs = currentGuessRow.querySelectorAll('.letter-input');
    const userGuess = [];
    let wordArray = sentenceToGuess[currentWordIndex].split('');
    let guessArray = [];
    let currentWordGuesses = guessHistory[currentWordIndex] || [];

    // Collect user input
    inputs.forEach((input) => {
        userGuess.push(input.value.toUpperCase());
        guessArray.push(input.value.toUpperCase());
    });

    // Check for incomplete inputs
    if (userGuess.includes('')) {
        const errorMessage = document.getElementById('guess-error');
        errorMessage.textContent = 'Please fill in all the letters.';
        return;
    }

    // Array to store the result of this guess
    let guessResult = [];

    // Evaluate the guess
    // First pass: Correct letters in correct positions
    inputs.forEach((input, index) => {
        if (userGuess[index] === wordArray[index]) {
            updateLetterColor(input, 'correct');
            wordArray[index] = null;
            guessArray[index] = null;
            guessResult[index] = 'correct';
        }
    });

    // Second pass: Correct letters in wrong positions
    inputs.forEach((input, index) => {
        if (guessArray[index] && wordArray.includes(guessArray[index])) {
            updateLetterColor(input, 'present');
            wordArray[wordArray.indexOf(guessArray[index])] = null;
            guessArray[index] = null;
            guessResult[index] = 'present';
        } else if (input.style.backgroundColor !== 'rgb(26, 127, 55)') {  // If not green
            updateLetterColor(input, 'absent');
            guessResult[index] = 'absent';
        }

        // Disable the input
        input.disabled = true;
    });

    // Store this guess result
    currentWordGuesses.push(guessResult);
    guessHistory[currentWordIndex] = currentWordGuesses;

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
            // All words guessed - show summary
            displayGuessSummary();
            const successMessage = document.getElementById('success-message');
            successMessage.textContent = 'Congratulations! You guessed the entire sentence!';
            gameOver = true;
        }
    } else {
        // Allow the user to try again on the same word
        createGuessRow(currentWordIndex);
    }
}

// Function to update letter color
function updateLetterColor(input, status) {
    switch (status) {
        case 'correct':
            input.style.backgroundColor = '#1a7f37';  // Darker green
            break;
        case 'present':
            input.style.backgroundColor = '#d4a72c';  // Orange-yellow
            break;
        case 'absent':
            input.style.backgroundColor = '#666666';  // Gray
            break;
        default:
            input.style.backgroundColor = 'white';
    }
}

// Function to display the guess summary
function displayGuessSummary() {
    const summaryContainer = document.getElementById('guess-summary');
    summaryContainer.innerHTML = '';  // Clear existing content
    summaryContainer.style.display = 'block';  // Make visible

    // For each word
    guessHistory.forEach((wordGuesses, wordIndex) => {
        // For each guess of this word
        wordGuesses.forEach(guess => {
            const guessRow = document.createElement('div');
            guessRow.classList.add('summary-word');

            // Create colored boxes for each letter
            guess.forEach(result => {
                const letter = document.createElement('div');
                letter.classList.add('summary-letter', `summary-${result}`);
                guessRow.appendChild(letter);
            });

            summaryContainer.appendChild(guessRow);
        });

        // Add a small gap between words if not the last word
        if (wordIndex < guessHistory.length - 1) {
            const gap = document.createElement('div');
            gap.style.height = '10px';
            summaryContainer.appendChild(gap);
        }
    });
}

// Function to start the game
function startGame() {
    currentWordIndex = 0;
    gameOver = false;

    // Initialize with test sentence if in test mode
    if (isTestMode && sentenceToGuess.length === 0) {
        sentenceToGuess = [...testSentence];
    }

    // Only proceed if we have a sentence to guess
    if (sentenceToGuess.length > 0) {
        displaySentencePlaceholders();
        createGuessRow(currentWordIndex);
    }
}

// Function to set up image input handling (called only once at page load)
function setupImageInput() {
    const imageUrlInput = document.getElementById('image-url-input');
    const displayedImage = document.getElementById('displayed-image');
    const errorMessage = document.getElementById('image-error');

    // Remove any existing event listeners
    const newImageInput = imageUrlInput.cloneNode(true);
    imageUrlInput.parentNode.replaceChild(newImageInput, imageUrlInput);
    const newDisplayedImage = displayedImage.cloneNode(true);
    displayedImage.parentNode.replaceChild(newDisplayedImage, displayedImage);

    // Set up new event listeners
    newImageInput.addEventListener('input', function () {
        const url = newImageInput.value.trim();
        if (url) {
            newDisplayedImage.src = url;
        } else {
            newDisplayedImage.src = '';
            errorMessage.textContent = ''; // Clear error message when input is cleared
        }
    });

    newDisplayedImage.addEventListener('load', function () {
        if (!isTestMode && newDisplayedImage.src && !newDisplayedImage.src.endsWith('undefined')) {
            errorMessage.textContent = ''; // Clear error message on successful load
            // Only generate description if we don't already have one
            if (sentenceToGuess.length === 0) {
                getPromptFromImage(newDisplayedImage.src);
            }
        }
    });

    newDisplayedImage.addEventListener('error', function (e) {
        // Only show error if there was actually a URL attempted
        if (newDisplayedImage.src && !newDisplayedImage.src.endsWith('undefined')) {
            newDisplayedImage.src = '';
            errorMessage.textContent = 'Failed to load image. Please check the URL.';
        }
    });
}

// Function to reset the game
function resetGame() {
    // Clear the image and error message
    const displayedImage = document.getElementById('displayed-image');
    const errorMessage = document.getElementById('image-error');
    const guessSummary = document.getElementById('guess-summary');
    
    displayedImage.src = '';
    errorMessage.textContent = '';
    guessSummary.style.display = 'none';
    guessSummary.innerHTML = '';

    // Reset guess history
    guessHistory = [];

    // Clear the image URL input field
    const imageUrlInput = document.getElementById('image-url-input');
    imageUrlInput.value = '';

    // Clear the current sentence
    sentenceToGuess = [];

    // Initialize with test sentence if in test mode
    if (isTestMode) {
        sentenceToGuess = [...testSentence];
    }

    startGame();
}

// Function to handle mode toggle
function handleModeToggle() {
    const modeToggle = document.getElementById('mode-toggle');
    isTestMode = modeToggle.checked;
    resetGame();
}

// Function to get the sentence based on current mode
function getSentence(imageUrl) {
    if (isTestMode) {
        sentenceToGuess = [...testSentence];
        startGame();
    } else {
        getPromptFromImage(imageUrl);
    }
}

// Function to get prompt from image using Azure Function
async function getPromptFromImage(imageUrl) {
    console.log('Getting prompt from image...');
    
    try {
        const response = await fetch('http://localhost:7071/api/DescribeImage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageUrl })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.words && data.words.length > 0) {
            // Set the generated prompt as the sentence to guess
            sentenceToGuess.length = 0; // Clear previous sentence
            data.words.forEach(word => {
                sentenceToGuess.push(word);
            });
            console.log('Sentence to guess:', sentenceToGuess);
            startGame();
        } else {
            const errorMessage = document.getElementById('api-error');
            errorMessage.textContent = 'Error generating prompt from image.';
        }
    } catch (error) {
        console.error('Error getting prompt from image:', error);
        const errorMessage = document.getElementById('api-error');
        errorMessage.textContent = 'Error getting prompt from image.';
    }
}

// Initialize the game on page load
window.onload = function () {
    // Set initial mode from checkbox state
    const modeToggle = document.getElementById('mode-toggle');
    isTestMode = modeToggle.checked;
    
    // Initialize sentence if in test mode
    if (isTestMode) {
        sentenceToGuess = [...testSentence];
    }
    
    // Clear any existing image and error message
    const displayedImage = document.getElementById('displayed-image');
    const errorMessage = document.getElementById('image-error');
    displayedImage.src = '';
    errorMessage.textContent = '';
    
    // Set up image input handling (only once)
    setupImageInput();
    
    startGame();
};

// Event listeners
document.getElementById('check-button').addEventListener('click', checkGuess);
document.getElementById('reset-button').addEventListener('click', resetGame);
document.getElementById('mode-toggle').addEventListener('change', handleModeToggle);
