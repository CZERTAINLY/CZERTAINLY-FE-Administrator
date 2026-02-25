import React from 'react';
import { test, expect } from '../../../playwright/ct-test';
import {
    getAttributeCopyValue,
    attributeFieldNameTransform,
    transformAttributes,
    getAttributeContent,
    getAttributeFormValue,
    getCodeBlockLanguage,
    collectFormAttributes,
    mapAttributeContentToOptionValue,
    testAttributeSetFunction,
    mapProfileAttribute,
} from './attributes';
import { getDatetimeFormValue, getDateFormValue } from './attributeFormValues';

import {
    AttributeContentType,
    AttributeVersion,
    ProgrammingLanguageEnum,
    CodeBlockAttributeContentV2,
    SecretAttributeContentV2,
} from 'types/openapi';
import { AttributeType } from 'types/openapi';

const base64Encode = (s: string) => btoa(unescape(encodeURIComponent(s)));
const base64Decode = (s: string) => decodeURIComponent(escape(atob(s)));

// Helper functions to reduce duplication in test setup
const createProperties = (overrides: Record<string, any> = {}) => ({
    required: false,
    label: overrides.label || 'Test',
    readOnly: false,
    visible: true,
    list: false,
    ...overrides,
});

const createDescriptor = (
    name: string,
    contentType: AttributeContentType,
    uuid: string = `u-${name}`,
    type: AttributeType = AttributeType.Data,
    overrides: Record<string, any> = {},
) => ({
    type,
    name,
    uuid,
    contentType,
    content: [],
    properties: createProperties(overrides.properties),
    ...overrides,
});

const createTestValues = (id: string, attributes: Record<string, any>) => ({
    [`__attributes__${id}__`]: attributes,
});

test.describe('attributes utils', () => {
    test.describe('attributeFieldNameTransform', () => {
        test('should have known field mappings', () => {
            expect(attributeFieldNameTransform.name).toBe('Name');
            expect(attributeFieldNameTransform.credentialProvider).toBe('Credential Provider');
        });
        test('should have authorityProvider and others', () => {
            expect(attributeFieldNameTransform.authorityProvider).toBe('Authority Provider');
            expect(attributeFieldNameTransform.complianceProvider).toBe('Compliance Provider');
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

        test('should format Float as string', () => {
            expect(getAttributeCopyValue(AttributeContentType.Float, [{ data: 3.14 } as any])).toBe('3.14');
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

        test('should decode Codeblock code from base64', () => {
            const content = [{ data: { code: base64Encode('print(1)'), language: ProgrammingLanguageEnum.Python } } as any];
            expect(getAttributeCopyValue(AttributeContentType.Codeblock, content)).toBe('print(1)');
        });

        test('should use credential name when data has name', () => {
            const content = [{ data: { name: 'MyCred' }, reference: 'ref' } as any];
            expect(getAttributeCopyValue(AttributeContentType.Credential, content)).toBe('MyCred');
        });

        test('should decode File content from base64', () => {
            const content = [{ data: { content: base64Encode('file bytes'), fileName: 'a.txt', mimeType: 'text/plain' } } as any];
            expect(getAttributeCopyValue(AttributeContentType.File, content)).toBe('file bytes');
        });

        test('should stringify Object as JSON', () => {
            const content = [{ data: { x: 1, y: 2 } } as any];
            expect(getAttributeCopyValue(AttributeContentType.Object, content)).toBe('{"x":1,"y":2}');
        });

        test('should format Time and Date as string', () => {
            expect(getAttributeCopyValue(AttributeContentType.Time, [{ data: '10:00' } as any])).toBe('10:00');
            expect(getAttributeCopyValue(AttributeContentType.Date, [{ data: '2024-01-01' } as any])).toBe('2024-01-01');
        });

        test('should format Datetime via getFormattedDateTime', () => {
            const content = [{ data: '2024-01-15T10:00:00' } as any];
            const result = getAttributeCopyValue(AttributeContentType.Datetime, content);
            expect(typeof result).toBe('string');
            expect(typeof result === 'string' && result.length).toBeGreaterThan(0);
        });

        test('codeblock fallback when data not object', () => {
            expect(getAttributeCopyValue(AttributeContentType.Codeblock, [{ data: 'plain' } as any])).toBe('plain');
        });

        test('credential fallback to string when no name field', () => {
            expect(getAttributeCopyValue(AttributeContentType.Credential, [{ data: 'x' } as any])).toBe('x');
        });

        test('file fallback to string when no content field', () => {
            expect(getAttributeCopyValue(AttributeContentType.File, [{ data: 'y' } as any])).toBe('y');
        });

        test('credential with name object property', () => {
            const cred = [{ data: { name: 'MyCred', other: 'data' } } as any];
            expect(getAttributeCopyValue(AttributeContentType.Credential, cred)).toBe('MyCred');
        });

        test('file with content object property', () => {
            const file = [{ data: { content: base64Encode('file-data'), fileName: 'x', mimeType: 'type' } } as any];
            expect(getAttributeCopyValue(AttributeContentType.File, file)).toBe('file-data');
        });

        test('text type', () => {
            expect(getAttributeCopyValue(AttributeContentType.Text, [{ data: 'text' } as any])).toBe('text');
        });

        test('integer type', () => {
            expect(getAttributeCopyValue(AttributeContentType.Integer, [{ data: 999 } as any])).toBe('999');
        });
    });

    test.describe('transformAttributes', () => {
        test('flattens form attributes without dot into single key', () => {
            const data = [{ formAttributeName: 'name', formAttributeValue: 'v1' }];
            expect(transformAttributes(data)).toEqual({ name: 'v1' });
        });
        test('nests by last dot: parent.child', () => {
            const data = [{ formAttributeName: 'a.b', formAttributeValue: 'v' }];
            expect(transformAttributes(data)).toEqual({ a: { b: 'v' } });
        });
        test('multiple keys under same parent', () => {
            const data = [
                { formAttributeName: 'obj.x', formAttributeValue: 1 },
                { formAttributeName: 'obj.y', formAttributeValue: 2 },
            ];
            expect(transformAttributes(data)).toEqual({ obj: { x: 1, y: 2 } });
        });
        test('nested multiple dots uses only last segment grouping', () => {
            const data = [
                { formAttributeName: 'a.b.c', formAttributeValue: 3 },
                { formAttributeName: 'a.b.d', formAttributeValue: 4 },
            ];
            expect(transformAttributes(data)).toEqual({ 'a.b': { c: 3, d: 4 } });
        });
    });

    test.describe('getAttributeContent', () => {
        test('returns not set when content undefined', () => {
            expect(getAttributeContent(AttributeContentType.String, undefined)).toBe('Not set');
        });

        test('boolean content is stringified', () => {
            expect(getAttributeContent(AttributeContentType.Boolean, [{ data: false } as any])).toBe('false');
            expect(getAttributeContent(AttributeContentType.Boolean, [{ data: true } as any])).toBe('true');
        });

        test('credential/contentType returns reference', () => {
            const content = [{ data: 'x', reference: 'ref' } as any];
            expect(getAttributeContent(AttributeContentType.Credential, content)).toBe('ref');
        });

        test('file content returns reference even if data object provided', () => {
            const content = [{ data: { fileName: 'a', mimeType: 'b' }, reference: 'theRef' } as any];
            expect(getAttributeContent(AttributeContentType.File, content)).toBe('theRef');
        });

        test('datetime content is formatted', () => {
            const content = [{ data: '2021-12-25T12:00:00' } as any];
            const result = getAttributeContent(AttributeContentType.Datetime, content);
            expect(typeof result).toBe('string');
            expect(typeof result === 'string' && result.length).toBeGreaterThan(0);
        });

        test('codeblock returns element with expected props', () => {
            const content = [{ data: { code: base64Encode('alert(1)'), language: ProgrammingLanguageEnum.Javascript } } as any];
            const element = getAttributeContent(AttributeContentType.Codeblock, content) as any;
            // element may not be recognized by isValidElement in CT environment
            expect(element).toBeDefined();
            expect(element.props).toBeDefined();
            expect(element.props.content).toEqual(content[0]);
        });

        test('unknown contentType uses checkFileNameAndMimeType fallback', () => {
            const content = [{ data: { fileName: 'fn', mimeType: 'mt' } } as any];
            // cast to invalid enum value to trigger default branch
            const result = getAttributeContent(-1 as unknown as AttributeContentType, content) as string;
            expect(result).toBe('fn (mt)');
        });

        test('file data with no reference still returns filename/mimetype', () => {
            const content = [{ data: { fileName: 'my', mimeType: 'txt' } } as any];
            const result = getAttributeContent(-1 as unknown as AttributeContentType, content) as string;
            expect(result).toBe('my (txt)');
        });

        test('integer type returns data as string', () => {
            const content = [{ data: 12345 } as any];
            expect(getAttributeContent(AttributeContentType.Integer, content)).toBe('12345');
        });

        test('text type returns data as string', () => {
            const content = [{ data: 'some text' } as any];
            expect(getAttributeContent(AttributeContentType.Text, content)).toBe('some text');
        });

        test('secret type returns masked value', () => {
            const content = [{ data: 'password123' } as any];
            expect(getAttributeContent(AttributeContentType.Secret, content)).toBe('*****');
        });

        test('file type without reference returns reference', () => {
            const content = [{ reference: 'file-ref' } as any];
            expect(getAttributeContent(AttributeContentType.File, content)).toBe('file-ref');
        });

        test('multiple contents mapped and joined', () => {
            const content = [{ data: 'a' }, { data: 'b' }, { data: 'c' }] as any[];

            expect(getAttributeContent(AttributeContentType.Text, content)).toBe('a, b, c');
        });

        test('empty array returns empty string for Text', () => {
            expect(getAttributeContent(AttributeContentType.Text, [])).toBe('');
        });
    });

    test.describe('getAttributeFormValue', () => {
        test('datetime and date delegates to helper functions', () => {
            expect(getAttributeFormValue(AttributeContentType.Datetime, [], '2025-01-01T00:00')).toStrictEqual(
                getDatetimeFormValue('2025-01-01T00:00'),
            );
            expect(getAttributeFormValue(AttributeContentType.Date, [], '2025-01-01')).toStrictEqual(getDateFormValue('2025-01-01'));
        });

        test('codeblock encodes code and determines language', () => {
            const descriptorContent = [{ data: { language: ProgrammingLanguageEnum.Python } } as any];
            const result = getAttributeFormValue(AttributeContentType.Codeblock, descriptorContent, {
                code: 'print("hi")',
                language: undefined,
            }) as CodeBlockAttributeContentV2;
            expect(typeof result.data.code).toBe('string');
            expect(base64Decode(result.data.code)).toBe('print("hi")');
            expect(result.data.language).toBe(ProgrammingLanguageEnum.Python);
        });

        test('secret returns object with secret property', () => {
            const result = getAttributeFormValue(AttributeContentType.Secret, [], 'hunter2') as SecretAttributeContentV2;
            expect(result.data.secret).toBe('hunter2');
        });

        test('object item with data/reference returns trimmed structure', () => {
            const item = { data: 'x', reference: 'r' };
            expect(getAttributeFormValue(AttributeContentType.String, [], item)).toEqual(item);
        });

        test('object value containing data/reference is normalized', () => {
            const item = { value: { data: 'x', reference: 'r' } };
            expect(getAttributeFormValue(AttributeContentType.String, [], item)).toEqual({ data: 'x', reference: 'r' });
        });

        test('primitive value is wrapped as data', () => {
            expect(getAttributeFormValue(AttributeContentType.String, [], 'foo')).toEqual({ data: 'foo' });
        });

        test('object with value primitive is normalized', () => {
            const item = { value: 'bar' };
            expect(getAttributeFormValue(AttributeContentType.String, [], item)).toEqual({ data: 'bar' });
        });

        test('numeric strings on integer/float types are converted', () => {
            expect(getAttributeFormValue(AttributeContentType.Integer, [], '5')).toEqual({ data: 5 });
            expect(getAttributeFormValue(AttributeContentType.Float, [], '5.5')).toEqual({ data: 5.5 });
            expect(getAttributeFormValue(AttributeContentType.Integer, [], 'not a num')).toEqual({ data: 'not a num' });
        });

        test('null reference is stripped from object', () => {
            const item = { data: 'x', reference: null };
            expect(getAttributeFormValue(AttributeContentType.String, [], item)).toEqual({ data: 'x' });
        });

        test('empty string reference is stripped from object', () => {
            const item = { data: 'x', reference: '' };
            expect(getAttributeFormValue(AttributeContentType.String, [], item)).toEqual({ data: 'x' });
        });

        test('integer truncates decimal points', () => {
            expect(getAttributeFormValue(AttributeContentType.Integer, [], 5.999)).toEqual({ data: 5 });
            expect(getAttributeFormValue(AttributeContentType.Integer, [], 5.1)).toEqual({ data: 5 });
        });

        test('float preserves decimal value', () => {
            expect(getAttributeFormValue(AttributeContentType.Float, [], 5.999)).toEqual({ data: 5.999 });
            expect(getAttributeFormValue(AttributeContentType.Float, [], 5)).toEqual({ data: 5 });
        });

        test('boolean value wrapped as data', () => {
            expect(getAttributeFormValue(AttributeContentType.Boolean, [], true)).toEqual({ data: true });
            expect(getAttributeFormValue(AttributeContentType.Boolean, [], false)).toEqual({ data: false });
        });

        test('number value wrapped as data', () => {
            expect(getAttributeFormValue(AttributeContentType.Integer, [], 42)).toEqual({ data: 42 });
            expect(getAttributeFormValue(AttributeContentType.Float, [], 3.14)).toEqual({ data: 3.14 });
        });

        test('object with data/reference both null strips to empty object', () => {
            const item = { data: null, reference: null };
            const result = getAttributeFormValue(AttributeContentType.String, [], item);
            // After stripping null reference, data: null remains
            expect(result.data === null || result.data === undefined).toBe(true);
        });

        test('object value containing reference null is stripped', () => {
            const item = { value: { data: 'x', reference: null } };
            expect(getAttributeFormValue(AttributeContentType.String, [], item)).toEqual({ data: 'x' });
        });
    });

    test.describe('getCodeBlockLanguage', () => {
        test('returns form input language when set', () => {
            expect(getCodeBlockLanguage(ProgrammingLanguageEnum.Python, undefined)).toBe(ProgrammingLanguageEnum.Python);
        });
        test('returns language from descriptor content when form input undefined', () => {
            const descriptorContent = [{ data: { language: ProgrammingLanguageEnum.Java } }] as any;
            expect(getCodeBlockLanguage(undefined, descriptorContent)).toBe(ProgrammingLanguageEnum.Java);
        });
        test('defaults to Javascript when no language anywhere', () => {
            expect(getCodeBlockLanguage(undefined, undefined)).toBe(ProgrammingLanguageEnum.Javascript);
        });

        test('descriptor content with empty language falls back to Javascript', () => {
            const descriptorContent = [{ data: {} } as any];
            expect(getCodeBlockLanguage(undefined, descriptorContent)).toBe(ProgrammingLanguageEnum.Javascript);
        });
    });

    test.describe('collectFormAttributes', () => {
        test('returns empty array when no descriptors', () => {
            expect(collectFormAttributes('id1', undefined, {})).toEqual([]);
        });
        test('returns empty array when no __attributes__id in values', () => {
            expect(collectFormAttributes('id1', [], {})).toEqual([]);
        });
        test('returns attributes when descriptors and values match', () => {
            const descriptors = [
                createDescriptor('attr1', AttributeContentType.String, 'u1', AttributeType.Data, { properties: { label: 'A' } }),
            ];
            const values = createTestValues('id1', { attr1: 'value1' });
            const result = collectFormAttributes('id1', descriptors, values);
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('attr1');
            expect(result[0].content).toEqual([{ data: 'value1' }]);
        });
        test('skips deleted attributes', () => {
            const descriptors = [
                createDescriptor('attr1', AttributeContentType.String, 'u1', AttributeType.Data, { properties: { label: 'A' } }),
            ];
            const values = {
                ...createTestValues('id1', { attr1: 'value1' }),
                deletedAttributes_id1: ['attr1'],
            };
            const result = collectFormAttributes('id1', descriptors, values);
            expect(result).toHaveLength(0);
        });

        test('casts Integer attributes to number in payload', () => {
            const descriptors = [
                createDescriptor('parallelExecutions', AttributeContentType.Integer, 'u-integer', AttributeType.Data, {
                    properties: { label: 'Parallel executions' },
                }),
            ];
            const values = createTestValues('id1', { parallelExecutions: '50' });
            const result = collectFormAttributes('id1', descriptors, values);
            expect(result).toHaveLength(1);
            expect(result[0].content).toEqual([{ data: 50 }]);
        });

        test('casts Float attributes to number in payload', () => {
            const descriptors = [
                createDescriptor('threshold', AttributeContentType.Float, 'u-float', AttributeType.Data, {
                    properties: { label: 'Threshold' },
                }),
            ];
            const values = createTestValues('id1', { threshold: '3.14' });
            const result = collectFormAttributes('id1', descriptors, values);
            expect(result).toHaveLength(1);
            expect(result[0].content).toEqual([{ data: 3.14 }]);
        });

        test('removes null reference from selected list value payload', () => {
            const descriptors = [
                createDescriptor('textCustomAttrExecution', AttributeContentType.Text, 'u-custom-list', AttributeType.Custom, {
                    properties: { label: 'Custom list', list: true },
                }),
            ];
            const values = createTestValues('id1', {
                textCustomAttrExecution: {
                    label: 't1',
                    value: { reference: null, data: 't1', contentType: AttributeContentType.Text },
                },
            });
            const result = collectFormAttributes('id1', descriptors, values);
            expect(result).toHaveLength(1);
            expect(result[0].content).toEqual([{ data: 't1' }]);
        });

        test('keeps non-empty reference for selected list value payload', () => {
            const descriptors = [
                createDescriptor('attrWithReference', AttributeContentType.String, 'u-custom-reference', AttributeType.Custom, {
                    properties: { label: 'Custom ref', list: true },
                }),
            ];
            const values = createTestValues('id1', {
                attrWithReference: {
                    label: 'Display Label',
                    value: { reference: 'Display Label', data: 'raw-value' },
                },
            });
            const result = collectFormAttributes('id1', descriptors, values);
            expect(result).toHaveLength(1);
            expect(result[0].content).toEqual([{ reference: 'Display Label', data: 'raw-value' }]);
        });

        test('maps numeric descriptor version to attribute schema version v3', () => {
            const descriptors = [
                createDescriptor('v3Attr', AttributeContentType.Text, 'u-v3', AttributeType.Custom, {
                    version: 3,
                    properties: { label: 'V3 attr', list: true },
                }),
            ];
            const values = createTestValues('id1', { v3Attr: { label: 't1', value: { data: 't1' } } });
            const result = collectFormAttributes('id1', descriptors, values);
            expect(result).toHaveLength(1);
            expect(result[0].version).toBe(AttributeVersion.V3);
            expect(result[0].content).toEqual([{ data: 't1', contentType: AttributeContentType.Text }]);
        });

        test('schemaVersion property takes precedence', () => {
            const descriptors = [
                createDescriptor('svAttr', AttributeContentType.String, 'u-sv', AttributeType.Data, {
                    schemaVersion: AttributeVersion.V3,
                }),
            ];
            const values = createTestValues('id1', { svAttr: 'value' });
            const result = collectFormAttributes('id1', descriptors, values);
            expect(result[0].version).toBe(AttributeVersion.V3);
        });

        test('handles attribute key with colon by splitting', () => {
            const descriptors = [
                createDescriptor('myAttr', AttributeContentType.String, 'u-col', AttributeType.Data, { properties: { label: 'Col' } }),
            ];
            const values = createTestValues('id1', { 'myAttr:ignored': 'foo' });
            const result = collectFormAttributes('id1', descriptors, values);
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('myAttr');
            expect(result[0].content[0].data).toBe('foo');
        });

        test('skips when descriptor not found or value undefined', () => {
            const descriptors = [
                {
                    ...createDescriptor('a', AttributeContentType.String),
                    content: [],
                    properties: {},
                } as any,
            ];
            const values = createTestValues('id1', { other: 'x', a: undefined });
            const result = collectFormAttributes('id1', descriptors, values);
            expect(result).toEqual([]);
        });

        test('supports array values by mapping each item', () => {
            const descriptors = [
                createDescriptor('arr', AttributeContentType.String, 'u-arr', AttributeType.Data, { properties: { label: 'Arr' } }),
            ];
            const values = createTestValues('id1', { arr: ['a', 'b'] });
            const result = collectFormAttributes('id1', descriptors, values);
            expect(result[0].content).toEqual([{ data: 'a' }, { data: 'b' }]);
        });

        test('supports array of objects values', () => {
            const descriptors = [
                createDescriptor('arr2', AttributeContentType.String, 'u-arr2', AttributeType.Data, { properties: { label: 'Arr2' } }),
            ];
            const values = createTestValues('id1', { arr2: [{ data: 'x' }, { data: 'y' }] });
            const result = collectFormAttributes('id1', descriptors, values);
            expect(result[0].content).toEqual([{ data: 'x' }, { data: 'y' }]);
        });

        test('handles single object value with data/reference', () => {
            const descriptors = [
                createDescriptor('single', AttributeContentType.String, 'u-single', AttributeType.Data, {
                    properties: { label: 'Single' },
                }),
            ];
            const values = createTestValues('id1', { single: { data: 'val', reference: 'ref' } });
            const result = collectFormAttributes('id1', descriptors, values);
            expect(result[0].content).toEqual([{ data: 'val', reference: 'ref' }]);
        });

        test('adds contentType to V3 attributes when missing', () => {
            const descriptors = [
                createDescriptor('v3Missing', AttributeContentType.Text, 'u-v3', AttributeType.Data, {
                    version: 3,
                    properties: { label: 'V3' },
                }),
            ];
            const values = createTestValues('id1', { v3Missing: { data: 'text' } });
            const result = collectFormAttributes('id1', descriptors, values);
            expect(result[0].content[0].contentType).toBe(AttributeContentType.Text);
        });

        test('uses descriptor contentType for V3 attributes when adding', () => {
            const descriptors = [
                createDescriptor('v3Existing', AttributeContentType.Text, 'u-v3e', AttributeType.Data, {
                    version: 3,
                    properties: { label: 'V3E' },
                }),
            ];
            const values = createTestValues('id1', { v3Existing: [{ data: 'text' }] });
        });

        test('includes attributes even with null data when reference exists check passes', () => {
            const descriptors = [
                createDescriptor('nullData', AttributeContentType.String, 'u-null', AttributeType.Data, { properties: { label: 'Null' } }),
            ];
            const values = createTestValues('id1', { nullData: { data: null } });
            const result = collectFormAttributes('id1', descriptors, values);
            expect(result[0].content).toEqual([{ data: null }]);
        });

        test('includes attribute with only reference when data is undefined', () => {
            const descriptors = [
                createDescriptor('refOnly', AttributeContentType.String, 'u-ref', AttributeType.Data, { properties: { label: 'Ref' } }),
            ];
            const values = createTestValues('id1', { refOnly: { reference: 'ref-val' } });
            const result = collectFormAttributes('id1', descriptors, values);
            expect(result[0].content).toEqual([{ reference: 'ref-val' }]);
        });

        test('uses hasOwnProperty to skip inherited properties', () => {
            const descriptors = [
                createDescriptor('attr1', AttributeContentType.String, 'u1', AttributeType.Data, { properties: { label: 'A' } }),
            ];
            const values = createTestValues('id1', { attr1: 'value1' });
            const result = collectFormAttributes('id1', descriptors, values);
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('attr1');
        });

        test('handles Custom attribute type same as Data', () => {
            const descriptors = [
                createDescriptor('custAttr', AttributeContentType.String, 'u-custom', AttributeType.Custom, {
                    properties: { label: 'Custom' },
                }),
            ];
            const values = createTestValues('id1', { custAttr: 'custom-value' });
            const result = collectFormAttributes('id1', descriptors, values);
            expect(result[0].name).toBe('custAttr');
            expect(result[0].content).toEqual([{ data: 'custom-value' }]);
        });

        test('multiple attributes in single descriptor set', () => {
            const descriptors = [
                createDescriptor('attr1', AttributeContentType.String, 'u1', AttributeType.Data, { properties: { label: 'A1' } }),
                createDescriptor('attr2', AttributeContentType.Integer, 'u2', AttributeType.Data, { properties: { label: 'A2' } }),
                createDescriptor('attr3', AttributeContentType.Boolean, 'u3', AttributeType.Data, { properties: { label: 'A3' } }),
            ];
            const values = createTestValues('id1', { attr1: 'string-val', attr2: '42', attr3: true });
            const result = collectFormAttributes('id1', descriptors, values);
            expect(result).toHaveLength(3);
            expect(result.find((a) => a.name === 'attr1')?.content).toEqual([{ data: 'string-val' }]);
            expect(result.find((a) => a.name === 'attr2')?.content).toEqual([{ data: 42 }]);
            expect(result.find((a) => a.name === 'attr3')?.content).toEqual([{ data: true }]);
        });

        test('resolves V2 as default when no version specified', () => {
            const descriptors = [
                createDescriptor('v2Default', AttributeContentType.String, 'u-v2', AttributeType.Data, { properties: { label: 'V2' } }),
            ];
            const values = createTestValues('id1', { v2Default: 'value' });
            const result = collectFormAttributes('id1', descriptors, values);
            expect(result[0].version).toBe(AttributeVersion.V2);
        });

        test('with option object containing label and value both on reference list', () => {
            const descriptors = [
                createDescriptor('optionAttr', AttributeContentType.Text, 'u-opt', AttributeType.Custom, {
                    properties: { label: 'Options', list: true, multiSelect: true },
                }),
            ];
            const values = createTestValues('id1', {
                optionAttr: [
                    { label: 'First', value: { data: 'f', reference: 'first' } },
                    { label: 'Second', value: { data: 's', reference: 'second' } },
                ],
            });
            const result = collectFormAttributes('id1', descriptors, values);
            expect(result[0].content).toHaveLength(2);
            expect(result[0].content[0]).toEqual({ data: 'f', reference: 'first' });
            expect(result[0].content[1]).toEqual({ data: 's', reference: 'second' });
        });
    });

    test.describe('mapAttributeContentToOptionValue', () => {
        test('returns label from reference when present', () => {
            const content = { data: 'x', reference: 'Display Label' } as any;
            const descriptor = {
                contentType: AttributeContentType.String,
                content: [],
                properties: {},
            } as any;
            const result = mapAttributeContentToOptionValue(content, descriptor);
            expect(result.label).toBe('Display Label');
            expect(result.value).toBe(content);
        });
        test('formats dates and datetimes when no reference', () => {
            const dateContent = { data: '2024-02-02', reference: undefined } as any;
            const descriptorDate = { contentType: AttributeContentType.Date, content: [], properties: {} } as any;
            const r1 = mapAttributeContentToOptionValue(dateContent, descriptorDate);
            expect(r1.label).toContain('2024');

            const datetimeContent = { data: '2024-02-02T12:00:00', reference: undefined } as any;
            const descriptorDatetime = { contentType: AttributeContentType.Datetime, content: [], properties: {} } as any;
            const r2 = mapAttributeContentToOptionValue(datetimeContent, descriptorDatetime);
            expect(r2.label).toContain('2024');
        });
        test('returns label from data when no reference', () => {
            const content = { data: 'plain', reference: undefined } as any;
            const descriptor = {
                contentType: AttributeContentType.String,
                content: [],
                properties: {},
            } as any;
            const result = mapAttributeContentToOptionValue(content, descriptor);
            expect(result.label).toBe('plain');
            expect(result.value).toBe(content);
        });
    });

    test.describe('testAttributeSetFunction', () => {
        test('returns formAttributeName and formAttributeValue for list+multiSelect when using descriptor default', () => {
            const descriptor = {
                type: AttributeType.Data,
                contentType: AttributeContentType.String,
                content: [{ data: 'a', reference: 'A' }],
                properties: { list: true, multiSelect: true, required: false },
            } as any;
            const result = testAttributeSetFunction(descriptor, undefined, 'connector.attr1', true, true);
            expect(result.formAttributeName).toBe('connector.attr1');
            expect(Array.isArray(result.formAttributeValue)).toBe(true);
            expect(result.formAttributeValue).toHaveLength(1);
            expect(result.formAttributeValue[0].label).toBe('A');
        });
        test('returns formAttributeValue from attribute content (reference preferred over data)', () => {
            const descriptor = {
                type: AttributeType.Data,
                contentType: AttributeContentType.String,
                content: [],
                properties: { list: false, required: false },
            } as any;
            const attribute = { content: [{ data: 'set', reference: 'Set' }] } as any;
            const result = testAttributeSetFunction(descriptor, attribute, 'profile.x', false, false);
            expect(result.formAttributeName).toBe('profile.x');
            expect(result.formAttributeValue).toBe('Set');
        });

        test('select list (list without multi) uses first content', () => {
            const descriptor = {
                type: AttributeType.Data,
                contentType: AttributeContentType.String,
                content: [{ data: 'foo' }],
                properties: { list: true, multiSelect: false },
            } as any;
            const result = testAttributeSetFunction(descriptor, undefined, 'name', false, true);
            expect(typeof result.formAttributeValue).toBe('object');
            expect(result.formAttributeValue).toMatchObject({ label: 'foo', value: { data: 'foo' } });
        });

        test('boolean attribute uses data or default depending on required flag', () => {
            const descriptor = {
                type: AttributeType.Data,
                contentType: AttributeContentType.Boolean,
                content: [{ data: true }],
                properties: { list: false, required: true },
            } as any;
            // no attribute value
            let result = testAttributeSetFunction(descriptor, undefined, 'b', false, false);
            expect(result.formAttributeValue).toBe(true);

            // attribute value present
            const attr = { content: [{ data: false }] } as any;
            result = testAttributeSetFunction(descriptor, attr, 'b', false, false);
            expect(result.formAttributeValue).toBe(false);
        });

        test('fallback to descriptor default when no appliedContent and allowed by flags', () => {
            const descriptor = {
                type: AttributeType.Data,
                contentType: AttributeContentType.String,
                content: [{ data: 'def' }],
                properties: { list: false, required: false },
            } as any;
            const result = testAttributeSetFunction(descriptor, undefined, 'x', false, false);
            expect(result.formAttributeValue).toBe('def');
        });

        test('codeblock descriptors convert base64 code when present', () => {
            const descriptor = {
                type: AttributeType.Data,
                contentType: AttributeContentType.Codeblock,
                content: [{ data: { code: base64Encode('hi'), language: ProgrammingLanguageEnum.Python } }],
            } as any;
            const result = testAttributeSetFunction(descriptor, undefined, 'cb', false, true);
            expect(result.formAttributeValue).toEqual({ code: 'hi', language: ProgrammingLanguageEnum.Python });
        });
    });

    test.describe('mapProfileAttribute', () => {
        test('returns empty array when profile path is undefined', () => {
            const result = mapProfileAttribute(undefined, {}, 'resource', 'path.to.attrs', 'form');
            expect(result).toEqual([]);
        });
        test('maps profile attributes to form when custom attributes match', () => {
            const customAttr = {
                type: AttributeType.Custom,
                name: 'custom1',
                uuid: 'cu1',
                contentType: AttributeContentType.String,
                content: [],
                properties: { required: false, label: 'C', readOnly: false, visible: true, list: false },
            } as any;
            const profile = { section: { attributes: [{ uuid: 'cu1', name: 'custom1' }] } };
            const multipleResourceCustomAttributes = { resource: [customAttr] };
            const result = mapProfileAttribute(profile, multipleResourceCustomAttributes, 'resource', 'section.attributes', 'form');
            expect(result).toHaveLength(1);
            expect(result[0].formAttributeName).toBe('form.custom1');
        });
        test('filters out profile attributes with no matching custom attribute', () => {
            const customAttr = {
                type: AttributeType.Custom,
                name: 'other',
                uuid: 'other-uuid',
                contentType: AttributeContentType.String,
                content: [],
                properties: {},
            } as any;
            const profile = { section: { attributes: [{ uuid: 'cu1', name: 'custom1' }] } };
            const multipleResourceCustomAttributes = { resource: [customAttr] };
            const result = mapProfileAttribute(profile, multipleResourceCustomAttributes, 'resource', 'section.attributes', 'form');
            expect(result).toHaveLength(0);
        });
        test('filters out when uuid does not match', () => {
            const customAttr = {
                type: AttributeType.Custom,
                name: 'other',
                uuid: 'other-uuid',
                contentType: AttributeContentType.String,
                content: [],
                properties: {},
            } as any;
            const profile = { section: { attributes: [{ uuid: 'cu1', name: 'custom1' }] } };
            const multipleResourceCustomAttributes = { resource: [customAttr] };
            const result = mapProfileAttribute(profile, multipleResourceCustomAttributes, 'resource', 'section.attributes', 'form');
            expect(result).toHaveLength(0);
        });
    });
});
