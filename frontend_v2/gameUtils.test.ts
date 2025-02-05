import { compareWords, GetInitialWordFiltered, LetterState } from './gameUtils';

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
            LetterState.Absent,
            LetterState.Present
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
            LetterState.Correct,
            LetterState.Present,
            LetterState.Present,
            LetterState.Absent
        ]);
    });
});

describe('GetInitialWordFiltered', () => {
    test("returns an empty string for an empty string", () => {
        expect(GetInitialWordFiltered('')).toEqual('');
    });
    test("first and last letters different, filtered only contains those letters", () => {
        expect(GetInitialWordFiltered('ABCD')).toEqual('A  D');
    });
    test("first and last letters same, filtered only contains those letters", () => {
        expect(GetInitialWordFiltered('ABCA')).toEqual('A  A');
    });
    test("Only one letter, all gets revealed", () => {
        expect(GetInitialWordFiltered('AAAA')).toEqual('AAAA');
    });
    test("Only two letters, all gets revealed", () => {
        expect(GetInitialWordFiltered('ABAB')).toEqual('ABAB');
    });
}
);