import { test, expect } from '../../../../playwright/ct-test';
import { ContentFieldConfiguration } from './contentFieldConfiguration';
import { AttributeContentType } from 'types/openapi';

test.describe('DynamicContent', () => {
    test('ContentFieldConfiguration has expected content types', () => {
        expect(ContentFieldConfiguration[AttributeContentType.String]).toBeDefined();
        expect(ContentFieldConfiguration[AttributeContentType.Text]).toBeDefined();
        expect(ContentFieldConfiguration[AttributeContentType.Integer]).toBeDefined();
        expect(ContentFieldConfiguration[AttributeContentType.Boolean]).toBeDefined();
        expect(ContentFieldConfiguration[AttributeContentType.String].type).toBe('text');
        expect(ContentFieldConfiguration[AttributeContentType.Boolean].type).toBe('checkbox');
    });
});
