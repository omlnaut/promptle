// script.js
const sentenceToGuess = ["HELLE", "WORLD", "HOW", "ARE", "YOU"];
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
    handleImageURLInput();
}

// Function to reset the game
function resetGame() {
    // Clear the image
    const displayedImage = document.getElementById('displayed-image');
    displayedImage.src = '';

    // Clear the image URL input field
    const imageUrlInput = document.getElementById('image-url-input');
    imageUrlInput.value = '';

    startGame();
}

// Function to handle image URL input
function handleImageURLInput() {
    const imageUrlInput = document.getElementById('image-url-input');
    const displayedImage = document.getElementById('displayed-image');

    imageUrlInput.addEventListener('input', function () {
        const url = imageUrlInput.value;
        displayedImage.src = url;
    });

    displayedImage.addEventListener('load', function () {
        // Once the image is loaded, request the prompt from the server
        getPromptFromImage(displayedImage.src);
    });

    displayedImage.addEventListener('error', function () {
        displayedImage.src = '';
        alert('Failed to load image. Please check the URL.');
    });
}

// Function to get prompt from image using OpenAI API
function getPromptFromImage(imageUrl) {
    console.log('Getting prompt from image...');
    const requestData = {
        model: "gpt-4o",
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: "come up with a prompt with at most 7 words that would generate this image as closely as possible" },
                    { type: "image_url", image_url: { url: imageUrl } }
                ]
            }
        ],
        max_tokens: 300
    };

    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer <redacted>`
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.choices && data.choices[0].message.content) {
                // Set the generated prompt as the sentence to guess
                sentenceToGuess.length = 0; // Clear previous sentence
                description = data.choices[0].message.content;
                words = description.split(' ');
                words = words.map(word => word.replace(/[^a-zA-Z]/g, '').toUpperCase())
                    .filter(word => word.length >= 3);

                words.forEach(word => {
                    sentenceToGuess.push(word);
                });
                console.log('Sentence to guess:', sentenceToGuess);
                startGame();
            } else {
                alert('Error generating prompt from image.');
            }
        })
        .catch(error => {
            console.error('Error getting prompt from image:', error);
            alert('Error getting prompt from image.');
        });
}



// Initialize the game on page load
window.onload = function () {
    handleImageURLInput();
    startGame();
};

// Event listeners
document.getElementById('check-button').addEventListener('click', checkGuess);
document.getElementById('reset-button').addEventListener('click', resetGame);
