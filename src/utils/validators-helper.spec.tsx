import { test, expect } from '../../playwright/ct-test';
import { buildValidationRules, getFieldErrorMessage } from './validators-helper';
import { validateRequired, validateEmail } from './validators';

test.describe('getFieldErrorMessage', () => {
    test('returns undefined when no error', () => {
        expect(getFieldErrorMessage({})).toBeUndefined();
        expect(getFieldErrorMessage({ error: 'x', isTouched: false })).toBeUndefined();
        expect(getFieldErrorMessage({ isTouched: true })).toBeUndefined();
    });

    test('returns string error as-is', () => {
        expect(getFieldErrorMessage({ error: 'Required', isTouched: true })).toBe('Required');
    });

    test('returns error.message when error is object', () => {
        expect(getFieldErrorMessage({ error: { message: 'Invalid email' }, isTouched: true })).toBe('Invalid email');
    });

    test('returns fallback when error has no message', () => {
        expect(getFieldErrorMessage({ error: {}, isTouched: true })).toBe('Invalid value');
        expect(getFieldErrorMessage({ error: {}, isTouched: true }, 'Custom fallback')).toBe('Custom fallback');
    });
});

test.describe('validators-helper', () => {
    test('should build validation rules with composed validators', () => {
        const rules = buildValidationRules([validateRequired(), validateEmail()]);

        expect(rules.validate('')).toBe('Required Field');
        expect(rules.validate('invalid')).toBe('Value must be a valid email address');
        expect(rules.validate('test@example.com')).toBeUndefined();
    });

    test('should work with empty validators array', () => {
        const rules = buildValidationRules([]);

        expect(rules.validate('any')).toBeUndefined();
    });
});
