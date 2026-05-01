import { describe, expect, test } from 'vitest';
import { getInputStringFromIso8601String, getIso8601StringFromInputString } from './duration';

describe('duration', () => {
    describe('getInputStringFromIso8601String', () => {
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

        test('should parse PT1.5S to 1s 500ms', () => {
            const result = getInputStringFromIso8601String('PT1.5S');
            expect(result).toContain('1s');
            expect(result).toContain('500ms');
        });

        test('should parse PT0.1S to 100ms', () => {
            expect(getInputStringFromIso8601String('PT0.1S')).toBe('100ms');
        });

        test('should handle PT0S', () => {
            expect(getInputStringFromIso8601String('PT0S')).toBe('');
        });

        test('should handle invalid input', () => {
            expect(getInputStringFromIso8601String('')).toBe('');
            expect(getInputStringFromIso8601String('invalid')).toBe('');
        });

        test('should carry over seconds into minutes (PT90S)', () => {
            const result = getInputStringFromIso8601String('PT90S');
            expect(result).toContain('1m');
            expect(result).toContain('30s');
        });

        test('should carry over minutes into hours (PT90M)', () => {
            const result = getInputStringFromIso8601String('PT90M');
            expect(result).toContain('1h');
            expect(result).toContain('30m');
        });

        test('should carry over hours into days (PT25H)', () => {
            const result = getInputStringFromIso8601String('PT25H');
            expect(result).toContain('1d');
            expect(result).toContain('1h');
        });

        test('should normalize weeks to days (P1W)', () => {
            expect(getInputStringFromIso8601String('P1W')).toBe('7d');
        });

        test('should carry over fractional minutes (PT1.5M)', () => {
            const result = getInputStringFromIso8601String('PT1.5M');
            expect(result).toContain('1m');
            expect(result).toContain('30s');
        });

        test('should carry over fractional hours (PT1.5H)', () => {
            const result = getInputStringFromIso8601String('PT1.5H');
            expect(result).toContain('1h');
            expect(result).toContain('30m');
        });

        test('should not produce invalid 1000ms when seconds value rounds up (PT0.9995S)', () => {
            const result = getInputStringFromIso8601String('PT0.9995S');
            expect(result).not.toContain('1000ms');
            expect(result).toBe('1s');
        });
    });

    describe('getIso8601StringFromInputString', () => {
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

        test('should convert 500ms to PT0.5S', () => {
            expect(getIso8601StringFromInputString('500ms')).toBe('PT0.5S');
        });

        test('should convert 1s 500ms to PT1.5S', () => {
            expect(getIso8601StringFromInputString('1s 500ms')).toBe('PT1.5S');
        });

        test('should roundtrip with milliseconds', () => {
            const input = '1d 2h 30m 45s 500ms';
            const iso = getIso8601StringFromInputString(input);
            const back = getInputStringFromIso8601String(iso);
            expect(back).toContain('1d');
            expect(back).toContain('2h');
            expect(back).toContain('30m');
            expect(back).toContain('45s');
            expect(back).toContain('500ms');
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
