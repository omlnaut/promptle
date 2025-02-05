// Game utility functions for Promptle
export var LetterState;
(function (LetterState) {
    LetterState[LetterState["Correct"] = 0] = "Correct";
    LetterState[LetterState["Present"] = 1] = "Present";
    LetterState[LetterState["Absent"] = 2] = "Absent";
})(LetterState || (LetterState = {}));
/**
 * Compares two strings and returns an array of LetterStates indicating the state of each letter in the first string
 * If a letter is not found in the second string, it is marked as `LetterState.Absent`
 * If a letter is found in the second string, but not in the same position, it is marked as `LetterState.Present`
 * If a letter is found in the second string and in the same position, it is marked as `LetterState.Correct`
 * @param input The string to compare
 * @param target The string to compare against
 * @returns An array of LetterStates indicating the state of each letter in the first string
 */
export function compareWords(input, target) {
    if (input.length !== target.length) {
        return [];
    }
    return input.split('').map((char, index) => {
        if (char === target[index])
            return LetterState.Correct;
        if (target.includes(char))
            return LetterState.Present;
        return LetterState.Absent;
    });
}
export function FilterInitialWord(target) {
    return target
        .split('')
        .map((char) => {
        if (char === target[0] || char === target[target.length - 1])
            return char;
        return ' ';
    })
        .join('');
}
export function CreateGuessStarter(previousGuess, target) {
    let starter = '';
    for (let i = 0; i < previousGuess.length; i++) {
        if (previousGuess[i] === target[i]) {
            starter += previousGuess[i];
        }
        else {
            starter += ' ';
        }
    }
    return starter;
}
