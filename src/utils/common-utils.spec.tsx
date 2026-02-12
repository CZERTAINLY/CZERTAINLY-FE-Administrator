import { test, expect } from '../../playwright/ct-test';
import {
    removeNullValues,
    capitalize,
    getStepValue,
    isObjectSame,
    utf8ToBase64,
    base64ToUtf8,
    getFormTypeFromAttributeContentType,
    getFormTypeFromFilterFieldType,
} from './common-utils';
import { AttributeContentType, FilterFieldType } from 'types/openapi';

test.describe('common-utils', () => {
    test.describe('removeNullValues', () => {
        test('should return null for null/undefined', () => {
            expect(removeNullValues(null)).toBeNull();
            expect(removeNullValues(undefined)).toBeNull();
        });

        test('should remove null from object', () => {
            expect(removeNullValues({ a: 1, b: null, c: 3 })).toEqual({ a: 1, c: 3 });
        });

        test('should filter null from array', () => {
            expect(removeNullValues([1, null, 3])).toEqual([1, 3]);
        });

        test('should recursively remove nulls', () => {
            expect(removeNullValues({ a: { b: null, c: 1 } })).toEqual({ a: { c: 1 } });
        });

        test('should return primitives as-is', () => {
            expect(removeNullValues(42)).toBe(42);
            expect(removeNullValues('hello')).toBe('hello');
        });
    });

    test.describe('capitalize', () => {
        test('should capitalize first letter', () => {
            expect(capitalize('hello')).toBe('Hello');
        });

        test('should handle empty string', () => {
            expect(capitalize('')).toBe('');
        });

        test('should handle single character', () => {
            expect(capitalize('a')).toBe('A');
        });
    });

    test.describe('getStepValue', () => {
        test('should return 1 for datetime types', () => {
            expect(getStepValue('datetime')).toBe(1);
            expect(getStepValue('time')).toBe(1);
            expect(getStepValue('datetime-local')).toBe(1);
        });

        test('should return undefined for other types', () => {
            expect(getStepValue('text')).toBeUndefined();
            expect(getStepValue('number')).toBeUndefined();
        });
    });

    test.describe('isObjectSame', () => {
        test('should return true for same reference', () => {
            const obj = { a: 1 };
            expect(isObjectSame(obj, obj)).toBe(true);
        });

        test('should return true for structurally equal objects', () => {
            expect(isObjectSame({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
        });

        test('should return false for different objects', () => {
            expect(isObjectSame({ a: 1 }, { a: 2 })).toBe(false);
            expect(isObjectSame({ a: 1 }, { a: 1, b: 2 })).toBe(false);
        });

        test('should return false for null', () => {
            expect(isObjectSame({ a: 1 }, null as any)).toBe(false);
            expect(isObjectSame(null as any, { a: 1 })).toBe(false);
        });
    });

    test.describe('utf8ToBase64 and base64ToUtf8', () => {
        test('should encode and decode roundtrip', () => {
            const original = 'Hello, World!';
            const encoded = utf8ToBase64(original);
            expect(encoded).not.toBe(original);
            expect(base64ToUtf8(encoded)).toBe(original);
        });

        test('should handle unicode', () => {
            const original = 'Привіт';
            const encoded = utf8ToBase64(original);
            expect(base64ToUtf8(encoded)).toBe(original);
        });
    });

    test.describe('getFormTypeFromAttributeContentType', () => {
        test('should map Boolean to checkbox', () => {
            expect(getFormTypeFromAttributeContentType(AttributeContentType.Boolean)).toBe('checkbox');
        });

        test('should map Integer and Float to number', () => {
            expect(getFormTypeFromAttributeContentType(AttributeContentType.Integer)).toBe('number');
            expect(getFormTypeFromAttributeContentType(AttributeContentType.Float)).toBe('number');
        });

        test('should map Date to date', () => {
            expect(getFormTypeFromAttributeContentType(AttributeContentType.Date)).toBe('date');
        });

        test('should map Secret to password', () => {
            expect(getFormTypeFromAttributeContentType(AttributeContentType.Secret)).toBe('password');
        });

        test('should map Text and Codeblock to textarea', () => {
            expect(getFormTypeFromAttributeContentType(AttributeContentType.Text)).toBe('textarea');
            expect(getFormTypeFromAttributeContentType(AttributeContentType.Codeblock)).toBe('textarea');
        });

        test('should default to text for unknown', () => {
            expect(getFormTypeFromAttributeContentType('unknown' as AttributeContentType)).toBe('text');
        });
    });

    test.describe('getFormTypeFromFilterFieldType', () => {
        test('should map Date to date', () => {
            expect(getFormTypeFromFilterFieldType(FilterFieldType.Date)).toBe('date');
        });

        test('should map Datetime to datetime-local', () => {
            expect(getFormTypeFromFilterFieldType(FilterFieldType.Datetime)).toBe('datetime-local');
        });

        test('should map Number to number', () => {
            expect(getFormTypeFromFilterFieldType(FilterFieldType.Number)).toBe('number');
        });

        test('should default to text for unknown', () => {
            expect(getFormTypeFromFilterFieldType('unknown' as FilterFieldType)).toBe('text');
        });
    });
});
