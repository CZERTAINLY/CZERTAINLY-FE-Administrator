import { test, expect } from '../../../../../playwright/ct-test';
import {
    transformInputValueForDescriptor,
    getSelectValueFromField,
    getFormTypeFromAttributeContentType,
    buildAttributeValidators,
    getUpdatedOptionsForEditSelect,
} from './attributeHelpers';
import { AttributeContentType } from 'types/openapi';

const minimalDataDescriptor = (contentType: AttributeContentType, required = false) =>
    ({
        contentType,
        properties: { required, label: 'Test', readOnly: false, visible: true, list: false },
    }) as any;

test.describe('attributeHelpers', () => {
    test.describe('transformInputValueForDescriptor', () => {
        test('returns value as-is for String', () => {
            const d = minimalDataDescriptor(AttributeContentType.String);
            expect(transformInputValueForDescriptor('hello', d)).toBe('hello');
        });

        test('formats Datetime via getFormattedDateTime', () => {
            const d = minimalDataDescriptor(AttributeContentType.Datetime);
            const result = transformInputValueForDescriptor('2024-01-15T10:00:00', d);
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
        });

        test('returns value ?? false for Boolean when required', () => {
            const d = minimalDataDescriptor(AttributeContentType.Boolean, true);
            expect(transformInputValueForDescriptor(undefined, d)).toBe(false);
            expect(transformInputValueForDescriptor(true, d)).toBe(true);
        });
    });

    test.describe('getSelectValueFromField', () => {
        test('multiSelect: returns empty array for empty value', () => {
            expect(getSelectValueFromField(undefined, true)).toEqual([]);
            expect(getSelectValueFromField(null, true)).toEqual([]);
        });

        test('multiSelect: maps array of objects to { value, label }', () => {
            const result = getSelectValueFromField([{ value: 1, label: 'One' }], true);
            expect(result).toEqual([{ value: 1, label: 'One' }]);
        });

        test('single: returns empty string for empty value', () => {
            expect(getSelectValueFromField(undefined, false)).toBe('');
        });

        test('single: returns .value from object', () => {
            expect(getSelectValueFromField({ value: 42, label: 'X' }, false)).toBe(42);
        });

        test('single: returns primitive as-is', () => {
            expect(getSelectValueFromField('hello', false)).toBe('hello');
            expect(getSelectValueFromField(123, false)).toBe(123);
        });
    });

    test.describe('getFormTypeFromAttributeContentType', () => {
        test('maps Boolean to checkbox', () => {
            expect(getFormTypeFromAttributeContentType(AttributeContentType.Boolean)).toBe('checkbox');
        });
        test('maps Integer and Float to number', () => {
            expect(getFormTypeFromAttributeContentType(AttributeContentType.Integer)).toBe('number');
            expect(getFormTypeFromAttributeContentType(AttributeContentType.Float)).toBe('number');
        });
        test('maps String to text', () => {
            expect(getFormTypeFromAttributeContentType(AttributeContentType.String)).toBe('text');
        });
        test('maps Text and Codeblock to textarea', () => {
            expect(getFormTypeFromAttributeContentType(AttributeContentType.Text)).toBe('textarea');
            expect(getFormTypeFromAttributeContentType(AttributeContentType.Codeblock)).toBe('textarea');
        });
        test('maps Date, Time, Datetime', () => {
            expect(getFormTypeFromAttributeContentType(AttributeContentType.Date)).toBe('date');
            expect(getFormTypeFromAttributeContentType(AttributeContentType.Time)).toBe('time');
            expect(getFormTypeFromAttributeContentType(AttributeContentType.Datetime)).toBe('datetime-local');
        });
        test('maps Secret to password', () => {
            expect(getFormTypeFromAttributeContentType(AttributeContentType.Secret)).toBe('password');
        });
    });

    test.describe('buildAttributeValidators', () => {
        test('returns a function for undefined descriptor', () => {
            const fn = buildAttributeValidators(undefined);
            expect(typeof fn).toBe('function');
        });

        test('returns a function for data descriptor', () => {
            const d = minimalDataDescriptor(AttributeContentType.String, true);
            const fn = buildAttributeValidators(d);
            expect(typeof fn).toBe('function');
        });
    });

    test.describe('getUpdatedOptionsForEditSelect', () => {
        test('returns options when valuesRecieved is empty', () => {
            const opts = [{ label: 'A', value: 1 }];
            expect(getUpdatedOptionsForEditSelect([], opts)).toBe(opts);
        });

        test('filters out options that appear in valuesRecieved', () => {
            const opts = [
                { label: 'A', value: 1 },
                { label: 'B', value: 2 },
            ];
            const result = getUpdatedOptionsForEditSelect([{ label: 'A', value: 1 }], opts);
            expect(result).toHaveLength(1);
            expect(result![0].label).toBe('B');
        });
    });
});
