import { compareWords, LetterState } from './gameUtils';

describe('compareWords', () => {
    test('returns empty array for different length strings', () => {
        expect(compareWords('ABC', 'ABCD')).toEqual([]);
    });

    test('correctly identifies all correct letters', () => {
        expect(compareWords('HELLO', 'HELLO')).toEqual([
            LetterState.Correct,
            LetterState.Correct,
            LetterState.Correct,
            LetterState.Correct,
            LetterState.Correct
        ]);
    });

    test('correctly identifies present but misplaced letters', () => {
        expect(compareWords('WORLD', 'WORDS')).toEqual([
            LetterState.Correct,
            LetterState.Correct,
            LetterState.Correct,
            LetterState.Present,
            LetterState.Absent
        ]);
    });

    test('correctly identifies absent letters', () => {
        expect(compareWords('TESTS', 'HAPPY')).toEqual([
            LetterState.Absent,
            LetterState.Absent,
            LetterState.Absent,
            LetterState.Absent,
            LetterState.Absent
        ]);
    });

    test('handles mixed cases', () => {
        expect(compareWords('TEACH', 'PEACH')).toEqual([
            LetterState.Absent,
            LetterState.Correct,
            LetterState.Correct,
            LetterState.Correct,
            LetterState.Correct
        ]);
    });

    test('handles repeated letters in input', () => {
        expect(compareWords('TEETH', 'TENET')).toEqual([
            LetterState.Correct,
            LetterState.Present,
            LetterState.Absent,
            LetterState.Present,
            LetterState.Absent
        ]);
    });
});
