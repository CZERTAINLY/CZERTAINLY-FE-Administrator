import { test, expect } from '../../../playwright/ct-test';
import { getAttributeCopyValue, attributeFieldNameTransform } from './attributes';
import { AttributeContentType } from 'types/openapi';

test.describe('attributes utils', () => {
    test.describe('attributeFieldNameTransform', () => {
        test('should have known field mappings', () => {
            expect(attributeFieldNameTransform.name).toBe('Name');
            expect(attributeFieldNameTransform.credentialProvider).toBe('Credential Provider');
        });
    });

    test.describe('getAttributeCopyValue', () => {
        test('should return undefined for empty content', () => {
            expect(getAttributeCopyValue(AttributeContentType.String, undefined)).toBeUndefined();
        });

        test('should format Boolean as string', () => {
            expect(getAttributeCopyValue(AttributeContentType.Boolean, [{ data: true } as any])).toBe('true');
            expect(getAttributeCopyValue(AttributeContentType.Boolean, [{ data: false } as any])).toBe('false');
        });

        test('should format Integer as string', () => {
            expect(getAttributeCopyValue(AttributeContentType.Integer, [{ data: 42 } as any])).toBe('42');
        });

        test('should format String as string', () => {
            expect(getAttributeCopyValue(AttributeContentType.String, [{ data: 'hello' } as any])).toBe('hello');
        });

        test('should return empty string for Secret (mapping returns undefined)', () => {
            expect(getAttributeCopyValue(AttributeContentType.Secret, [{ data: 'secret' } as any])).toBe('');
        });

        test('should join multiple content with comma', () => {
            expect(getAttributeCopyValue(AttributeContentType.String, [{ data: 'a' } as any, { data: 'b' } as any])).toBe('a, b');
        });
    });
});
