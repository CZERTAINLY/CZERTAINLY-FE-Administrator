import { test, expect } from '../../playwright/ct-test';
import {
    validateRequired,
    validatePattern,
    validateInteger,
    validatePositiveInteger,
    validateNonZeroInteger,
    validateFloat,
    validateEmail,
    validateLength,
    validateDuration,
    composeValidators,
    validateRoutelessUrl,
    validateUrlWithRoute,
    validateCustomIp,
    validateAlphaNumericWithoutAccents,
    validateAlphaNumericWithSpecialChars,
    validateOid,
    validateOidCode,
} from './validators';

test.describe('validators', () => {
    test.describe('validateRequired', () => {
        test('should return undefined for non-empty value', () => {
            expect(validateRequired()('test')).toBeUndefined();
            expect(validateRequired()(123)).toBeUndefined();
            expect(validateRequired()(true)).toBeUndefined();
            expect(validateRequired()([1, 2])).toBeUndefined();
        });

        test('should return error for empty value', () => {
            expect(validateRequired()('')).toBe('Required Field');
            expect(validateRequired()(undefined)).toBe('Required Field');
            expect(validateRequired()(null)).toBe('Required Field');
            expect(validateRequired()([])).toBe('Required Field');
        });

        test('should accept false as valid', () => {
            expect(validateRequired()(false)).toBeUndefined();
        });
    });

    test.describe('validatePattern', () => {
        test('should return undefined when value matches pattern', () => {
            const validator = validatePattern(/^[a-z]+$/);
            expect(validator('abc')).toBeUndefined();
        });

        test('should return default message when value does not match', () => {
            const validator = validatePattern(/^[a-z]+$/);
            expect(validator('ABC')).toContain('Value must conform');
        });

        test('should return custom message when provided', () => {
            const validator = validatePattern(/^\d+$/, 'Must be digits only');
            expect(validator('abc')).toBe('Must be digits only');
        });

        test('should return undefined for empty value', () => {
            const validator = validatePattern(/^[a-z]+$/);
            expect(validator('')).toBeUndefined();
            expect(validator(undefined)).toBeUndefined();
        });
    });

    test.describe('validateInteger', () => {
        test('should accept valid integers', () => {
            expect(validateInteger()('123')).toBeUndefined();
            expect(validateInteger()('-456')).toBeUndefined();
            expect(validateInteger()('0')).toBeUndefined();
        });

        test('should reject non-integers', () => {
            expect(validateInteger()('12.3')).toBe('Value must be an integer');
            expect(validateInteger()('abc')).toBe('Value must be an integer');
        });
    });

    test.describe('validatePositiveInteger', () => {
        test('should accept positive integers', () => {
            expect(validatePositiveInteger()('123')).toBeUndefined();
            expect(validatePositiveInteger()('0')).toBeUndefined();
        });

        test('should reject negatives and non-integers', () => {
            expect(validatePositiveInteger()('-1')).toBe('Value must be a positive integer');
            expect(validatePositiveInteger()('12.5')).toBe('Value must be a positive integer');
        });
    });

    test.describe('validateNonZeroInteger', () => {
        test('should accept non-zero integers', () => {
            expect(validateNonZeroInteger()('123')).toBeUndefined();
            expect(validateNonZeroInteger()('-5')).toBeUndefined();
        });

        test('should reject zero and non-integers', () => {
            expect(validateNonZeroInteger()('0')).toBe('Value must be a non-zero integer');
            expect(validateNonZeroInteger()('12.5')).toBe('Value must be a non-zero integer');
        });
    });

    test.describe('validateDuration', () => {
        test('should accept valid duration strings', () => {
            expect(validateDuration()('1d')).toBeUndefined();
            expect(validateDuration()('2h 30m')).toBeUndefined();
            expect(validateDuration()('1s')).toBeUndefined();
        });

        test('should accept empty value', () => {
            expect(validateDuration()('')).toBeUndefined();
            expect(validateDuration()('   ')).toBeUndefined();
        });

        test('should reject invalid duration', () => {
            expect(validateDuration()('invalid')).toBeTruthy();
            expect(validateDuration()('1x')).toBeTruthy();
        });
    });

    test.describe('validateFloat', () => {
        test('should accept valid floats', () => {
            expect(validateFloat()('123.45')).toBeUndefined();
            expect(validateFloat()('-0.5')).toBeUndefined();
            expect(validateFloat()('123')).toBeUndefined();
        });

        test('should reject invalid floats', () => {
            expect(validateFloat()('abc')).toBe('Value must be a float without an exponent.');
        });
    });

    test.describe('validateEmail', () => {
        test('should accept valid emails', () => {
            expect(validateEmail()('test@example.com')).toBeUndefined();
            expect(validateEmail()('user.name@domain.co')).toBeUndefined();
        });

        test('should reject invalid emails', () => {
            expect(validateEmail()('invalid')).toBe('Value must be a valid email address');
            expect(validateEmail()('missing@')).toBe('Value must be a valid email address');
        });
    });

    test.describe('validateLength', () => {
        test('should accept value within range', () => {
            const validator = validateLength(2, 5);
            expect(validator('ab')).toBeUndefined();
            expect(validator('abcde')).toBeUndefined();
        });

        test('should reject value too short', () => {
            const validator = validateLength(2, 5);
            expect(validator('a')).toBe('Value must be between 2 and 5 characters long');
        });

        test('should reject value too long', () => {
            const validator = validateLength(2, 5);
            expect(validator('abcdef')).toBe('Value must be between 2 and 5 characters long');
        });
    });

    test.describe('composeValidators', () => {
        test('should return first error from validators', () => {
            const validator = composeValidators(validateRequired(), validateEmail());
            expect(validator('')).toBe('Required Field');
            expect(validator('invalid')).toBe('Value must be a valid email address');
            expect(validator('test@example.com')).toBeUndefined();
        });

        test('should filter non-function validators', () => {
            const validator = composeValidators(validateRequired(), undefined, null, validateEmail());
            expect(validator('test@example.com')).toBeUndefined();
        });
    });

    test.describe('validateRoutelessUrl', () => {
        test('should accept valid urls', () => {
            expect(validateRoutelessUrl()('localhost:8443')).toBeUndefined();
            expect(validateRoutelessUrl()('https://example.com')).toBeUndefined();
        });

        test('should reject invalid urls', () => {
            expect(validateRoutelessUrl()('https://example.com/path')).toBeTruthy();
        });
    });

    test.describe('validateUrlWithRoute', () => {
        test('should accept empty value', () => {
            expect(validateUrlWithRoute('')).toBeUndefined();
        });

        test('should accept valid url with path', () => {
            expect(validateUrlWithRoute('https://example.com/path')).toBeUndefined();
        });

        test('should reject invalid url', () => {
            expect(validateUrlWithRoute('invalid url with spaces')).toBe('Value must be a valid url');
        });
    });

    test.describe('validateAlphaNumericWithSpecialChars', () => {
        test('should accept valid strings with spaces and separators', () => {
            expect(validateAlphaNumericWithSpecialChars()('John Doe')).toBeUndefined();
            expect(validateAlphaNumericWithSpecialChars()(`O\'Brien`)).toBeUndefined();
        });

        test('should reject invalid format', () => {
            expect(validateAlphaNumericWithSpecialChars()('invalid@char')).toBeTruthy();
        });
    });

    test.describe('validateCustomIp', () => {
        test('should accept valid IP', () => {
            expect(validateCustomIp('192.168.1.1')).toBeUndefined();
            expect(validateCustomIp('255.255.255.255')).toBeUndefined();
        });

        test('should reject invalid IP', () => {
            expect(validateCustomIp('256.1.1.1')).toBe('Value must be a valid ip address');
            expect(validateCustomIp('not-an-ip')).toBe('Value must be a valid ip address');
        });
    });

    test.describe('validateAlphaNumericWithoutAccents', () => {
        test('should accept alphanumeric with allowed chars', () => {
            expect(validateAlphaNumericWithoutAccents()('abc123')).toBeUndefined();
            expect(validateAlphaNumericWithoutAccents()('test_id-1.value')).toBeUndefined();
        });

        test('should reject spaces', () => {
            expect(validateAlphaNumericWithoutAccents()('hello world')).toBeTruthy();
        });
    });

    test.describe('validateOid', () => {
        test('should accept valid OID', () => {
            expect(validateOid()('1.2.3.4')).toBeUndefined();
        });

        test('should reject invalid OID', () => {
            expect(validateOid()('invalid')).toBe('Value must be a valid OID');
        });
    });

    test.describe('validateOidCode', () => {
        test('should accept valid OID code', () => {
            expect(validateOidCode()('MyOID')).toBeUndefined();
            expect(validateOidCode()('OID-123')).toBeUndefined();
        });

        test('should reject invalid OID code', () => {
            expect(validateOidCode()('123')).toBe('Value must be a valid OID code');
        });
    });
});
