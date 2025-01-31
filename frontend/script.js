// script.js
// Test mode sentence
// const testSentence = ["BLUE", "FLUFFY", "CAT", "SLEEPING", "PEACEFULLY"];

// Current sentence to guess
let sentenceToGuess = [];
let currentWordIndex = 0;
let currentGuessRow;
let gameOver = false;
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
        } else if (input.classList.contains('correct') === false) {  // If not green
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
            gameOver = true;
        }
    } else {
        // Allow the user to try again on the same word
        createGuessRow(currentWordIndex);
    }
}

// Function to update letter color
function updateLetterColor(input, status) {
    // Remove any existing status classes
    input.classList.remove('correct', 'present', 'absent');
    // Add the new status class
    input.classList.add(status);
}

// Function to display the guess summary
function displayGuessSummary() {
    document.body.classList.add('game-over');
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
                letter.classList.add('summary-letter', result);
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

// Function to handle image load and set orientation
function handleImageLoad() {
    const image = document.getElementById('displayed-image');
    const container = document.getElementById('image-container');
    
    // Reset classes
    container.classList.remove('vertical', 'horizontal');
    
    // Compare aspect ratio
    if (image.naturalHeight > image.naturalWidth) {
        container.classList.add('vertical');
    } else {
        container.classList.add('horizontal');
    }
}

// Function to start the game
function startGame() {
    currentWordIndex = 0;
    gameOver = false;

    // Only proceed if we have a sentence to guess
    if (sentenceToGuess.length > 0) {
        document.body.classList.add('game-active');
        document.body.classList.remove('game-over');
        
        // Set up image load handler
        const image = document.getElementById('displayed-image');
        image.addEventListener('load', handleImageLoad);
        
        displaySentencePlaceholders();
        createGuessRow(currentWordIndex);
    }
}

// Function to reset the game
function resetGame() {
    document.body.classList.remove('game-active', 'game-over');
    const image = document.getElementById('displayed-image');
    image.removeEventListener('load', handleImageLoad);
    const container = document.getElementById('image-container');
    container.classList.remove('vertical', 'horizontal');
    currentWordIndex = 0;
    gameOver = false;
    sentenceToGuess = [];
    guessHistory = [];

    // Clear the image
    image.src = '';
    image.style.display = 'none';

    // Clear the game container
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '';

    // Clear the guess summary
    const guessSummary = document.getElementById('guess-summary');
    guessSummary.innerHTML = '';

    // Clear any error messages
    document.getElementById('image-error').textContent = '';
    document.getElementById('api-error').textContent = '';
    document.getElementById('guess-error').textContent = '';

    // Clear and enable the image URL input
    const imageUrlInput = document.getElementById('image-url-input');
    imageUrlInput.value = '';
    imageUrlInput.disabled = false;
}

// Function to get the sentence based on current mode
async function getSentence(imageUrl) {
    await getPromptFromImage(imageUrl);
}

// Function to get the backend URL based on environment
function getBackendUrl() {
    // Check if we're running locally
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === '';
    
    return isLocalhost
        ? 'http://localhost:7071/api/DescribeImage'
        : 'https://omlnautpromptle.azurewebsites.net/api/DescribeImage';
}

// Function to get prompt from image using Azure Function
async function getPromptFromImage(imageUrl) {
    console.log('Getting prompt from image...');
    const apiError = document.getElementById('api-error');
    apiError.textContent = ''; // Clear any previous errors
    
    const loadingContainer = document.createElement('div');
    loadingContainer.id = 'loading-message';
    loadingContainer.className = 'loading-container';
    
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    
    const loadingText = document.createElement('div');
    loadingText.className = 'loading-text';
    loadingText.textContent = 'Generating image description...';
    
    loadingContainer.appendChild(spinner);
    loadingContainer.appendChild(loadingText);
    
    document.getElementById('api-error').parentNode.insertBefore(loadingContainer, apiError);
    
    try {
        const backendUrl = getBackendUrl();
        console.log('Using backend URL:', backendUrl);
        
        const response = await fetch(backendUrl, {
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
        console.log('Received response:', data);

        if (data.words && data.words.length > 0) {
            // Set the generated prompt as the sentence to guess
            sentenceToGuess.length = 0; // Clear previous sentence
            data.words.forEach(word => {
                sentenceToGuess.push(word);
            });
            console.log('Sentence to guess:', sentenceToGuess);
            startGame();
        } else {
            throw new Error('No words received from the API');
        }
    } catch (error) {
        console.error('Error getting prompt from image:', error);
        apiError.textContent = 'Error generating prompt from image. Please try again.';
        throw error; // Re-throw to be handled by the caller
    } finally {
        // Remove loading message
        const loadingMessage = document.getElementById('loading-message');
        if (loadingMessage) {
            loadingMessage.remove();
        }
    }
}

// Function to set up image input handling (called only once at page load)
function setupImageInput() {
    const imageUrlInput = document.getElementById('image-url-input');
    const processButton = document.getElementById('start-button');
    const displayedImage = document.getElementById('displayed-image');
    const errorMessage = document.getElementById('image-error');

    // Remove any existing event listeners
    const newImageInput = imageUrlInput.cloneNode(true);
    imageUrlInput.parentNode.replaceChild(newImageInput, imageUrlInput);
    const newDisplayedImage = displayedImage.cloneNode(true);
    displayedImage.parentNode.replaceChild(newDisplayedImage, displayedImage);
    const newProcessButton = processButton.cloneNode(true);
    processButton.parentNode.replaceChild(newProcessButton, processButton);

    // Set up new event listeners
    newImageInput.addEventListener('input', function () {
        const url = newImageInput.value.trim();
        if (url) {
            newProcessButton.disabled = false;
            errorMessage.textContent = ''; // Clear error message when input changes
        } else {
            newProcessButton.disabled = true;
            newDisplayedImage.src = '';
            errorMessage.textContent = '';
        }
    });

    // Process button click handler
    newProcessButton.addEventListener('click', async function() {
        const url = newImageInput.value.trim();
        if (!url) {
            errorMessage.textContent = 'Please enter an image URL first.';
            return;
        }

        // Try to load the image first
        newDisplayedImage.src = url;
        newProcessButton.disabled = true;

        // Wait for image to load or fail
        try {
            await new Promise((resolve, reject) => {
                newDisplayedImage.onload = resolve;
                newDisplayedImage.onerror = reject;
            });

            // Image loaded successfully, now process it
            try {
                await getPromptFromImage(url);
                errorMessage.textContent = ''; // Clear error on success
            } catch (error) {
                console.error('Error getting prompt:', error);
                errorMessage.textContent = 'Error processing image. Please try a different URL.';
                newDisplayedImage.src = ''; // Clear the image on error
            }
        } catch (error) {
            console.error('Error loading image:', error);
            errorMessage.textContent = 'Failed to load image. Please check the URL.';
            newDisplayedImage.src = ''; // Clear the image on error
        } finally {
            newProcessButton.disabled = false;
        }
    });

    // Initially disable the process button
    newProcessButton.disabled = true;
}

// Initialize the game on page load
window.onload = function () {
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

// Modal functionality
const modal = document.getElementById('how-to-play-modal');
const btn = document.getElementById('how-to-play');
const span = document.getElementsByClassName('close')[0];

btn.onclick = function() {
    modal.style.display = 'block';
}

span.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
