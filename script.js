// script.js
const wordToGuess = "APPLE"
// Function to create input boxes
function createInputBoxes() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = ''; // Clear any existing input boxes

    for (let i = 0; i < wordToGuess.length; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.classList.add('letter-input');

        // Event listener to automatically move to the next input
        input.addEventListener('input', function () {
            this.value = this.value.toUpperCase();
            if (this.value && this.nextElementSibling) {
                this.nextElementSibling.focus();
            }
        });

        gameContainer.appendChild(input);
    }
}

// Call the function on page load
window.onload = createInputBoxes;

// script.js

// Event listener for the "Check" button
document.getElementById('check-button').addEventListener('click', checkGuess);

// Function to check the user's guess
function checkGuess() {
    const inputs = document.querySelectorAll('.letter-input');
    const userGuess = [];
    let wordArray = wordToGuess.split('');

    // Collect user input
    inputs.forEach(input => {
        userGuess.push(input.value.toUpperCase());
    });

    // Check for incomplete input
    if (userGuess.includes('')) {
        alert('Please fill in all the letters.');
        return;
    }

    // Evaluate the guess
    inputs.forEach((input, index) => {
        const letter = userGuess[index];

        if (letter === wordToGuess[index]) {
            // Correct letter and position
            input.style.backgroundColor = 'green';
            wordArray[index] = null; // Remove the letter from consideration
        } else if (wordArray.includes(letter)) {
            // Letter in word but wrong position
            input.style.backgroundColor = 'yellow';
            wordArray[wordArray.indexOf(letter)] = null; // Remove the letter
        } else {
            // Letter not in word
            input.style.backgroundColor = 'red';
        }
    });
}
