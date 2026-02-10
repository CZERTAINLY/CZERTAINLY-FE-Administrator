import { test, expect } from '../../playwright/ct-test';
import { getInputStringFromIso8601String, getIso8601StringFromInputString } from './duration';

test.describe('duration', () => {
    test.describe('getInputStringFromIso8601String', () => {
        test('should parse PT1H to 1h', () => {
            expect(getInputStringFromIso8601String('PT1H')).toBe('1h');
        });

        test('should parse PT30M to 30m', () => {
            expect(getInputStringFromIso8601String('PT30M')).toBe('30m');
        });

        test('should parse P1D to 1d', () => {
            expect(getInputStringFromIso8601String('P1D')).toBe('1d');
        });

        test('should parse PT1H30M', () => {
            const result = getInputStringFromIso8601String('PT1H30M');
            expect(result).toContain('1h');
            expect(result).toContain('30m');
        });

        test('should handle PT0S', () => {
            expect(getInputStringFromIso8601String('PT0S')).toBe('');
        });

        test('should handle invalid input', () => {
            expect(getInputStringFromIso8601String('')).toBe('');
            expect(getInputStringFromIso8601String('invalid')).toBe('');
        });
    });

    test.describe('getIso8601StringFromInputString', () => {
        test('should convert 1h to PT1H', () => {
            expect(getIso8601StringFromInputString('1h')).toBe('PT1H');
        });

        test('should convert 30m to PT30M', () => {
            expect(getIso8601StringFromInputString('30m')).toBe('PT30M');
        });

        test('should convert 1d to P1D', () => {
            expect(getIso8601StringFromInputString('1d')).toBe('P1D');
        });

        test('should convert 1d 2h 30m', () => {
            const result = getIso8601StringFromInputString('1d 2h 30m');
            expect(result).toContain('1D');
            expect(result).toContain('2H');
            expect(result).toContain('30M');
        });

        test('should roundtrip', () => {
            const input = '1d 2h 30m 45s';
            const iso = getIso8601StringFromInputString(input);
            const back = getInputStringFromIso8601String(iso);
            expect(back).toContain('1d');
            expect(back).toContain('2h');
            expect(back).toContain('30m');
            expect(back).toContain('45s');
        });
    });
});
