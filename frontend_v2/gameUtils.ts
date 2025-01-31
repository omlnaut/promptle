// Game utility functions for Promptle

export enum LetterState {
    Correct,
    Present,
    Absent,
}

/**
 * Compares two strings and returns an array of LetterStates indicating the state of each letter in the first string
 * @param input The string to compare
 * @param target The string to compare against
 * @returns An array of LetterStates indicating the state of each letter in the first string
 */
export function compareWords(input: string, target: string): LetterState[] {
    if (input.length !== target.length) {
        return [];
    }
    return input.split('').map((char, index) => {
        if (char === target[index]) return LetterState.Correct;
        if (target.includes(char)) return LetterState.Present;
        return LetterState.Absent;
    });
}
