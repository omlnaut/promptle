import { compareWords, CreateGuessStarter, LetterState } from "./gameUtils.js";

export function getCurrentRow(gameContainer: HTMLDivElement, currentWordIndex: number): HTMLDivElement {
    const currentRowContainer = getCurrentRowContainer(gameContainer, currentWordIndex);
    const currentRow = currentRowContainer.firstElementChild as HTMLDivElement;

    return currentRow;
}

export function getCurrentRowContainer(gameContainer: HTMLDivElement, currentWordIndex: number): HTMLDivElement {
    return gameContainer.children[currentWordIndex] as HTMLDivElement;
}

export function setRowText(row: HTMLDivElement, text: string) {
    for (let i = 0; i < row.children.length; i++) {
        const child = row.children[i] as HTMLInputElement;
        const testWordLetter = text[i] === ' ' ? '' : text[i];

        child.value = testWordLetter;
    }
}

export function setFocusToFirstEmtpyInput(row: HTMLDivElement) {
    for (let i = 0; i < row.children.length; i++) {
        const child = row.children[i] as HTMLInputElement;
        console.log("Input value: " + child.value);
        if (!child.value) {
            child.focus();
            break;
        }
    }
}

export function createInput(getCurrentWord: () => string,
    increaseCurrentWordIndexCallback: () => void,
    getCurrentWordIndex: () => number,
    gameContainer: HTMLDivElement,
    maxWords: number) {
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
            } else if (this.previousElementSibling instanceof HTMLInputElement) {
                event.preventDefault();
                this.previousElementSibling.focus();
            }
        }
        else if (event.key === 'Enter') {
            const currentWord = getCurrentWord();
            const currentRow = getCurrentRow(gameContainer, getCurrentWordIndex());
            const values = Array.from(currentRow.children).map(input => (input as HTMLInputElement).value);
            const text = values.join('');

            if (text.length !== currentWord.length) {
                return;
            }
            console.log(text);

            const result = compareWords(text, currentWord);
            console.log(result);

            let guessCorrect = true;
            for (let i = 0; i < result.length; i++) {
                const child = currentRow.children[i] as HTMLInputElement;
                if (result[i] === LetterState.Correct) {
                    child.classList.add('correct');
                } else if (result[i] === LetterState.Present) {
                    guessCorrect = false;
                    child.classList.add('present');
                } else {
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
    });
    return input;
}


export function createRow(inputs: HTMLInputElement[]): HTMLDivElement {
    const rowDiv = document.createElement('div')
    for (let i = 0; i < inputs.length; i++) {
        rowDiv.appendChild(inputs[i]);
    }
    return rowDiv;

}