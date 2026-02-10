import { test, expect } from '../../playwright/ct-test';
import { buildValidationRules } from './validators-helper';
import { validateRequired, validateEmail } from './validators';

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
